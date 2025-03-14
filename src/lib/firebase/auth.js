import { useEffect, useState, createContext, useContext } from 'react';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Import Firebase instances from our singleton implementation
import { app, firebaseAuth as auth, firebaseDb as db } from './firebase-app';

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Check if a user has admin privileges
async function checkIfAdmin(user) {
    if (!user) return false;

    // List of admin emails - for production, store in Firestore or use custom claims
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',')
        .map(email => email.trim().toLowerCase());

    if (adminEmails.includes(user.email.toLowerCase())) {
        return true;
    }

    if (!db) {
        console.error('Firebase Firestore not initialized');
        return false;
    }

    try {
        // Check if user has admin role in Firestore
        const userRef = doc(db, 'users', user.uid);
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

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
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

                if (!db) {
                    console.error('Firebase Firestore not initialized');
                    setLoading(false);
                    return;
                }

                // Save user to Firestore
                try {
                    const userRef = doc(db, 'users', user.uid);
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

    // Login with email and password
    const loginWithEmail = async (email, password) => {
        if (!auth) {
            throw new Error('Firebase auth not initialized');
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Email login error:', error);
            setAuthError(error.message);
            throw error;
        }
    };

    // Login with Google
    const loginWithGoogle = async (useRedirect = false) => {
        if (!auth) {
            throw new Error('Firebase auth not initialized');
        }

        try {
            if (useRedirect) {
                await signInWithRedirect(auth, googleProvider);
                // This will redirect the user away from the app
                return null;
            } else {
                const result = await signInWithPopup(auth, googleProvider);
                return result.user;
            }
        } catch (error) {
            console.error('Google login error:', error);
            setAuthError(error.message);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        if (!auth) {
            throw new Error('Firebase auth not initialized');
        }

        try {
            await signOut(auth);
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
        loginWithEmail,
        loginWithGoogle,
        logout,
        authError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 