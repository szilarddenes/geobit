import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if user has admin privileges
 * @returns {Object} Auth state with loading and admin status
 */
export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Check admin status in Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists() && userSnap.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, loading, isAdmin };
}

/**
 * Higher-order component to protect admin routes
 * @param {Component} Component - React component to protect
 * @returns {Component} Protected component that redirects non-admins
 */
export function withAdminAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, loading, isAdmin } = useAdminAuth();
    const [redirecting, setRedirecting] = useState(false);
    
    useEffect(() => {
      // If not loading and either no user or not admin, redirect
      if (!loading && (!user || !isAdmin)) {
        setRedirecting(true);
        
        // In a client component, you would use router.push here
        // Since this could be used in both client and server components,
        // we'll check if window exists before redirecting
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=admin';
        }
      }
    }, [loading, user, isAdmin]);
    
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
    }
    
    if (redirecting) {
      return <div className="min-h-screen flex items-center justify-center">
        <div>Redirecting to login...</div>
      </div>;
    }
    
    if (!isAdmin) {
      return null; // This will briefly show before redirect happens
    }
    
    return <Component {...props} />;
  };
}

/**
 * Server-side admin check for API routes
 * @param {Request} request - Next.js API request object
 * @returns {Promise<boolean>} Whether the request is from an admin
 */
export async function verifyAdminRequest(request) {
  try {
    // This is a placeholder - in a real implementation you would:
    // 1. Extract the auth token from the request headers
    // 2. Verify the token using Firebase Admin SDK
    // 3. Check the user's admin status in Firestore
    
    // For server-side operations, you'd use Firebase Admin SDK
    // which would be imported and initialized differently than the client SDK
    
    // This is just a placeholder implementation
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // In a real implementation, you would verify this token
    // with Firebase Admin SDK and check admin status
    
    return false; // Return false until properly implemented with Firebase Admin SDK
  } catch (error) {
    console.error('Error verifying admin request:', error);
    return false;
  }
}
