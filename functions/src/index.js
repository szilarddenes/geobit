const functions = require('firebase-functions');
const admin = require('firebase-admin');
const newsletterFunctions = require('./newsletter');
const adminFunctions = require('./admin');
const contentFunctions = require('./content');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Print a log for the API key presence (without revealing the key)
console.log(`OpenRouter API Key configured: ${Boolean(process.env.OPENROUTER_API_KEY)}`);

// Export newsletter functions
exports.newsletter = newsletterFunctions;

// Export admin functions
exports.admin = adminFunctions;

// Export content functions
exports.content = contentFunctions;

// Example scheduled function to generate weekly newsletter
exports.generateWeeklyNewsletter = functions.pubsub
  .schedule('every monday 09:00')
  .timeZone('America/New_York')
  .onRun(async () => {
    try {
      // Will be implemented in newsletter/index.js
      await newsletterFunctions.generateNewsletter();
      return null;
    } catch (error) {
      console.error('Error generating weekly newsletter:', error);
      return null;
    }
  });

// Example scheduled function to collect content daily
exports.collectDailyContent = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('America/New_York')
  .onRun(async () => {
    try {
      // Get active content sources
      const db = admin.firestore();
      const sourcesSnapshot = await db.collection('contentSources')
        .where('active', '==', true)
        .get();
      
      const sourceIds = sourcesSnapshot.docs.map(doc => doc.id);
      
      if (sourceIds.length === 0) {
        console.log('No active content sources found for daily collection');
        return null;
      }
      
      // Call the content collection function with all active sources
      await contentFunctions.collectContentFromSources({
        sourceIds,
        token: 'internal-scheduled-task' // Special token for internal use
      });
      
      return null;
    } catch (error) {
      console.error('Error collecting daily content:', error);
      
      // Log the error
      const db = admin.firestore();
      await db.collection('systemLogs').add({
        level: 'error',
        service: 'scheduler',
        message: 'Daily content collection failed',
        details: { error: error.message },
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });