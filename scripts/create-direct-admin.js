#!/usr/bin/env node

/**
 * This script directly creates a test admin user in the Firebase Auth emulator
 * with predefined credentials. It uses direct emulator REST APIs that don't
 * require Firebase Admin SDK.
 * 
 * Usage: node scripts/create-direct-admin.js
 * 
 * Credentials:
 * - Email: test@test.test
 * - Password: testtest
 * - Admin status: true
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// User configuration
const USER = {
    email: 'test@test.test',
    password: 'testtest',
    displayName: 'Test Admin'
};

// Get project ID from .firebaserc
function getProjectId() {
    try {
        const firebaseRcPath = path.join(process.cwd(), '.firebaserc');
        const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
        return firebaseRc.projects.default;
    } catch (error) {
        console.warn('Could not read project ID from .firebaserc, using default');
        return 'geobit-959c9';
    }
}

async function main() {
    try {
        const projectId = getProjectId();
        console.log(`Using project ID: ${projectId}`);

        // Step 1: Create the user (or sign in if already exists)
        let userId;
        try {
            console.log(`Attempting to create user: ${USER.email}`);
            const createResponse = await axios.post(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
                email: USER.email,
                password: USER.password,
                returnSecureToken: true
            });
            userId = createResponse.data.localId;
            console.log(`✅ User created with ID: ${userId}`);
        } catch (error) {
            if (error.response?.data?.error?.message === 'EMAIL_EXISTS') {
                console.log(`User ${USER.email} already exists, retrieving ID...`);
                try {
                    const signInResponse = await axios.post(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`, {
                        email: USER.email,
                        password: USER.password,
                        returnSecureToken: true
                    });
                    userId = signInResponse.data.localId;
                    console.log(`✅ Retrieved existing user ID: ${userId}`);
                } catch (signInError) {
                    console.error(`❌ Error signing in to existing account:`, signInError.message);
                    throw signInError;
                }
            } else {
                console.error(`❌ Error creating user:`, error.message);
                throw error;
            }
        }

        // Step 2: Set admin custom claims - try both methods
        // Method 1: Using emulator-specific endpoint (preferred)
        try {
            console.log('Setting admin custom claims via emulator endpoint...');
            await axios.post(`http://localhost:9099/emulator/v1/projects/${projectId}/accounts/${userId}:setClaims`, {
                customClaims: { admin: true }
            });
            console.log('✅ Admin claims set via emulator endpoint');
        } catch (error1) {
            console.warn(`⚠️ Could not set claims via emulator endpoint: ${error1.message}`);

            // Method 2: Using regular endpoint as fallback
            try {
                console.log('Setting admin custom claims via regular endpoint...');
                await axios.post(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-api-key`, {
                    localId: userId,
                    customAttributes: JSON.stringify({ admin: true })
                });
                console.log('✅ Admin claims set via regular endpoint');
            } catch (error2) {
                console.error(`❌ Failed to set admin claims via both methods`);
                console.error(error2.message);
                // Continue anyway, as the user is created
            }
        }

        // Step 3: Create admin document in Firestore
        try {
            console.log('Creating admin user document in Firestore...');
            await axios.patch(`http://localhost:8080/v1/projects/${projectId}/databases/(default)/documents/adminUsers/${userId}`, {
                fields: {
                    email: { stringValue: USER.email },
                    displayName: { stringValue: USER.displayName },
                    addedAt: { timestampValue: new Date().toISOString() },
                    isAdmin: { booleanValue: true }
                }
            });
            console.log('✅ Admin user document created in Firestore');
        } catch (error) {
            console.warn(`⚠️ Could not create Firestore document: ${error.message}`);
            // Continue anyway
        }

        console.log('\n=== Test Admin User Ready ===');
        console.log(`Email: ${USER.email}`);
        console.log(`Password: ${USER.password}`);
        console.log(`User ID: ${userId}`);
        console.log(`Admin Claims: { "admin": true }`);
        console.log('\nYou can now log in to the application with these credentials.');

    } catch (error) {
        console.error('Failed to create test admin user:');
        console.error(error.message);
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

main(); 