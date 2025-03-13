import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import newsletterFunctions from './newsletter';
import adminFunctions from './admin';

// Initialize Firebase Admin
admin.initializeApp();

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