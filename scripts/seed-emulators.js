/**
 * Seed script for Firebase emulators
 * This script populates the local Firestore emulator with sample data for development
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize the admin SDK with emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
admin.initializeApp({
  projectId: 'geobit-emulator'
});

const db = admin.firestore();

// Sample data for collections
const sampleData = {
  subscribers: [
    { 
      email: 'test1@example.com', 
      status: 'active', 
      subscribedAt: admin.firestore.Timestamp.now(),
      preferences: {
        categories: ['geology', 'climate']
      }
    },
    { 
      email: 'test2@example.com', 
      status: 'active', 
      subscribedAt: admin.firestore.Timestamp.now(),
      preferences: {
        categories: ['oceanography', 'research']
      }
    },
    { 
      email: 'test3@example.com', 
      status: 'inactive', 
      subscribedAt: admin.firestore.Timestamp.fromDate(new Date('2023-10-15')),
      unsubscribedAt: admin.firestore.Timestamp.fromDate(new Date('2023-12-01')),
      preferences: {
        categories: ['geology']
      }
    }
  ],
  
  contentSources: [
    {
      name: 'Nature Geoscience',
      url: 'https://www.nature.com/ngeo/',
      category: 'journal',
      active: true,
      addedAt: admin.firestore.Timestamp.now()
    },
    {
      name: 'Science Daily - Earth',
      url: 'https://www.sciencedaily.com/news/earth_climate/',
      category: 'news',
      active: true,
      addedAt: admin.firestore.Timestamp.now()
    },
    {
      name: 'American Geophysical Union',
      url: 'https://eos.org/',
      category: 'organization',
      active: true,
      addedAt: admin.firestore.Timestamp.now()
    }
  ],
  
  articles: [
    {
      title: 'New Method for Tracking Ocean Currents',
      source: 'Nature Geoscience',
      sourceUrl: 'https://www.nature.com/articles/sample1',
      publishedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-01')),
      summary: 'Researchers have developed a new method for tracking ocean currents using satellite data and machine learning algorithms.',
      category: 'oceanography',
      interestScore: 85,
      addedAt: admin.firestore.Timestamp.now()
    },
    {
      title: 'Climate Change Impact on Mountain Glaciers',
      source: 'Science Daily',
      sourceUrl: 'https://www.sciencedaily.com/articles/sample2',
      publishedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-05')),
      summary: 'A comprehensive study of mountain glaciers across six continents reveals accelerated melting due to climate change.',
      category: 'climate',
      interestScore: 92,
      addedAt: admin.firestore.Timestamp.now()
    },
    {
      title: 'Seismic Activity Patterns in Subduction Zones',
      source: 'American Geophysical Union',
      sourceUrl: 'https://eos.org/articles/sample3',
      publishedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-10')),
      summary: 'New research identifies patterns in seismic activity that could help predict major earthquakes in subduction zones.',
      category: 'geology',
      interestScore: 78,
      addedAt: admin.firestore.Timestamp.now()
    }
  ],
  
  newsletters: [
    {
      title: 'GeoBit Weekly: March Edition',
      publishedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-12')),
      status: 'published',
      contentIds: ['article1', 'article2', 'article3'],
      sentCount: 125,
      openCount: 87,
      clickCount: 42
    }
  ]
};

// Function to seed a collection
async function seedCollection(collectionName, data) {
  console.log(`Seeding collection: ${collectionName} with ${data.length} documents...`);
  
  const batch = db.batch();
  
  data.forEach((doc, index) => {
    const docRef = db.collection(collectionName).doc(`sample-${index + 1}`);
    batch.set(docRef, doc);
  });
  
  await batch.commit();
  console.log(`✓ Collection ${collectionName} seeded successfully!`);
}

// Main seeding function
async function seedEmulators() {
  try {
    console.log('🌱 Starting emulator seeding process...');
    
    // Seed each collection
    for (const [collection, data] of Object.entries(sampleData)) {
      await seedCollection(collection, data);
    }
    
    console.log('✅ Emulator seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding emulators:', error);
    process.exit(1);
  }
}

// Run the seeding
seedEmulators();