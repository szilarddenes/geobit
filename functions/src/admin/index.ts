import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firestore
const db = admin.firestore();

// Verify admin access
const verifyAdminAccess = async (password: string): Promise<boolean> => {
  try {
    // In a real app, we'd use proper authentication
    // This is a simple placeholder for the password-based approach
    
    // Get the admin password from Firestore settings
    const settingsDoc = await db.collection('settings').doc('admin').get();
    
    if (!settingsDoc.exists) {
      console.error('Admin settings not found');
      return false;
    }
    
    const settings = settingsDoc.data();
    return settings?.password === password;
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
};

// Admin login function
const adminLogin = functions.https.onCall(async (data, context) => {
  try {
    const { password } = data;
    
    if (!password) {
      throw new Error('Password is required');
    }
    
    const isAdmin = await verifyAdminAccess(password);
    
    if (!isAdmin) {
      throw new Error('Invalid password');
    }
    
    // Generate a secure admin token
    // In production, use a proper auth system with Firebase Auth custom claims
    const token = Math.random().toString(36).substring(2, 15);
    
    // Store token with expiry
    await db.collection('adminSessions').add({
      token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hour expiry
      )
    });
    
    return { success: true, token };
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
});

// Get content sources
const getContentSources = functions.https.onCall(async (data, context) => {
  try {
    // In production, verify admin token here
    
    const sourcesSnapshot = await db.collection('contentSources')
      .orderBy('name')
      .get();
    
    const sources = sourcesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, sources };
  } catch (error) {
    console.error('Error getting content sources:', error);
    return { success: false, error: error.message };
  }
});

// Add content source
const addContentSource = functions.https.onCall(async (data, context) => {
  try {
    // In production, verify admin token here
    
    const { name, url, category, scrapeSelector } = data;
    
    if (!name || !url) {
      throw new Error('Name and URL are required');
    }
    
    // Validate URL by attempting to fetch it
    try {
      await axios.get(url);
    } catch (error) {
      throw new Error(`Could not access URL: ${error.message}`);
    }
    
    // Add to Firestore
    const sourceRef = await db.collection('contentSources').add({
      name,
      url,
      category: category || 'general',
      scrapeSelector: scrapeSelector || '',
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, id: sourceRef.id };
  } catch (error) {
    console.error('Error adding content source:', error);
    return { success: false, error: error.message };
  }
});

// Update content source
const updateContentSource = functions.https.onCall(async (data, context) => {
  try {
    // In production, verify admin token here
    
    const { id, ...updateData } = data;
    
    if (!id) {
      throw new Error('Source ID is required');
    }
    
    // Remove fields that shouldn't be updated
    delete updateData.createdAt;
    
    // Update in Firestore
    await db.collection('contentSources').doc(id).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating content source:', error);
    return { success: false, error: error.message };
  }
});

// Delete content source
const deleteContentSource = functions.https.onCall(async (data, context) => {
  try {
    // In production, verify admin token here
    
    const { id } = data;
    
    if (!id) {
      throw new Error('Source ID is required');
    }
    
    // Delete from Firestore
    await db.collection('contentSources').doc(id).delete();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting content source:', error);
    return { success: false, error: error.message };
  }
});

// Get subscribers
const getSubscribers = functions.https.onCall(async (data, context) => {
  try {
    // In production, verify admin token here
    
    const { limit = 100, offset = 0 } = data;
    
    const subscribersSnapshot = await db.collection('subscribers')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    const subscribers = subscribersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get total count
    const countSnapshot = await db.collection('subscribers').count().get();
    const total = countSnapshot.data().count;
    
    return { 
      success: true, 
      subscribers,
      pagination: {
        total,
        limit,
        offset
      }
    };
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return { success: false, error: error.message };
  }
});

// Export functions
export default {
  adminLogin,
  getContentSources,
  addContentSource,
  updateContentSource,
  deleteContentSource,
  getSubscribers
};