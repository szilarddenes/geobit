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
        const result = await rawSearchGeoscienceNews(params);
        return result.data;
    } catch (error) {
        console.error('Error searching geoscience news:', error);
        throw error;
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
    // This would typically call a Firebase function or directly query Firestore
    // For simplicity, we're making a direct call to the API for now
    try {
        // URL hash approach would be implemented server-side
        const encodedUrl = encodeURIComponent(url);
        // In a real implementation, you'd have a Firebase Function to check this
        return null; // Placeholder
    } catch (error) {
        console.error('Error checking processed article:', error);
        return null;
    }
} 