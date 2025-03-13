/**
 * Utility functions for interacting with OpenRouter API
 */

/**
 * Generate a summary of text content using the OpenRouter API with Perplexity for web search
 * @param {string} content - The content to summarize
 * @param {number} maxLength - Maximum length of the summary in tokens
 * @returns {Promise<string>} - The generated summary
 */
export async function generateSummary(content, maxLength = 250) {
    try {
        // The API key should be in the environment variables
        // Note: Exposing API keys in client-side code is generally not recommended
        // For production, use a backend API to proxy these requests

        // First, enhance the content with web search using Perplexity
        let enhancedContent = content;
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://geobit.example.com',
                    'X-Title': 'GeoBit Newsletter'
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3-haiku-20240307',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a scientific assistant that summarizes geoscience content accurately and concisely.'
                        },
                        {
                            role: 'user',
                            content: `Summarize the following geoscience article in 2-3 concise paragraphs, highlighting the key findings and implications:\n\n${content}`
                        }
                    ],
                    max_tokens: maxLength
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate summary');
            }

            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating summary:', error);
            throw error;
        }
    }

/**
 * Generate a title suggestion for a newsletter based on its content
 * @param {Array} articles - Array of article summaries
 * @returns {Promise<string>} - The generated title
 */
export async function suggestNewsletterTitle(articles) {
        try {
            // Create a prompt with the article titles and summaries
            const articlesText = articles.map(article =>
                `Title: ${article.name}\nSummary: ${article.summary}`
            ).join('\n\n');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://geobit.example.com',
                    'X-Title': 'GeoBit Newsletter'
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3-haiku-20240307',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a scientific editor that creates engaging, accurate titles for geoscience newsletters.'
                        },
                        {
                            role: 'user',
                            content: `Create a concise, informative title for a geoscience newsletter containing the following articles:\n\n${articlesText}\n\nThe title should be 5-10 words long and should capture the main themes of these articles.`
                        }
                    ],
                    max_tokens: 50
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate title suggestion');
            }

            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating title suggestion:', error);
            throw error;
        }
    } 