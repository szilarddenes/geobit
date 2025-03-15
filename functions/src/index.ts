import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';
import newsletterFunctions from './newsletter';
import adminFunctions from './admin';
import contentFunctions from './content';
import * as dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

// Initialize Firebase Admin
firebaseAdmin.initializeApp();

// Print a log for the API key presence (without revealing the key)
console.log(`OpenRouter API Key configured: ${Boolean(process.env.OPENROUTER_API_KEY)}`);

// Export newsletter functions
export const newsletter = newsletterFunctions;

// Export admin functions
export const admin = adminFunctions;

// Export content functions
export const content = contentFunctions;

// Note: Scheduled functions are commented out for now to fix build issues
// They will be implemented properly in a future update

/*
// Example scheduled function to generate weekly newsletter
export const generateWeeklyNewsletter = functions.pubsub
  .schedule('every monday 09:00')
  .timeZone('America/New_York')
  .onRun(async () => {
    try {
      // Will be implemented in newsletter/index.ts
      await newsletterFunctions.generateNewsletter();
      return null;
    } catch (error) {
      console.error('Error generating weekly newsletter:', error);
      return null;
    }
  });

// Example scheduled function to collect content daily
export const collectDailyContent = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('America/New_York')
  .onRun(async () => {
    try {
      // Get active content sources
      const db = firebaseAdmin.firestore();
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
      const db = firebaseAdmin.firestore();
      await db.collection('systemLogs').add({
        level: 'error',
        service: 'scheduler',
        message: 'Daily content collection failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });
*/