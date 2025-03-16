import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

/**
 * Client-side module for interacting with AI-powered Firebase functions
 */

// Initialize Firebase functions
const functions = getFunctions(getApp());

// Raw function calls to Firebase
const rawProcessArticleContent = httpsCallable(functions, 'processArticleContent');
const rawSearchGeoscienceNews = httpsCallable(functions, 'searchGeoscienceNews');

/**
 * Safe stringify to prevent circular reference errors
 * @param {any} obj - Object to stringify
 * @returns {string} - Safe JSON string
 */
function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular Reference]';
            }
            seen.add(value);
        }
        return value;
    });
}

/**
 * Process article content using AI to generate summaries and categorize content
 * 
 * @param {Object} data - Article data to process
 * @param {string} data.content - Article content to process
 * @param {string} data.title - Article title (optional)
 * @param {string} data.url - Article URL (optional)
 * @returns {Promise<Object>} - Processed article data
 */
export async function processArticleContent(data) {
    try {
        // Only log safe versions of objects
        console.log('Calling processArticleContent with data:', JSON.stringify(data));
        const result = await rawProcessArticleContent(data);
        return result.data;
    } catch (error) {
        console.error('Error processing article content:', error);
        throw error;
    }
}

/**
 * Search for geoscience news using Perplexity API
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.keywords - Search keywords
 * @param {Object} params.dateRange - Date range for filtering 
 * @param {Array<string>} params.sources - Sources to search from
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of results per page
 * @returns {Promise<Object>} - Search results
 */
export async function searchGeoscienceNews(params) {
    try {
        // Make sure keywords is a string and not empty
        if (!params || typeof params.keywords !== 'string' || !params.keywords.trim()) {
            throw new Error('Keywords are required for search');
        }

        // Create a clean parameters object with only the necessary fields
        const cleanParams = {
            keywords: params.keywords.trim(),
            dateRange: params.dateRange || { start: null, end: null },
            sources: params.sources || [],
            page: params.page || 1,
            limit: params.limit || 10
        };

        console.log('Clean params for search:', JSON.stringify(cleanParams));

        // Call Firebase function with clean parameters
        const result = await rawSearchGeoscienceNews(cleanParams);
        return {
            success: true,
            data: result.data
        };
    } catch (error) {
        console.error('Error searching geoscience news:', error.message || error);
        return {
            success: false,
            error: error.message || 'Unknown error occurred'
        };
    }
}

/**
 * Check if article with URL has already been processed
 * This is a utility function that works client-side to avoid unnecessary processing
 * 
 * @param {string} url - URL to check
 * @returns {Promise<Object|null>} - Processed article data or null if not found
 */
export async function checkProcessedArticle(url) {
    // Mock implementation for development
    if (process.env.NODE_ENV === 'development') {
        return null; // Always process in development
    }

    try {
        // In a real implementation, this would query Firestore directly
        // or call a Firebase function
        return null;
    } catch (error) {
        console.error('Error checking processed article:', error);
        return null;
    }
} 