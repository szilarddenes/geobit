import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Your web app's Firebase configuration
// For production, these would be in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const functions = getFunctions(app);

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

export { app, db };