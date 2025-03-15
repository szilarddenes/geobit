// Re-export auth functions
import { useAuth } from './auth';
import { onAuthStateChanged } from 'firebase/auth';

// Import Firebase instances from our singleton implementation
import {
    app,
    firebaseAuth as auth,
    firebaseDb as db,
    firebaseFunctions as functions,
    firebaseDatabase as database,
    isUsingEmulators
} from './firebase-app';

// Check if we're running in a build context (GitHub Actions or similar)
const isBuildContext = process.env.GITHUB_ACTIONS === 'true' || (
    typeof window === 'undefined' && process.env.NODE_ENV === 'production'
);

// Log initialization status
if (isBuildContext) {
    console.log('Firebase services are running in a build context - some features may be disabled');
}

// Export firebase instances
export { app, auth, db, functions, database, isUsingEmulators };

// Create the onAuthStateChange function - exact name as imported
export const onAuthStateChange = (callback) => {
    if (!auth) {
        console.error('Firebase auth not initialized.');
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
};

// Create the logoutUser function - exact name as imported
export const logoutUser = async () => {
    if (!auth) {
        console.error('Firebase auth not initialized.');
        return false;
    }

    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Create the checkIsAdmin function - exact name as imported
export const checkIsAdmin = async (user) => {
    if (!user) return false;

    // In build context, return false to avoid errors
    if (isBuildContext) {
        console.log('Running in build context - admin check skipped');
        return false;
    }

    // Check if user's email is in the admin emails list
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',')
        .map(email => email.trim().toLowerCase());

    return adminEmails.includes(user.email.toLowerCase());
};

// Mock functions for admin-related operations - exact names as imported
export const getAdminUsers = async () => {
    if (isBuildContext) {
        console.log('Running in build context - admin users fetch skipped');
        return { success: true, admins: [] };
    }

    console.warn('getAdminUsers: This is a stub. Implement proper function for production.');
    return { success: true, admins: [] };
};

export const addAdminUser = async (email) => {
    if (isBuildContext) {
        console.log('Running in build context - add admin user skipped');
        return { success: true, message: 'Add admin skipped (build context)' };
    }

    console.warn('addAdminUser: This is a stub. Implement proper function for production.');
    return { success: true, message: 'Admin added (mock)' };
};

// Also export the useAuth hook
export { useAuth }; 