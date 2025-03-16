const functions = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firestore if not already initialized
const db = admin.firestore ? admin.firestore() : admin.initializeApp().firestore();

/**
 * Process article content with OpenRouter API
 * - Generates a TLDR summary
 * - Categorizes the content 
 * - Rates the article's interest level
 */
exports.processArticleContent = functions.onCall({
    maxInstances: 10,
    timeoutSeconds: 120,
    minInstances: 0,
}, async (data, context) => {
    try {
        console.log("Received process content request:", data);

        // Verify authentication if needed
        // Skip auth check in development mode
        if (process.env.NODE_ENV !== 'development' && !context.auth) {
            throw new Error('Authentication required');
        }

        // In development mode, skip admin check
        if (process.env.NODE_ENV !== 'development') {
            // Check if user has admin privileges
            const userRef = db.collection('users').doc(context.auth.uid);
            const userDoc = await userRef.get();
            const userData = userDoc.data();

            if (!userData || !userData.role || userData.role !== 'admin') {
                throw new Error('Unauthorized. Admin privileges required.');
            }
        }

        // Get the content from the request
        const { content, title, url } = data || {};

        console.log("Processed content parameters:", {
            hasContent: Boolean(content),
            contentLength: content ? content.length : 0,
            title,
            url
        });

        if (!content || content.trim() === '') {
            throw new Error('Content is required');
        }

        // Get OpenRouter API key
        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        if (!openRouterApiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        // In development mode with a test API key, return mock results
        if (process.env.NODE_ENV === 'development' && openRouterApiKey.includes('test')) {
            console.log("Using mock processing results for development");

            const mockResult = {
                summary: "This article discusses advances in geological research focused on understanding plate tectonics and their relationship to seismic activity. Researchers have developed new models that better predict earthquake patterns by analyzing historical data and using machine learning algorithms. The findings suggest that subtle crustal movements detected by satellite imaging can provide early warning signs weeks before major seismic events.",
                category: "geology",
                interestLevel: 85,
                model: "mock-model",
                processingTime: new Date().toISOString()
            };

            // Store the results in Firestore
            const docRef = db.collection('processed_articles').doc();
            await docRef.set({
                original: {
                    content: content.substring(0, 10000), // Limit content size
                    title,
                    url
                },
                processed: mockResult,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                userId: context.auth ? context.auth.uid : 'development-user'
            });

            return {
                success: true,
                result: mockResult,
                id: docRef.id
            };
        }

        // Prepare content to process
        const textContent = prepareContent(content);

        // Process with OpenRouter
        const result = await processWithOpenRouter(textContent, title, url, openRouterApiKey);

        // Store the results in Firestore
        const docRef = db.collection('processed_articles').doc();
        await docRef.set({
            original: {
                content: content.substring(0, 10000), // Limit content size
                title,
                url
            },
            processed: result,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId: context.auth ? context.auth.uid : 'development-user'
        });

        return {
            success: true,
            result,
            id: docRef.id
        };
    } catch (error) {
        console.error('Error processing content:', error);

        // Handle rate limiting
        if (error.response && error.response.status === 429) {
            return {
                success: false,
                error: 'API rate limit exceeded. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED'
            };
        }

        return {
            success: false,
            error: error.message || 'Unknown error processing content'
        };
    }
});

/**
 * Prepare content by cleaning it
 */
function prepareContent(content) {
    // Clean up the content
    const textContent = content.toString()
        .replace(/<[^>]*>/g, ' ')  // Strip HTML tags
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim()
        .substring(0, 8000);       // Limit content length for API

    return textContent;
}

/**
 * Process content using OpenRouter API
 */
async function processWithOpenRouter(content, title, url, apiKey) {
    // First, attempt to call the API
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'anthropic/claude-3-haiku-20240307',
                    fallbacks: ['openai/gpt-3.5-turbo', 'google/gemini-pro'],
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a specialized geoscience content analyzer that provides concise summaries and categorization of scientific content.'
                        },
                        {
                            role: 'user',
                            content: `Analyze this geoscience article content with title "${title || 'Untitled'}" ${url ? 'from ' + url : ''}:
              
              ${content}
              
              Please provide:
              1. A concise TLDR summary (100-150 words)
              2. Categorize the content into ONE of these categories: geology, climate, oceanography, research, industry, technology
              3. Rate the article's interest level from 1-100 based on scientific significance, novelty, and potential impact
              
              Format your response as a JSON object with keys: "summary", "category", and "interestLevel"`
                        }
                    ],
                    max_tokens: 800,
                    response_format: { "type": "json_object" }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://geobit.example.com',
                        'X-Title': 'GeoBit Content Processing'
                    }
                }
            );

            // Parse the response
            const responseData = response.data;

            if (responseData.choices && responseData.choices.length > 0) {
                // Extract the JSON content from the response
                const content = responseData.choices[0].message.content;
                let resultJSON;

                try {
                    resultJSON = JSON.parse(content);
                } catch (error) {
                    console.error('Error parsing JSON from API response:', error);
                    resultJSON = {
                        summary: 'Failed to extract summary from API response.',
                        category: 'unknown',
                        interestLevel: 50
                    };
                }

                // Validate the structure
                return {
                    summary: resultJSON.summary || 'No summary provided',
                    category: resultJSON.category || 'unknown',
                    interestLevel: parseInt(resultJSON.interestLevel) || 50,
                    model: responseData.model,
                    processingTime: new Date().toISOString()
                };
            }

            throw new Error('Invalid API response structure');
        } catch (error) {
            retries++;

            if (error.response && error.response.status === 429) {
                console.log('Rate limited, retrying after delay...');
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            } else if (retries >= maxRetries) {
                throw error;
            } else {
                // Other error, retry with backoff
                console.error(`API call failed (attempt ${retries}):`, error.message);
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
    }

    throw new Error('Failed after multiple retries');
} 