// This script creates a test admin user in the Firebase Auth emulator
// It's designed to be run after the emulators are started
// The test user can be used to access admin routes during development

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Initialize the admin SDK with emulator settings
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'http://localhost:9000?ns=geobit',
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

            return userRecord.uid;
        } catch (error) {
            // User doesn't exist, create a new one
            if (error.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email: 'test@test.test',
                    password: 'testtest',
                    displayName: 'Test Admin',
                });

                console.log('Created new test admin user:', userRecord.uid);

                // Set admin role in Firestore
                await setAdminRole(userRecord.uid);

                return userRecord.uid;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error creating test admin user:', error);
        process.exit(1);
    }
}

// Set admin role in Firestore
async function setAdminRole(uid) {
    const db = admin.firestore();

    await db.collection('users').doc(uid).set({
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        email: 'test@test.test',
        displayName: 'Test Admin',
    }, { merge: true });

    console.log('Set admin role for user:', uid);
}

// Run the function and exit when done
createTestAdmin()
    .then(() => {
        console.log('Test admin user creation complete.');
        process.exit(0);
    })
    .catch(error => {
        console.error('Error in test admin creation script:', error);
        process.exit(1);
    }); 