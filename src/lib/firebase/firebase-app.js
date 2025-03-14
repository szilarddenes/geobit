// Firebase app initialization with singleton pattern
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config with fallback values for development
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config to prevent cryptic errors
const validateConfig = () => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId'];
    const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

    if (missingFields.length > 0) {
        console.error(`Firebase config missing required fields: ${missingFields.join(', ')}`);
        console.error('Check your .env.local file and make sure NEXT_PUBLIC_FIREBASE_* variables are set');
        return false;
    }
    return true;
};

// Initialize Firebase if config is valid and no apps exist yet
let firebaseApp;
let auth = null;
let db = null;

try {
    if (validateConfig()) {
        if (!getApps().length) {
            console.log("Initializing Firebase app");
            firebaseApp = initializeApp(firebaseConfig);
        } else {
            console.log("Reusing existing Firebase app");
            firebaseApp = getApps()[0];
        }

        // Initialize services
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
    } else {
        console.error("Firebase initialization skipped due to invalid config");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

// Export the Firebase services
export const app = firebaseApp;
export const firebaseAuth = auth;
export const firebaseDb = db; 