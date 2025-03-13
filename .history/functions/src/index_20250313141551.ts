import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import newsletterFunctions from './newsletter';
import adminFunctions from './admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Print a log for the API key presence (without revealing the key)
console.log(`OpenRouter API Key configured: ${Boolean(process.env.OPENROUTER_API_KEY)}`);

// Export newsletter functions
export const newsletter = newsletterFunctions;

// Export admin functions
export const admin = adminFunctions;

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