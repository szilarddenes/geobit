import { NextResponse } from 'next/server';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
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
 * Newsletter subscription API endpoint
 * Validates the email, checks if already subscribed, and adds to the database
 */
export async function POST(request) {
  try {
    // Parse the JSON request body
    const { email, categories = [], source = 'website' } = await request.json();

    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists in subscribers collection
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Email already subscribed', status: 'already_subscribed' },
        { status: 200 }
      );
    }

    // Add new subscriber
    const subscriberData = {
      email,
      categories,
      source,
      subscribed_at: new Date().toISOString(),
      active: true,
      confirmed: false, // Will be set to true after confirmation
    };

    await addDoc(subscribersRef, subscriberData);

    // TODO: Send confirmation email using SendGrid
    // This would be implemented in a separate function or here

    return NextResponse.json({
      message: 'Subscription successful!',
      status: 'success'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Subscription failed', details: error.message },
      { status: 500 }
    );
  }
}
