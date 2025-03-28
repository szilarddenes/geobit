// Firebase app initialization with singleton pattern
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Log environment variables presence (without showing actual values)
console.log('Firebase environment variables check:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY present:', Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY));
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID present:', Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID));
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN present:', Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Running in GitHub Actions:', Boolean(process.env.GITHUB_ACTIONS));

// Firebase config from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
        `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'geobit-959c9'}-default-rtdb.firebaseio.com`
};


const PROD_FALLBACKS = {
    // Never hardcode actual API keys - only use descriptive placeholders
    apiKey: 'PROVIDE_VIA_ENV_VARIABLE',
    authDomain: 'geobit-959c9.firebaseapp.com', // Public domain values can be included
    projectId: 'geobit-959c9',
    storageBucket: 'geobit-959c9.appspot.com',
    messagingSenderId: '000000000000', // Use a placeholder
    appId: '1:000000000000:web:0000000000000000000000' // Use a placeholder
};

// Check if we're running in GitHub Actions
const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);

// Validate config and provide defaults
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
    console.warn('Missing required Firebase configuration.');

    // Development fallbacks
    if (process.env.NODE_ENV === 'development') {
        // Apply development defaults if we're using emulators
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
            firebaseConfig.apiKey = firebaseConfig.apiKey || 'demo-api-key';
            firebaseConfig.authDomain = firebaseConfig.authDomain || '127.0.0.1';
            firebaseConfig.projectId = firebaseConfig.projectId || 'geobit-dev';
            firebaseConfig.storageBucket = firebaseConfig.storageBucket || 'geobit-dev.appspot.com';
            firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || '000000000000';
            firebaseConfig.appId = firebaseConfig.appId || '1:000000000000:web:0000000000000000000000';
        }
    }
    // For production, we typically don't provide fallbacks for sensitive keys
    else if (process.env.NODE_ENV === 'production') {
        // For non-sensitive values we can use fallbacks
        firebaseConfig.authDomain = firebaseConfig.authDomain || PROD_FALLBACKS.authDomain;
        firebaseConfig.projectId = firebaseConfig.projectId || PROD_FALLBACKS.projectId;
        firebaseConfig.storageBucket = firebaseConfig.storageBucket || PROD_FALLBACKS.storageBucket;

        // For GitHub Actions builds, we allow placeholder values
        if (isGitHubActions) {
            console.log('Using placeholder values for GitHub Actions build');
            firebaseConfig.apiKey = firebaseConfig.apiKey || 'github-actions-build-placeholder';
            firebaseConfig.appId = firebaseConfig.appId || PROD_FALLBACKS.appId;
            firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || PROD_FALLBACKS.messagingSenderId;
        }
        // For actual production deployment, we require them to be set
        else if (!firebaseConfig.apiKey) {
            throw new Error('Firebase API Key is required for production builds. Set NEXT_PUBLIC_FIREBASE_API_KEY environment variable.');
        }
    }
}

console.log('Firebase config being used:', {
    hasApiKey: Boolean(firebaseConfig.apiKey),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    usingEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
    isGitHubActions
});

// Initialize or reuse Firebase app
let firebaseApp;
try {
    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
        console.log('Firebase app initialized successfully');
    } else {
        firebaseApp = getApps()[0];
        console.log('Using existing Firebase app');
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
    console.error("Firebase config (safe):", {
        apiKeyExists: Boolean(firebaseConfig.apiKey),
        authDomainExists: Boolean(firebaseConfig.authDomain),
        projectIdExists: Boolean(firebaseConfig.projectId),
        isGitHubActions
    });

    // In GitHub Actions, we just log the error but continue
    if (isGitHubActions) {
        console.error("Continuing GitHub Actions build despite Firebase initialization error");
        firebaseApp = null;
    } else {
        throw new Error(`Failed to initialize Firebase: ${error.message}. Check your environment variables.`);
    }
}

// Initialize services
let auth, db, functions, rtdb;
try {
    if (firebaseApp) {
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
        functions = getFunctions(firebaseApp, 'us-central1');
        rtdb = getDatabase(firebaseApp);
        console.log('Firebase services initialized successfully');
    } else {
        console.log('Skipping Firebase services initialization due to missing app');
    }
} catch (error) {
    console.error("Error initializing Firebase services:", error);
}

// Connect to emulators in development
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && process.env.NODE_ENV === 'development' && auth && db && functions && rtdb) {
    // Auth emulator
    if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
        try {
            connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL, { disableWarnings: true });
            console.log("Connected to Auth emulator");
        } catch (error) {
            console.error("Error connecting to Auth emulator:", error);
        }
    }

    // Firestore emulator
    if (process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST) {
        try {
            const [host, portStr] = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST.split(':');
            const port = parseInt(portStr, 10);
            connectFirestoreEmulator(db, host, port);
            console.log("Connected to Firestore emulator");
        } catch (error) {
            console.error("Error connecting to Firestore emulator:", error);
        }
    }

    // Functions emulator
    try {
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        console.log("Connected to Functions emulator");
    } catch (error) {
        console.error("Error connecting to Functions emulator:", error);
    }

    // Database emulator
    if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST) {
        try {
            const [host, portStr] = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST.split(':');
            const port = parseInt(portStr, 10);
            connectDatabaseEmulator(rtdb, host, port);
            console.log("Connected to Database emulator");
        } catch (error) {
            console.error("Error connecting to Database emulator:", error);
        }
    }
}

// Export the Firebase services
export const app = firebaseApp;
export const firebaseAuth = auth;
export const firebaseDb = db;
export const firebaseFunctions = functions;
export const firebaseDatabase = rtdb;
export const isUsingEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'; 