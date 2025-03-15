// Firebase app initialization with singleton pattern
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

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
        `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
};

// Validate config and provide defaults if in development
if (process.env.NODE_ENV === 'development') {
    // Log warning for missing variables
    const missingVars = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value && key !== 'measurementId' && key !== 'databaseURL')
        .map(([key]) => key);

    if (missingVars.length > 0) {
        console.warn(`Firebase config missing fields: ${missingVars.join(', ')}`);
        console.warn('Using development defaults for missing fields');

        // Apply development defaults if we're using emulators
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
            if (!firebaseConfig.apiKey) firebaseConfig.apiKey = 'demo-api-key';
            if (!firebaseConfig.authDomain) firebaseConfig.authDomain = '127.0.0.1';
            if (!firebaseConfig.projectId) firebaseConfig.projectId = 'geobit-dev';
            if (!firebaseConfig.storageBucket) firebaseConfig.storageBucket = 'geobit-dev.appspot.com';
            if (!firebaseConfig.messagingSenderId) firebaseConfig.messagingSenderId = '000000000000';
            if (!firebaseConfig.appId) firebaseConfig.appId = '1:000000000000:web:0000000000000000000000';
        }
    }
}

// Initialize or reuse Firebase app
let firebaseApp;
try {
    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApps()[0];
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
    throw new Error("Failed to initialize Firebase. Check your environment variables.");
}

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp, 'us-central1');
const rtdb = getDatabase(firebaseApp);

// Connect to emulators in development
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && process.env.NODE_ENV === 'development') {
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