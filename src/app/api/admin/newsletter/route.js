import { NextResponse } from 'next/server';
import { withAdminMiddleware, getAdminFirestore } from '../middleware';

/**
 * Get all newsletters (admin only)
 */
async function GET(request) {
  try {
    const db = getAdminFirestore();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status'); // 'draft', 'published', 'all'
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build query
    let query = db.collection('newsletters')
      .orderBy('created_at', 'desc');
    
    // Add status filter if specified
    if (status && status !== 'all') {
      const published = status === 'published';
      query = query.where('published', '==', published);
    }
    
    // Get total count for pagination
    const countSnapshot = await query.count().get();
    const totalCount = countSnapshot.data().count;
    
    // Get paginated results
    const snapshot = await query
      .limit(limit)
      .offset(offset)
      .get();
    
    // Format results
    const newsletters = [];
    snapshot.forEach(doc => {
      newsletters.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      newsletters,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: totalPages,
        hasMore: page < totalPages,
      }
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Create a new newsletter (admin only)
 */
async function POST(request) {
  try {
    const db = getAdminFirestore();
    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Newsletter title is required' },
        { status: 400 }
      );
    }
    
    // Prepare newsletter data
    const now = new Date().toISOString();
    const newsletterData = {
      title: data.title,
      description: data.description || '',
      content: data.content || '',
      published: data.published || false,
      categories: data.categories || [],
      created_at: now,
      updated_at: now,
      created_by: request.user.uid,
      published_at: data.published ? now : null,
    };
    
    // Add to Firestore
    const docRef = await db.collection('newsletters').add(newsletterData);
    
    return NextResponse.json({
      id: docRef.id,
      ...newsletterData,
      message: 'Newsletter created successfully'
    });
  } catch (error) {
    console.error('Error creating newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to create newsletter', details: error.message },
      { status: 500 }
    );
  }
}

// Protect the route with admin middleware
export const GET = withAdminMiddleware(GET);
export const POST = withAdminMiddleware(POST);
