"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const admin_1 = require("../admin");
// Initialize Firestore
const db = admin.firestore();
// Initialize SendGrid (would be configured with environment variables in production)
// sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');
// Newsletter Generation Function
const generateNewsletter = async () => {
    try {
        // 1. Collect content from sources
        const sourceData = await collectContent();
        // 2. Summarize content with AI
        const processedContent = await summarizeContent(sourceData);
        // 3. Generate newsletter HTML
        const newsletterHtml = generateNewsletterHtml(processedContent);
        // 4. Save to Firestore
        const newsletterRef = await db.collection('newsletters').add({
            content: processedContent,
            html: newsletterHtml,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'draft'
        });
        return newsletterRef.id;
    }
    catch (error) {
        console.error('Error generating newsletter:', error);
        throw error;
    }
};
// Content Collection Function
const collectContent = async () => {
    // This would be expanded to collect from multiple sources
    try {
        // Example: Get content sources from Firestore
        const sourcesSnapshot = await db.collection('contentSources')
            .where('active', '==', true)
            .get();
        const sourceData = [];
        for (const doc of sourcesSnapshot.docs) {
            const source = doc.data();
            // Basic scraping logic (would be more sophisticated in production)
            try {
                const response = await axios_1.default.get(source.url);
                sourceData.push({
                    id: doc.id,
                    name: source.name,
                    url: source.url,
                    content: response.data,
                    // You would extract relevant content using cheerio or similar
                });
            }
            catch (error) {
                console.error(`Error fetching source ${source.name}:`, error);
            }
        }
        return sourceData;
    }
    catch (error) {
        console.error('Error collecting content:', error);
        throw error;
    }
};
// AI Content Summarization
const summarizeContent = async (sourceData) => {
    var _a;
    try {
        // Get the OpenRouter API key from environment variables
        const openRouterApiKey = ((_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.openrouter_api_key) || process.env.OPENROUTER_API_KEY;
        if (!openRouterApiKey) {
            console.error('OPENROUTER_API_KEY not configured');
            // Fallback to placeholder summaries if API key is not available
            return sourceData.map(source => (Object.assign(Object.assign({}, source), { summary: `Summary for content from ${source.name}. (API key not configured)` })));
        }
        // Process each source with OpenRouter API
        const processedSources = [];
        for (const source of sourceData) {
            try {
                // Extract meaningful content from the HTML (simplified here)
                // In production, you'd use a proper HTML parser like cheerio
                const textContent = source.content.toString()
                    .replace(/<[^>]*>/g, ' ') // Strip HTML tags
                    .replace(/\s+/g, ' ') // Normalize whitespace
                    .trim()
                    .substring(0, 4000); // Limit content length for API
                // First, try to enhance the article with web search using Perplexity
                let enhancedContent;
                try {
                    // Use Perplexity to search for additional context about the article
                    const perplexityResponse = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                        model: 'perplexity/sonar-small-online', // Use Perplexity for web search
                        fallbacks: ['perplexity/sonar-small-chat', 'anthropic/claude-3-haiku-20240307'],
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a geoscience research assistant that provides relevant information from the web to enhance understanding of scientific articles.'
                            },
                            {
                                role: 'user',
                                content: `Here is a geoscience article excerpt:\n\n${textContent}\n\nPlease provide additional context and recent relevant information by searching the web. Focus on key scientific concepts, recent developments, and related research. Be brief and factual.`
                            }
                        ],
                        max_tokens: 300,
                        tools: [{ "type": "web_search" }], // Enable web search
                        tool_choice: { "type": "web_search" } // Force use of web search
                    }, {
                        headers: {
                            'Authorization': `Bearer ${openRouterApiKey}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'https://geobit.example.com',
                            'X-Title': 'GeoBit Newsletter'
                        }
                    });
                    enhancedContent = `${textContent}\n\nAdditional context: ${perplexityResponse.data.choices[0].message.content}`;
                    console.log('Successfully enhanced content with web search.');
                }
                catch (error) {
                    console.error('Error using Perplexity for web search:', error);
                    // Fall back to original content if web search fails
                    enhancedContent = textContent;
                }
                // Then, use summarization models with fallbacks
                const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'anthropic/claude-3-haiku-20240307',
                    fallbacks: ['anthropic/claude-instant-1.2', 'google/gemini-pro', 'openai/gpt-3.5-turbo'],
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a scientific assistant that summarizes geoscience content accurately and concisely.'
                        },
                        {
                            role: 'user',
                            content: `Summarize the following geoscience article in 2-3 concise paragraphs, highlighting the key findings and implications:\n\n${enhancedContent}`
                        }
                    ],
                    max_tokens: 250
                }, {
                    headers: {
                        'Authorization': `Bearer ${openRouterApiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://geobit.example.com',
                        'X-Title': 'GeoBit Newsletter'
                    }
                });
                // Log which model was actually used
                console.log(`Used model for summarization: ${response.data.model}`);
                // Extract the summary from the API response
                const summary = response.data.choices[0].message.content.trim();
                processedSources.push(Object.assign(Object.assign({}, source), { summary, model_used: response.data.model // Store which model was used
                 }));
                // Add a small delay between API calls to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            catch (error) {
                console.error(`Error summarizing content from ${source.name}:`, error);
                // Add source with error message as summary
                processedSources.push(Object.assign(Object.assign({}, source), { summary: `This content could not be summarized due to an error: ${error.message}` }));
            }
        }
        return processedSources;
    }
    catch (error) {
        console.error('Error in content summarization:', error);
        // Return original data with placeholder summaries as fallback
        return sourceData.map(source => (Object.assign(Object.assign({}, source), { summary: `Content from ${source.name} (summarization failed)` })));
    }
};
// Newsletter HTML Generation
const generateNewsletterHtml = (processedContent) => {
    // Basic HTML template
    const contentHtml = processedContent.map(item => `
    <div style="margin-bottom: 20px;">
      <h2>${item.name}</h2>
      <p>${item.summary}</p>
      <a href="${item.url}">Read more</a>
    </div>
  `).join('');
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GeoBit Newsletter</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; }
        a { color: #3498db; }
      </style>
    </head>
    <body>
      <h1>GeoBit Newsletter</h1>
      <p>The latest news and research in geosciences:</p>
      ${contentHtml}
      <hr>
      <p>You received this email because you subscribed to GeoBit. <a href="##UNSUBSCRIBE_LINK##">Unsubscribe</a></p>
    </body>
    </html>
  `;
};
// Send Newsletter Function
const sendNewsletter = async (newsletterId) => {
    try {
        // Get newsletter data
        const newsletterDoc = await db.collection('newsletters').doc(newsletterId).get();
        if (!newsletterDoc.exists) {
            throw new Error(`Newsletter with ID ${newsletterId} not found`);
        }
        const newsletter = newsletterDoc.data();
        // Get subscribers
        const subscribersSnapshot = await db.collection('subscribers')
            .where('status', '==', 'active')
            .get();
        const subscribers = subscribersSnapshot.docs.map(doc => doc.data());
        // In production, you would batch send these and handle tracking
        for (const subscriber of subscribers) {
            // This is just a placeholder - in production you'd use SendGrid or similar
            console.log(`Sending newsletter to ${subscriber.email}`);
            // Example SendGrid implementation (commented out)
            /*
            await sendgrid.send({
              to: subscriber.email,
              from: 'newsletter@geobit.example.com',
              subject: 'GeoBit Newsletter: Weekly Geoscience Update',
              html: newsletter.html,
            });
            */
        }
        // Update newsletter status
        await db.collection('newsletters').doc(newsletterId).update({
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, recipients: subscribers.length };
    }
    catch (error) {
        console.error('Error sending newsletter:', error);
        throw error;
    }
};
// HTTP Function to generate newsletter on demand
const generateNewsletterOnDemand = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token } = data;
        const isValidToken = await (0, admin_1.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        const newsletterId = await generateNewsletter();
        return { success: true, newsletterId };
    }
    catch (error) {
        console.error('Error generating newsletter on demand:', error);
        return { success: false, error: error.message };
    }
});
// HTTP Function to publish newsletter
const publishNewsletter = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, newsletterId } = data;
        const isValidToken = await (0, admin_1.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        if (!newsletterId) {
            throw new Error('Newsletter ID is required');
        }
        // Update status to published
        await db.collection('newsletters').doc(newsletterId).update({
            status: 'published',
            publishedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Send newsletter to subscribers
        const result = await sendNewsletter(newsletterId);
        return Object.assign({ success: true }, result);
    }
    catch (error) {
        console.error('Error publishing newsletter:', error);
        return { success: false, error: error.message };
    }
});
// HTTP Function to get a newsletter by ID
const getNewsletter = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, newsletterId } = data;
        const isValidToken = await (0, admin_1.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        if (!newsletterId) {
            throw new Error('Newsletter ID is required');
        }
        // Get newsletter from Firestore
        const newsletterDoc = await db.collection('newsletters').doc(newsletterId).get();
        if (!newsletterDoc.exists) {
            throw new Error(`Newsletter with ID ${newsletterId} not found`);
        }
        return {
            success: true,
            newsletter: Object.assign({ id: newsletterDoc.id }, newsletterDoc.data())
        };
    }
    catch (error) {
        console.error('Error getting newsletter:', error);
        return { success: false, error: error.message };
    }
});
// HTTP Function to get all newsletters
const getNewsletters = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, limit = 50, offset = 0 } = data;
        const isValidToken = await (0, admin_1.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        // Get newsletters from Firestore
        const newslettersSnapshot = await db.collection('newsletters')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();
        const newsletters = newslettersSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Get total count
        const countSnapshot = await db.collection('newsletters').count().get();
        const total = countSnapshot.data().count;
        return {
            success: true,
            newsletters,
            pagination: {
                total,
                limit,
                offset
            }
        };
    }
    catch (error) {
        console.error('Error getting newsletters:', error);
        return { success: false, error: error.message };
    }
});
// Export functions
exports.default = {
    generateNewsletter,
    generateNewsletterOnDemand,
    publishNewsletter,
    getNewsletter,
    getNewsletters
};
//# sourceMappingURL=index.js.map