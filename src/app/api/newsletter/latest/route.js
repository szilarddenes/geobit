import { NextResponse } from 'next/server';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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
 * Get the latest published newsletter
 * Can be filtered by category (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Query to get the latest published newsletter
    let q = query(
      collection(db, 'newsletters'),
      where('published', '==', true),
      orderBy('published_at', 'desc'),
      limit(1)
    );
    
    // Add category filter if provided
    if (category) {
      q = query(
        collection(db, 'newsletters'),
        where('published', '==', true),
        where('categories', 'array-contains', category),
        orderBy('published_at', 'desc'),
        limit(1)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'No newsletters found' },
        { status: 404 }
      );
    }
    
    // Get the first (latest) newsletter
    const newsletter = querySnapshot.docs[0].data();
    
    // Add the document ID to the response
    const newsletterWithId = {
      id: querySnapshot.docs[0].id,
      ...newsletter,
    };
    
    return NextResponse.json({
      newsletter: newsletterWithId
    });
  } catch (error) {
    console.error('Error fetching latest newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter', details: error.message },
      { status: 500 }
    );
  }
}
