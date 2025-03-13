import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// For production, these would be in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const functions = getFunctions(app);

// Initialize Analytics (only on client side)
let analytics = null;
if (typeof window !== 'undefined') {
  // Initialize analytics when supported
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.error("Analytics error:", error);
  });
}

// Admin functions
export const adminLogin = httpsCallable(functions, 'admin-adminLogin');
export const getContentSources = httpsCallable(functions, 'admin-getContentSources');
export const addContentSource = httpsCallable(functions, 'admin-addContentSource');
export const updateContentSource = httpsCallable(functions, 'admin-updateContentSource');
export const deleteContentSource = httpsCallable(functions, 'admin-deleteContentSource');
export const getSubscribers = httpsCallable(functions, 'admin-getSubscribers');

// Newsletter functions
export const generateNewsletterOnDemand = httpsCallable(functions, 'newsletter-generateNewsletterOnDemand');
export const publishNewsletter = httpsCallable(functions, 'newsletter-publishNewsletter');
export const getNewsletter = httpsCallable(functions, 'newsletter-getNewsletter');

// Subscription functions
export const addSubscriber = httpsCallable(functions, 'subscribers-addSubscriber');

export { app, db, analytics };