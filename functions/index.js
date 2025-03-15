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

// Import all functions from modules
const aiModule = require('./src/ai');

// Initialize admin SDK if not already initialized
const admin = require('firebase-admin');
if (!admin.apps.length) {
    admin.initializeApp();
}

// Re-export AI functions
exports.processArticleContent = aiModule.processArticleContent;
exports.searchGeoscienceNews = aiModule.searchGeoscienceNews;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
