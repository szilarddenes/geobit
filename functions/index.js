/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

// Initialize admin SDK if not already initialized
const admin = require('firebase-admin');
if (!admin.apps.length) {
    admin.initializeApp();
}

// Set environment variable in development mode
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV = 'development';
}

// Log the environment for debugging
logger.info(`Running functions in ${process.env.NODE_ENV} mode`);
logger.info(`OpenRouter API key exists: ${Boolean(process.env.OPENROUTER_API_KEY)}`);

// Import all functions from modules
const aiModule = require('./src/ai');

// Re-export AI functions
exports.processArticleContent = aiModule.processArticleContent;
exports.searchGeoscienceNews = aiModule.searchGeoscienceNews;

// Simple test function to verify environment variables are loaded
exports.testEnv = functions.https.onRequest((req, res) => {
    res.json({
        environment: process.env.NODE_ENV,
        hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
        hasAdminToken: Boolean(process.env.ADMIN_TOKEN),
        projectId: process.env.PROJECT_ID
    });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
