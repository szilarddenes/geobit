const functions = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firestore if not already initialized
const db = admin.firestore ? admin.firestore() : admin.initializeApp().firestore();

/**
 * Search for geoscience news using the Perplexity API
 * - Accepts search parameters
 * - Stores results in Firestore
 * - Includes pagination and deduplication
 */
exports.searchGeoscienceNews = functions.onCall({
    maxInstances: 10,
    timeoutSeconds: 300, // Longer timeout for search functionality
    minInstances: 0,
}, async (data, context) => {
    try {
        // Verify authentication if needed
        if (!context.auth) {
            throw new Error('Authentication required');
        }

        // Check if user has admin privileges
        const userRef = db.collection('users').doc(context.auth.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (!userData || !userData.role || userData.role !== 'admin') {
            throw new Error('Unauthorized. Admin privileges required.');
        }

        // Get search parameters
        const {
            keywords = '',
            dateRange = { start: null, end: null },
            sources = [],
            page = 1,
            limit = 10
        } = data;

        if (!keywords) {
            throw new Error('Keywords are required for search');
        }

        // Get OpenRouter API key (accessing Perplexity through OpenRouter)
        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        if (!openRouterApiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        // Build search query
        const searchQuery = buildSearchQuery(keywords, dateRange, sources);

        // Check if similar search exists in cache
        const cachedResults = await checkSearchCache(searchQuery);
        if (cachedResults) {
            // Return paginated results from cache
            return paginateResults(cachedResults, page, limit);
        }

        // Search with Perplexity via OpenRouter
        const searchResults = await searchWithPerplexity(searchQuery, openRouterApiKey);

        // Process and validate results
        const processedResults = processSearchResults(searchResults);

        // Store results in Firestore
        const searchRef = await storeSearchResults(searchQuery, processedResults, context.auth.uid);

        // Return paginated results
        return paginateResults({
            results: processedResults,
            id: searchRef.id,
            query: searchQuery
        }, page, limit);
    } catch (error) {
        console.error('Error searching news:', error);

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
            error: error.message || 'Unknown error during search'
        };
    }
});

/**
 * Build a search query from parameters
 */
function buildSearchQuery(keywords, dateRange, sources) {
    let query = keywords.trim();

    // Add date constraints if provided
    if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        if (!isNaN(startDate.getTime())) {
            query += ` after:${startDate.toISOString().substring(0, 10)}`;
        }
    }

    if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        if (!isNaN(endDate.getTime())) {
            query += ` before:${endDate.toISOString().substring(0, 10)}`;
        }
    }

    // Add sources if provided
    if (sources && sources.length > 0) {
        query += ` site:${sources.join(' OR site:')}`;
    }

    // Always focus on geoscience
    query += ' geoscience geology earth science research';

    return query;
}

/**
 * Check if similar search exists in cache
 */
async function checkSearchCache(query) {
    // Normalize query for comparison
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();

    // Look for recent similar searches within the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    try {
        const searchesRef = db.collection('news_searches');
        const snapshot = await searchesRef
            .where('timestamp', '>', oneDayAgo)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        if (snapshot.empty) {
            return null;
        }

        // Check if any of the recent searches match closely
        for (const doc of snapshot.docs) {
            const searchData = doc.data();
            const storedQuery = searchData.query.toLowerCase().replace(/\s+/g, ' ').trim();

            // Compare normalized queries
            const similarity = calculateSimilarity(normalizedQuery, storedQuery);
            if (similarity > 0.8) {
                return {
                    results: searchData.results,
                    id: doc.id,
                    query: searchData.query
                };
            }
        }
    } catch (error) {
        console.error('Error checking search cache:', error);
    }

    return null;
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(str1, str2) {
    // Simple word overlap calculation
    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

/**
 * Search with Perplexity API via OpenRouter
 */
async function searchWithPerplexity(searchQuery, apiKey) {
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'perplexity/sonar-small-online',
                    fallbacks: ['perplexity/sonar-small-chat', 'anthropic/claude-3-haiku-20240307'],
                    messages: [
                        {
                            role: 'system',
                            content: `You are a geoscience research assistant that helps find relevant, recent scientific news articles and research papers. Format your results as a JSON array of article objects.`
                        },
                        {
                            role: 'user',
                            content: `Search for recent scientific articles, news, and research papers about: "${searchQuery}"
              
              For each result, provide:
              1. Title of the article
              2. URL to the original source
              3. Publication date (ISO format if possible)
              4. Source/publisher name
              5. A concise summary (2-3 sentences)
              6. The main category (geology, climate, oceanography, research, industry, or technology)
              
              Format your response as a JSON array of objects with these keys: title, url, date, source, summary, category.
              Include at least 10 relevant results if available. Ensure all URLs are valid and complete.`
                        }
                    ],
                    max_tokens: 1500,
                    tools: [{ "type": "web_search" }],
                    tool_choice: { "type": "web_search" },
                    response_format: { "type": "json_object" }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://geobit.example.com',
                        'X-Title': 'GeoBit News Search'
                    }
                }
            );

            // Parse the response
            const responseData = response.data;

            if (responseData.choices && responseData.choices.length > 0) {
                return responseData;
            }

            throw new Error('Invalid API response structure');
        } catch (error) {
            retries++;

            if (error.response && error.response.status === 429) {
                console.log('Rate limited, retrying after delay...');
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retries)));
            } else if (retries >= maxRetries) {
                throw error;
            } else {
                // Other error, retry with backoff
                console.error(`API call failed (attempt ${retries}):`, error.message);
                await new Promise(resolve => setTimeout(resolve, 2000 * retries));
            }
        }
    }

    throw new Error('Failed after multiple retries');
}

/**
 * Process and validate search results
 */
function processSearchResults(searchData) {
    try {
        // Extract the JSON content from the response
        const content = searchData.choices[0].message.content;
        let results;

        try {
            const parsedContent = JSON.parse(content);
            results = Array.isArray(parsedContent) ? parsedContent : parsedContent.results || [];
        } catch (error) {
            console.error('Error parsing JSON from API response:', error);
            // Extract JSON array from text if possible
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    results = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error('Failed to extract JSON array:', e);
                    results = [];
                }
            } else {
                results = [];
            }
        }

        // Validate and clean each result
        const processedResults = results.map(result => ({
            title: result.title || 'Untitled Article',
            url: validateUrl(result.url) || '',
            date: validateDate(result.date) || new Date().toISOString(),
            source: result.source || 'Unknown Source',
            summary: result.summary || 'No summary available',
            category: validateCategory(result.category) || 'research'
        }));

        // Deduplicate results
        return deduplicateResults(processedResults);
    } catch (error) {
        console.error('Error processing search results:', error);
        return [];
    }
}

/**
 * Validate a URL
 */
function validateUrl(url) {
    if (!url) return '';

    try {
        // Add https:// if missing protocol
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        new URL(url); // Will throw if invalid
        return url;
    } catch (error) {
        return '';
    }
}

/**
 * Validate a date string
 */
function validateDate(dateStr) {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return null;
    }

    // Check if date is in the future
    if (date > new Date()) {
        return new Date().toISOString();
    }

    return date.toISOString();
}

/**
 * Validate category
 */
function validateCategory(category) {
    if (!category) return 'research';

    const validCategories = ['geology', 'climate', 'oceanography', 'research', 'industry', 'technology'];
    const normalized = category.toLowerCase().trim();

    return validCategories.includes(normalized) ? normalized : 'research';
}

/**
 * Deduplicate results based on URL and title similarity
 */
function deduplicateResults(results) {
    const unique = [];
    const urls = new Set();
    const titles = new Set();

    for (const result of results) {
        // Skip if URL already exists
        if (result.url && urls.has(result.url)) {
            continue;
        }

        // Skip if title is very similar to existing titles
        let isDuplicate = false;
        for (const existingTitle of titles) {
            if (calculateSimilarity(result.title.toLowerCase(), existingTitle.toLowerCase()) > 0.8) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            if (result.url) urls.add(result.url);
            titles.add(result.title);
            unique.push(result);
        }
    }

    return unique;
}

/**
 * Store search results in Firestore
 */
async function storeSearchResults(query, results, userId) {
    const searchRef = db.collection('news_searches').doc();

    await searchRef.set({
        query,
        results,
        userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        resultCount: results.length
    });

    // Also store individual articles in the articles collection
    const batch = db.batch();

    for (const article of results) {
        // Create a hash of the URL for deduplication
        const urlHash = hashString(article.url);
        const articleRef = db.collection('articles').doc(urlHash);

        // Use set with merge to avoid overwriting existing articles
        batch.set(articleRef, {
            ...article,
            searchIds: admin.firestore.FieldValue.arrayUnion(searchRef.id),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            firstDiscovered: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    await batch.commit();
    return searchRef;
}

/**
 * Create a simple hash of a string
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Return positive hex string
    return (hash >>> 0).toString(16);
}

/**
 * Paginate results
 */
function paginateResults(searchData, page, limit) {
    const { results, id, query } = searchData;
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalResults);

    return {
        success: true,
        results: results.slice(startIndex, endIndex),
        pagination: {
            total: totalResults,
            page: currentPage,
            limit,
            totalPages
        },
        searchId: id,
        query
    };
} 