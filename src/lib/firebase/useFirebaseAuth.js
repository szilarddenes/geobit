import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-app';

/**
 * Custom hook for Firebase Authentication that's optimized for Fast Refresh
 * This pattern helps avoid issues with stale auth state during development
 */
export function useFirebaseAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This handler is properly cleaned up on unmount
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures the effect runs once on mount

    return {
        user,
        loading,
        // Include auth instance for direct access to auth methods
        auth
    };
} 