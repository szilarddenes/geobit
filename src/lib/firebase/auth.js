import { useEffect, useState, createContext, useContext } from 'react';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    getAuth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseApp } from './index';

// Check if we're running in GitHub Actions or a build context
const isBuildContext = process.env.GITHUB_ACTIONS === 'true' || (
    typeof window === 'undefined' && process.env.NODE_ENV === 'production'
);

// Initialize Google provider if we have auth
const googleProvider = getAuth(getFirebaseApp()) ? new GoogleAuthProvider() : null;

// Check if a user has admin privileges
async function checkIfAdmin(user) {
    if (!user) return false;

    // Skip actual checks in build context
    if (isBuildContext) {
        return false;
    }

    // List of admin emails - for production, store in Firestore or use custom claims
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',')
        .map(email => email.trim().toLowerCase());

    if (adminEmails.includes(user.email.toLowerCase())) {
        return true;
    }

    if (!getAuth(getFirebaseApp())) {
        console.error('Firebase auth not initialized');
        return false;
    }

    try {
        // Check if user has admin role in Firestore
        const userRef = doc(getAuth(getFirebaseApp()), 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === 'admin') {
            return true;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }

    return false;
}

// Create auth context
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap the application with authentication context
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Initialize Firebase if not already initialized
        const app = getFirebaseApp();
        const auth = getAuth(app);

        // In build context, quickly complete the auth process
        if (isBuildContext) {
            console.log('Running in build context - skipping auth initialization');
            setLoading(false);
            return () => { };
        }

        if (!auth) {
            console.error('Firebase auth not initialized');
            setLoading(false);
            setAuthError('Firebase authentication failed to initialize');
            return () => { };
        }

        // Check for redirect result on page load
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    console.log('Redirect sign-in successful');
                }
            })
            .catch((error) => {
                console.error('Redirect sign-in error:', error);
                setAuthError(error.message);
            });

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                setUser(user);

                // Check if user is an admin
                const admin = await checkIfAdmin(user);
                setIsAdmin(admin);

                if (!getAuth(app)) {
                    console.error('Firebase auth not initialized');
                    setLoading(false);
                    return;
                }

                // Save user to Firestore
                try {
                    const userRef = doc(getAuth(app), 'users', user.uid);
                    await setDoc(userRef, {
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        lastLogin: serverTimestamp(),
                    }, { merge: true });
                } catch (error) {
                    console.error('Error saving user data:', error);
                }
            } else {
                // User is signed out
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        // Clean up subscription
        return () => unsubscribe();
    }, []);

    /**
     * Login with email and password
     */
    const loginWithEmail = async (email, password) => {
        setAuthError(null);
        if (isBuildContext) {
            console.log('Running in build context - login attempt skipped');
            return null;
        }

        if (!getAuth(getFirebaseApp())) {
            throw new Error('Firebase auth not initialized');
        }

        try {
            const userCredential = await signInWithEmailAndPassword(getAuth(getFirebaseApp()), email, password);
            setUser(userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.error('Login error:', error);
            setAuthError(error.message);
            throw error;
        }
    };

    /**
     * Login with Google
     */
    const loginWithGoogle = async (useRedirect = false) => {
        setAuthError(null);
        if (isBuildContext) {
            console.log('Running in build context - Google login attempt skipped');
            return null;
        }

        if (!getAuth(getFirebaseApp()) || !googleProvider) {
            throw new Error('Firebase auth or Google provider not initialized');
        }

        try {
            const app = getFirebaseApp();
            const auth = getAuth(app);
            let result;
            if (useRedirect) {
                await signInWithRedirect(auth, googleProvider);
                // Result will be handled in the redirect callback
            } else {
                result = await signInWithPopup(auth, googleProvider);
                setUser(result.user);
            }

            return result?.user;
        } catch (error) {
            console.error('Google login error:', error);
            setAuthError(error.message);
            throw error;
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        if (isBuildContext) {
            console.log('Running in build context - logout attempt skipped');
            return;
        }

        if (!getAuth(getFirebaseApp())) {
            throw new Error('Firebase auth not initialized');
        }

        try {
            await signOut(getAuth(getFirebaseApp()));
            setUser(null);

            // Clear admin token if exists
            localStorage.removeItem('geobit_admin_token');

            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/admin';
            }
        } catch (error) {
            console.error('Logout error:', error);
            setAuthError(error.message);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAdmin,
        authError,
        loginWithEmail,
        loginWithGoogle,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 