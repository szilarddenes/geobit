/**
 * Utility functions for interacting with OpenRouter API
 */

/**
 * Generate a summary of text content using the OpenRouter API with Perplexity for web search
 * @param {string} content - The content to summarize
 * @param {number} maxLength - Maximum length of the summary in tokens
 * @returns {Promise<Object>} - Object containing the generated summary and model used
 */
export async function generateSummary(content, maxLength = 250) {
    try {
        // The API key should be in the environment variables
        // Note: Exposing API keys in client-side code is generally not recommended
        // For production, use a backend API to proxy these requests

        // First, enhance the content with web search using Perplexity
        let enhancedContent = content;
        try {
            const perplexityResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://geobit.example.com',
                    'X-Title': 'GeoBit Newsletter'
                },
                body: JSON.stringify({
                    model: 'perplexity/sonar-small-online',
                    fallbacks: ['perplexity/sonar-small-chat', 'anthropic/claude-3-haiku-20240307'],
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a geoscience research assistant that provides relevant information from the web to enhance understanding of scientific articles.'
                        },
                        {
                            role: 'user',
                            content: `Here is a geoscience article excerpt:\n\n${content}\n\nPlease provide additional context and recent relevant information by searching the web. Focus on key scientific concepts, recent developments, and related research. Be brief and factual.`
                        }
                    ],
                    max_tokens: 300,
                    tools: [{ "type": "web_search" }],
                    tool_choice: { "type": "web_search" }
                })
            });

            const perplexityData = await perplexityResponse.json();

            if (perplexityResponse.ok) {
                enhancedContent = `${content}\n\nAdditional context: ${perplexityData.choices[0].message.content}`;
                console.log('Content enhanced with web search');
            }
        } catch (error) {
            console.warn('Error enhancing content with web search:', error);
            // Continue with original content if web search fails
        }

        // Now generate summary with fallback models
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
                max_tokens: maxLength
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate summary');
        }

        // Log which model was actually used
        console.log(`Used model for summarization: ${data.model}`);

        return {
            summary: data.choices[0].message.content.trim(),
            model: data.model
        };
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}

/**
 * Generate a title suggestion for a newsletter based on its content with fallback models
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
                fallbacks: ['anthropic/claude-instant-1.2', 'google/gemini-pro', 'openai/gpt-3.5-turbo'],
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

        // Log which model was actually used
        console.log(`Used model for title generation: ${data.model}`);

        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating title suggestion:', error);
        throw error;
    }
}

/**
 * Search for relevant geoscience articles on a given topic using Perplexity
 * @param {string} topic - The topic to search for
 * @returns {Promise<Array>} - Array of article suggestions
 */
export async function searchGeoscienceArticles(topic) {
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
                model: 'perplexity/sonar-small-online',
                fallbacks: ['perplexity/sonar-small-chat', 'anthropic/claude-3-haiku-20240307'],
                messages: [
                    {
                        role: 'system',
                        content: 'You are a geoscience research assistant that finds relevant, recent scientific articles. Return results in JSON format.'
                    },
                    {
                        role: 'user',
                        content: `Find 3-5 recent, high-quality scientific articles about "${topic}" in the field of geoscience. For each article, provide the title, authors, publication date, URL, and a brief description of key findings. Format your response as a JSON array of objects with keys: title, authors, date, url, and description.`
                    }
                ],
                max_tokens: 800,
                tools: [{ "type": "web_search" }],
                tool_choice: { "type": "web_search" },
                response_format: { "type": "json_object" }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to search for articles');
        }

        // Parse the JSON response
        const responseContent = data.choices[0].message.content;
        try {
            const articlesData = JSON.parse(responseContent);
            return Array.isArray(articlesData) ? articlesData : articlesData.articles || [];
        } catch (e) {
            console.error('Failed to parse article search results:', e);
            return [];
        }
    } catch (error) {
        console.error('Error searching for geoscience articles:', error);
        throw error;
    }
} 