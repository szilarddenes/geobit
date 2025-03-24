// This script creates a test admin user in the Firebase Auth emulator
// It's designed to be run after the emulators are started
// The test user can be used to access admin routes during development

const admin = require('firebase-admin');

// Initialize the admin SDK with emulator settings
// No need for service account when using emulators
admin.initializeApp({
    projectId: 'geobit'
});

// Configure to use emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

async function createTestAdmin() {
    try {
        // Create the test user in Auth
        console.log('Creating test admin user...');

        // First check if user already exists
        try {
            const userRecord = await admin.auth().getUserByEmail('test@test.test');
            console.log('Test admin user already exists:', userRecord.uid);

            // Ensure admin role in Firestore
            await setAdminRole(userRecord.uid);
            process.exit(0);
        } catch (error) {
            // User doesn't exist, continue with creation
            if (error.code === 'auth/user-not-found') {
                console.log('Creating new test admin user...');
            } else {
                console.error('Error checking user:', error);
                process.exit(1);
            }
        }

        // Create new user
        const userRecord = await admin.auth().createUser({
            email: 'test@test.test',
            password: 'testtest',
            displayName: 'Test Admin'
        });

        console.log('Created test user:', userRecord.uid);

        // Set custom claims to mark as admin
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
        console.log('Set admin claims for user');

        // Also store in Firestore for redundancy
        await setAdminRole(userRecord.uid);

        console.log('Successfully created test admin user:');
        console.log('Email: test@test.test');
        console.log('Password: testtest');

        process.exit(0);
    } catch (error) {
        console.error('Error creating test admin:', error);
        process.exit(1);
    }
}

async function setAdminRole(uid) {
    // Create a document in the admins collection
    const db = admin.firestore();
    await db.collection('admins').doc(uid).set({
        email: 'test@test.test',
        displayName: 'Test Admin',
        addedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Added user to admins collection in Firestore');
}

// Execute the function
createTestAdmin(); 