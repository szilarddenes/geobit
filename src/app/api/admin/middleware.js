import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// Initialize Firebase Admin SDK if not already initialized
let adminApp;
try {
  adminApp = admin.app();
} catch (error) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || 
    '{"projectId":"geobit-959c9"}'  // Default fallback for local development
  );
  
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
  });
}

/**
 * Middleware for protecting admin API routes
 * @param {Function} handler - API route handler function
 * @returns {Function} - Middleware-wrapped handler
 */
export function withAdminMiddleware(handler) {
  return async function(request, context) {
    try {
      // Get session cookie from request
      const cookieStore = cookies();
      const sessionCookie = cookieStore.get('session')?.value;
      
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Verify session cookie
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
      
      if (!decodedClaims) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Check if user has admin role in Firestore
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
      
      if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Attach user claims to request for use in handler
      request.user = {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        isAdmin: true,
      };
      
      // Pass to handler function
      return handler(request, context);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

/**
 * Helper function to get admin Firestore instance
 * @returns {FirebaseFirestore.Firestore} - Firestore instance
 */
export function getAdminFirestore() {
  return admin.firestore();
}

/**
 * Helper function to get admin Auth instance
 * @returns {FirebaseAuth.Auth} - Auth instance
 */
export function getAdminAuth() {
  return admin.auth();
}
