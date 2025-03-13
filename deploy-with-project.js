#!/usr/bin/env node
/**
 * Custom deploy script for Firebase functions and hosting
 * Explicitly sets the project ID during deployment
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// The Firebase project ID - replace with your actual project ID
const PROJECT_ID = 'geobit-959c9';

console.log('📦 Starting custom deployment with explicit project ID...');

// Ensure .firebaserc exists with correct project
const firebaseRcPath = path.join(__dirname, '.firebaserc');
const firebaseRcContent = JSON.stringify({
    projects: {
        default: PROJECT_ID
    }
}, null, 2);

console.log(`🔧 Creating/updating .firebaserc with project ID: ${PROJECT_ID}`);
fs.writeFileSync(firebaseRcPath, firebaseRcContent);

try {
    // First build the Next.js app
    console.log('🔨 Building Next.js application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy to Firebase with explicit project ID
    console.log('🚀 Deploying to Firebase...');
    execSync(`firebase deploy --project=${PROJECT_ID}`, {
        stdio: 'inherit'
    });

    console.log('✅ Deployment completed successfully!');
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
} 