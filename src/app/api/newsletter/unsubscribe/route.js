import { NextResponse } from 'next/server';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Initialize Firebase - server-side only
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Newsletter unsubscribe API endpoint
 * Validates the email, finds the subscriber, and marks as inactive
 */
export async function POST(request) {
  try {
    // Parse the JSON request body
    const { email, token } = await request.json();

    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email exists in subscribers collection
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Email not found in subscribers list' },
        { status: 404 }
      );
    }

    // Update subscriber to inactive
    const subscriberDoc = querySnapshot.docs[0];
    
    // In a production app, you'd verify the unsubscribe token here
    // For simplicity, we're just checking if the email exists
    
    await updateDoc(doc(db, 'subscribers', subscriberDoc.id), {
      active: false,
      unsubscribed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Successfully unsubscribed',
      status: 'success'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Unsubscribe failed', details: error.message },
      { status: 500 }
    );
  }
}
