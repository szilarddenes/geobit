#!/usr/bin/env node

/**
 * This script verifies Firebase emulator connections and logs debug information.
 * It can be used to troubleshoot connection issues between the Next.js app and Firebase emulators.
 */

const axios = require('axios');

// Check if emulators are running
async function checkEmulators() {
    console.log('Checking Firebase emulators...');

    const emulators = [
        { name: 'Auth', url: 'http://127.0.0.1:9099/' },
        { name: 'Firestore', url: 'http://127.0.0.1:8080/' },
        { name: 'Functions', url: 'http://127.0.0.1:5001/' },
        { name: 'Database', url: 'http://127.0.0.1:9000/' },
        { name: 'Hub UI', url: 'http://127.0.0.1:4000/' }
    ];

    let allRunning = true;

    for (const emulator of emulators) {
        try {
            const response = await axios.get(emulator.url, { timeout: 3000 });
            console.log(`✅ ${emulator.name} emulator is running (status: ${response.status})`);
        } catch (error) {
            if (error.response) {
                // Got a response, but not 2xx (still means emulator is running)
                console.log(`✅ ${emulator.name} emulator is running (status: ${error.response.status})`);
            } else {
                console.error(`❌ ${emulator.name} emulator not accessible: ${error.message}`);
                allRunning = false;
            }
        }
    }

    return allRunning;
}

// Debug environment variables related to Firebase
function debugEnvironmentVariables() {
    console.log('\n=== Environment Variables Debug ===');

    // Core vars needed for emulators
    const coreVars = [
        'NODE_ENV',
        'NEXT_PUBLIC_USE_FIREBASE_EMULATORS',
        'NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL',
        'NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST',
        'NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_URL',
        'NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];

    console.log('Core environment variables:');
    coreVars.forEach(varName => {
        console.log(`  ${varName}: ${process.env[varName] || '(not set)'}`);
    });

    console.log('\nAll environment variables starting with NEXT_PUBLIC_FIREBASE:');
    Object.keys(process.env)
        .filter(key => key.startsWith('NEXT_PUBLIC_FIREBASE'))
        .forEach(key => {
            console.log(`  ${key}: ${process.env[key]}`);
        });

    // Check for common issues
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'true') {
        console.error('⚠️  NEXT_PUBLIC_USE_FIREBASE_EMULATORS is not set to "true"');
        console.error('    Firebase emulators will not be used even if they are running');
    }

    if (process.env.NODE_ENV !== 'development') {
        console.error('⚠️  NODE_ENV is not set to "development"');
        console.error('    This may prevent emulators from being used');
    }
}

// Create a test user in Auth emulator
async function createTestUser() {
    console.log('\n=== Creating Test Admin User ===');

    const testUser = {
        email: 'test@test.test',
        password: 'testtest',
        returnSecureToken: true
    };

    try {
        // Try to create user
        console.log('Attempting to create user...');
        const authUrl = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key';
        const createResponse = await axios.post(authUrl, testUser);

        const userId = createResponse.data.localId;
        console.log(`✅ User created with ID: ${userId}`);

        // Set admin claims
        console.log('Setting admin custom claims...');
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'geobit-959c9';
        await axios.post(`http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts/${userId}:setClaims`, {
            customClaims: { admin: true }
        });

        console.log('✅ Admin claims set successfully');

        return { success: true, userId };
    } catch (error) {
        if (error.response?.data?.error?.message === 'EMAIL_EXISTS') {
            console.log('User already exists, trying to sign in...');

            try {
                const signInUrl = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key';
                const signInResponse = await axios.post(signInUrl, testUser);

                const userId = signInResponse.data.localId;
                console.log(`✅ Signed in existing user with ID: ${userId}`);

                // Set admin claims again to ensure they're set
                console.log('Setting admin custom claims...');
                const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'geobit-959c9';
                await axios.post(`http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts/${userId}:setClaims`, {
                    customClaims: { admin: true }
                });

                console.log('✅ Admin claims set successfully');

                return { success: true, userId };
            } catch (signInError) {
                console.error(`❌ Error signing in: ${signInError.message}`);
                if (signInError.response) {
                    console.error(JSON.stringify(signInError.response.data, null, 2));
                }
                return { success: false, error: signInError.message };
            }
        }

        console.error(`❌ Error creating user: ${error.message}`);
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, error: error.message };
    }
}

// Main function
async function main() {
    console.log('=== Firebase Emulator Debug Tool ===\n');

    // Debug environment variables first
    debugEnvironmentVariables();

    // Check if emulators are running
    const emulatorsRunning = await checkEmulators();
    if (!emulatorsRunning) {
        console.error('\n❌ Not all emulators are running!');
        console.error('Please start the emulators with: firebase emulators:start');
        return;
    }

    console.log('\n✅ All emulators are running!');

    // Create a test user
    const userResult = await createTestUser();

    if (userResult.success) {
        console.log('\n=== Success ===');
        console.log('All Firebase emulators are running and test user is set up.');
        console.log('You can now log in with:');
        console.log('  Email: test@test.test');
        console.log('  Password: testtest');
    } else {
        console.log('\n⚠️ Firebase emulators are running but there was an issue with the test user.');
        console.log('You may still be able to use the application, but admin functionality might be limited.');
    }

    console.log('\nNext steps:');
    console.log('1. Start the Next.js development server: npm run dev:emu');
    console.log('2. Make sure your browser loads the app with emulators: http://localhost:3000');
}

// Run the main function
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 