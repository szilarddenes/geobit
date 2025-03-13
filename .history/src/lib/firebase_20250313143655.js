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

// Admin functions - raw function calls
const rawAdminLogin = httpsCallable(functions, 'admin-adminLogin');
const rawGetContentSources = httpsCallable(functions, 'admin-getContentSources');
const rawAddContentSource = httpsCallable(functions, 'admin-addContentSource');
const rawUpdateContentSource = httpsCallable(functions, 'admin-updateContentSource');
const rawDeleteContentSource = httpsCallable(functions, 'admin-deleteContentSource');
const rawGetSubscribers = httpsCallable(functions, 'admin-getSubscribers');

// Newsletter functions - raw function calls
const rawGenerateNewsletterOnDemand = httpsCallable(functions, 'newsletter-generateNewsletterOnDemand');
const rawPublishNewsletter = httpsCallable(functions, 'newsletter-publishNewsletter');
const rawGetNewsletter = httpsCallable(functions, 'newsletter-getNewsletter');
const rawGetNewsletters = httpsCallable(functions, 'newsletter-getNewsletters');

// Development data
const devContentSources = [
  { id: 'dev-1', name: 'Dev Source 1', url: 'https://example.com/1', category: 'news', active: true },
  { id: 'dev-2', name: 'Dev Source 2', url: 'https://example.com/2', category: 'research', active: true }
];
const devSubscribers = [
  { id: 'dev-sub-1', email: 'test1@example.com', status: 'active', subscribedAt: new Date() },
  { id: 'dev-sub-2', email: 'test2@example.com', status: 'active', subscribedAt: new Date() }
];

// Helper function to verify admin token locally in development (bypasses Firebase Functions)
export const verifyAdminTokenLocally = (token) => {
  // Accept any token that starts with dev-admin- in development
  if (token && token.startsWith('dev-admin-')) {
    return true;
  }
  return false;
};

// Wrapped functions with development fallbacks
export const adminLogin = async (data) => {
  try {
    return await rawAdminLogin(data);
  } catch (error) {
    console.warn('Firebase adminLogin error, using development fallback:', error);

    // Development fallback
    if (data.password === 'admin123') {
      const token = 'dev-admin-' + Math.random().toString(36).substring(2, 15);
      return { data: { success: true, token } };
    }

    return { data: { success: false, error: 'Invalid password' } };
  }
};

export const getContentSources = async (data) => {
  try {
    return await rawGetContentSources(data);
  } catch (error) {
    console.warn('Firebase getContentSources error, using development fallback:', error);

    // Development fallback
    if (data.token && verifyAdminTokenLocally(data.token)) {
      return { data: { success: true, sources: devContentSources } };
    }

    return { data: { success: false, error: 'Unauthorized access' } };
  }
};

export const addContentSource = async (data) => {
  try {
    return await rawAddContentSource(data);
  } catch (error) {
    console.warn('Firebase addContentSource error, using development fallback:', error);

    // Development fallback
    if (data.token && verifyAdminTokenLocally(data.token)) {
      // Create a new dev content source with the given data
      const newSource = {
        id: 'dev-' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        url: data.url,
        category: data.category || 'news',
        active: true
      };

      // Add to dev content sources
      devContentSources.push(newSource);

      return { data: { success: true, source: newSource } };
    }

    return { data: { success: false, error: 'Unauthorized access' } };
  }
};

export const updateContentSource = async (data) => {
  try {
    return await rawUpdateContentSource(data);
  } catch (error) {
    console.warn('Firebase updateContentSource error, using development fallback:', error);

    // Development fallback
    if (data.token && verifyAdminTokenLocally(data.token)) {
      // Find the source by ID in dev content sources
      const sourceIndex = devContentSources.findIndex(s => s.id === data.sourceId);

      if (sourceIndex !== -1) {
        // Update the source
        devContentSources[sourceIndex] = {
          ...devContentSources[sourceIndex],
          name: data.name || devContentSources[sourceIndex].name,
          url: data.url || devContentSources[sourceIndex].url,
          category: data.category || devContentSources[sourceIndex].category,
          active: data.active !== undefined ? data.active : devContentSources[sourceIndex].active
        };

        return { data: { success: true, source: devContentSources[sourceIndex] } };
      }

      return { data: { success: false, error: 'Source not found' } };
    }

    return { data: { success: false, error: 'Unauthorized access' } };
  }
};

export const deleteContentSource = async (data) => {
  try {
    return await rawDeleteContentSource(data);
  } catch (error) {
    console.warn('Firebase deleteContentSource error, using development fallback:', error);

    // Development fallback
    if (data.token && verifyAdminTokenLocally(data.token)) {
      // Remove the source by ID from dev content sources
      const sourceIndex = devContentSources.findIndex(s => s.id === data.sourceId);

      if (sourceIndex !== -1) {
        devContentSources.splice(sourceIndex, 1);
        return { data: { success: true } };
      }

      return { data: { success: false, error: 'Source not found' } };
    }

    return { data: { success: false, error: 'Unauthorized access' } };
  }
};

export const getSubscribers = async (data) => {
  try {
    return await rawGetSubscribers(data);
  } catch (error) {
    console.warn('Firebase getSubscribers error, using development fallback:', error);

    // Development fallback
    if (data.token && verifyAdminTokenLocally(data.token)) {
      return { data: { success: true, subscribers: devSubscribers } };
    }

    return { data: { success: false, error: 'Unauthorized access' } };
  }
};

// Newsletter functions
// Simply re-export raw functions for now
export const generateNewsletterOnDemand = rawGenerateNewsletterOnDemand;
export const publishNewsletter = rawPublishNewsletter;
export const getNewsletter = rawGetNewsletter;
export const getNewsletters = rawGetNewsletters;

// Subscription functions
export const addSubscriber = httpsCallable(functions, 'subscribers-addSubscriber');

export { app, db, analytics };