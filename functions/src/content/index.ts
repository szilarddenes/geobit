import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { verifyAdminToken } from '../admin';

// Initialize Firestore
const db = admin.firestore();

// Get OpenRouter API key
const getOpenRouterApiKey = () => {
  return functions.config().openrouter?.api_key || process.env.OPENROUTER_API_KEY;
};

// Collect content from AI search
const searchContentFromAI = functions.https.onCall(async (request, context) => {
  try {
    // Verify admin token
    const { token, query, categories = ['research', 'news'] } = request.data || {};
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      throw new Error('Unauthorized access');
    }
    
    if (!query) {
      throw new Error('Search query is required');
    }
    
    // Log the search request
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'api',
      message: 'AI search request initiated',
      details: { query, categories },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Use OpenRouter API to search for content
    const openRouterApiKey = getOpenRouterApiKey();
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    // Create the system message for AI with search instructions
    const systemMessage = `You are an AI assistant helping find and summarize geoscience content. 
      Your task is to search for content related to "${query}" in these categories: ${categories.join(', ')}.
      For each search result, provide:
      1. Title
      2. URL
      3. Source name
      4. Published date (in ISO format)
      5. A concise summary (100-150 words)
      6. Category (must be one of: ${categories.join(', ')})
      7. Interest score (1-100)
      
      Format your output as a valid JSON array of objects with the following structure:
      [
        {
          "title": "Article title",
          "url": "https://example.com/article",
          "source": "Source name",
          "publishedAt": "2025-03-13T00:00:00Z",
          "summary": "Brief summary of the article...",
          "category": "research",
          "interestScore": 85
        }
      ]
      
      Provide 5-10 high-quality, recent results that would be valuable to geoscientists.`;
    
    // Make the OpenRouter API request
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Search for ${query} in geoscience ${categories.join(', ')}` }
        ],
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Process the AI response
    const aiResponse = response.data.choices[0].message.content;
    
    // Attempt to extract JSON from the AI response
    let jsonContent;
    try {
      // Extract JSON if it's wrapped in backticks
      const jsonMatch = aiResponse.match(/```(?:json)?([\s\S]+?)```/);
      if (jsonMatch) {
        jsonContent = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try parsing directly
        jsonContent = JSON.parse(aiResponse);
      }
    } catch (error) {
      console.error('Error parsing AI response as JSON:', error);
      throw new Error('Could not parse AI response as valid JSON');
    }
    
    // Store the search results in Firestore
    const batch = db.batch();
    const searchResultsRef = db.collection('searchResults').doc();
    batch.set(searchResultsRef, {
      query,
      categories,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      resultCount: jsonContent.length
    });
    
    // Store each content item individually
    const contentRefs = [];
    for (const item of jsonContent) {
      // Generate a unique ID for the content
      const contentRef = db.collection('content').doc();
      contentRefs.push(contentRef.id);
      
      // Add to batch
      batch.set(contentRef, {
        ...item,
        searchId: searchResultsRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending' // can be: pending, approved, rejected
      });
    }
    
    // Update the search results with the content IDs
    batch.update(searchResultsRef, {
      contentIds: contentRefs
    });
    
    // Commit the batch
    await batch.commit();
    
    // Log the successful search
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'api',
      message: 'AI search completed successfully',
      details: { 
        query, 
        categories,
        resultCount: jsonContent.length,
        searchId: searchResultsRef.id
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      content: jsonContent,
      searchId: searchResultsRef.id
    };
  } catch (error) {
    console.error('Error searching content from AI:', error);
    
    // Log the error
    await db.collection('systemLogs').add({
      level: 'error',
      service: 'ai',
      message: 'AI search failed',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        query: request.data?.query 
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

// Collect content from sources
const collectContentFromSources = functions.https.onCall(async (request, context) => {
  try {
    // Verify admin token
    const { token, sourceIds } = request.data || {};
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      throw new Error('Unauthorized access');
    }
    
    if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
      throw new Error('At least one source ID is required');
    }
    
    // Log the collection request
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'scraper',
      message: 'Content collection initiated',
      details: { sourceIds },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Get the sources
    const sourcesSnapshot = await db.collection('contentSources')
      .where(admin.firestore.FieldPath.documentId(), 'in', sourceIds)
      .get();
    
    const sources = sourcesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as { id: string; url: string; name: string; category: string; scrapeSelector?: string }[];
    
    if (sources.length === 0) {
      throw new Error('No valid sources found');
    }
    
    // Start a collection job
    const collectionRef = await db.collection('contentCollections').add({
      sourceIds,
      status: 'in_progress',
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      contentCount: 0,
      errors: []
    });
    
    // Simulate collecting content from each source
    // In production, this would be a background process that scrapes each source
    const openRouterApiKey = getOpenRouterApiKey();
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    // Process sources in batches
    let contentCount = 0;
    const errors: { sourceId: string; error: string }[] = [];
    const contentItems: { id: string; title: string; source: string; url: string; category: string }[] = [];
    
    // Process each source
    for (const source of sources) {
      try {
        // Fetch the page content
        const response = await axios.get(source.url);
        const html = response.data;
        
        // Create a system message for AI to extract content
        const systemMessage = `You are an AI assistant that extracts and summarizes geoscience content from web pages.
          I'll provide you with HTML content from ${source.name} (${source.category}).
          
          Please extract the 3-5 most recent and relevant geoscience articles/content.
          For each item, provide:
          1. Title
          2. URL (if available, or construct it based on the source URL: ${source.url})
          3. Published date (in ISO format, or estimate based on context)
          4. A concise summary (100-150 words)
          5. Category (${source.category})
          6. Interest score (1-100)
          
          Format your output as a valid JSON array of objects with this structure:
          [
            {
              "title": "Article title",
              "url": "https://example.com/article",
              "publishedAt": "2025-03-13T00:00:00Z",
              "summary": "Brief summary of the article...",
              "category": "${source.category}",
              "interestScore": 85
            }
          ]`;
        
        // Make the OpenRouter API request for content extraction
        const aiResponse = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'openai/gpt-4o',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: html.substring(0, 15000) } // First 15K characters to avoid token limits
            ],
            temperature: 0.5,
            max_tokens: 2048
          },
          {
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Parse the AI response
        let extractedContent;
        try {
          extractedContent = parseAIResponse(aiResponse.data.choices[0].message.content);
          
          if (!Array.isArray(extractedContent) || extractedContent.length === 0) {
            throw new Error('AI did not return any content items');
          }
        } catch (error) {
          console.error(`Error processing AI response for source ${source.id}:`, error);
          errors.push({
            sourceId: source.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          continue;
        }
        
        // Add source information to each item
        extractedContent.forEach(item => {
          item.source = source.name;
          item.sourceId = source.id;
          contentItems.push(item);
        });
        
        contentCount += extractedContent.length;
      } catch (error) {
        console.error(`Error collecting content from source ${source.name}:`, error);
        errors.push({
          sourceId: source.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Log the error
        await db.collection('systemLogs').add({
          level: 'error',
          service: 'scraper',
          message: `Error collecting content from source: ${source.name}`,
          details: { 
            sourceId: source.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    // Store the collected content in Firestore
    const batch = db.batch();
    
    for (const item of contentItems) {
      const contentRef = db.collection('content').doc();
      
      batch.set(contentRef, {
        ...item,
        collectionId: collectionRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending' // pending, approved, rejected
      });
    }
    
    // Update the collection job
    batch.update(collectionRef, {
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      contentCount,
      errors,
      sources: sources.map(s => s.name)
    });
    
    // Commit the batch
    await batch.commit();
    
    // Log the successful collection
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'scraper',
      message: 'Content collection completed',
      details: { 
        collectionId: collectionRef.id,
        sourceCount: sources.length,
        contentCount,
        errorCount: errors.length
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      contentCount,
      sources: sources.length,
      errors: errors.length,
      collectionId: collectionRef.id
    };
  } catch (error) {
    console.error('Error collecting content from sources:', error);
    
    // Log the error
    await db.collection('systemLogs').add({
      level: 'error',
      service: 'content',
      message: 'Content collection failed',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

// Get content
const getContent = functions.https.onCall(async (request, context) => {
  try {
    // Verify admin token
    const { token, status, category, limit = 20, offset = 0 } = request.data || {};
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      throw new Error('Unauthorized access');
    }
    
    // Build the query
    let query = db.collection('content')
      .orderBy('createdAt', 'desc');
    
    // Apply filters if provided
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    // Execute the query
    const contentSnapshot = await query.get();
    
    // Extract the content items
    const contentItems = contentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get total count (for production, implement proper pagination with cursors)
    const countSnapshot = await db.collection('content').count().get();
    const total = countSnapshot.data().count;
    
    return { 
      success: true, 
      content: contentItems,
      pagination: {
        total,
        limit,
        offset
      }
    };
  } catch (error) {
    console.error('Error getting content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

// Update content status
const updateContentStatus = functions.https.onCall(async (request, context) => {
  try {
    // Verify admin token
    const { token, contentId, status } = request.data || {};
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      throw new Error('Unauthorized access');
    }
    
    if (!contentId) {
      throw new Error('Content ID is required');
    }
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be pending, approved, or rejected');
    }
    
    // Update in Firestore
    await db.collection('content').doc(contentId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Log the status update
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'admin',
      message: `Content status updated to ${status}`,
      details: { contentId },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating content status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

// Save content
const saveContent = functions.https.onCall(async (request, context) => {
  try {
    // Verify admin token
    const { token, contentId, updates } = request.data || {};
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      throw new Error('Unauthorized access');
    }
    
    if (!contentId) {
      throw new Error('Content ID is required');
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }
    
    // Check if the content exists
    const contentDoc = await db.collection('content').doc(contentId).get();
    if (!contentDoc.exists) {
      throw new Error('Content not found');
    }
    
    // Define fields that can be updated
    const allowedFields = [
      'title', 'summary', 'content', 'category', 'tags', 
      'status', 'source', 'sourceUrl', 'imageUrl'
    ];
    
    // Filter out fields that can't be updated
    const sanitizedUpdates = Object.entries(updates)
      .filter(([key]) => allowedFields.includes(key))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, any>);
    
    if (Object.keys(sanitizedUpdates).length === 0) {
      throw new Error('No valid updates provided');
    }
    
    // Add metadata
    sanitizedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    sanitizedUpdates.editedByAdmin = true;
    
    // Update in Firestore
    await db.collection('content').doc(contentId).update(sanitizedUpdates);
    
    // Log the content update
    await db.collection('systemLogs').add({
      level: 'info',
      service: 'content',
      message: `Content updated by admin: ${contentId}`,
      details: { 
        contentId,
        fields: Object.keys(sanitizedUpdates).filter(k => k !== 'updatedAt' && k !== 'editedByAdmin')
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

// Helper function to parse AI response
const parseAIResponse = (responseText: string) => {
  try {
    const aiResponse = JSON.parse(responseText);
    return aiResponse;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Could not parse AI response as valid JSON: ${errorMessage}`);
  }
};

// Export functions
export default {
  searchContentFromAI,
  collectContentFromSources,
  getContent,
  updateContentStatus,
  saveContent
};