const admin = require('firebase-admin');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Try to load service account file from the project root
let serviceAccount;
try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = require(serviceAccountPath);
    }
} catch (error) {
    console.warn('Could not load service account key from file:', error.message);
    console.warn('Falling back to GOOGLE_APPLICATION_CREDENTIALS environment variable');
}

// Initialize Firebase Admin
try {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // This will use GOOGLE_APPLICATION_CREDENTIALS environment variable
        admin.initializeApp();
    }
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    process.exit(1);
}

const db = admin.firestore();

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper to prompt for input
const prompt = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

async function setupAdmin() {
    console.log('=== GeoBit Admin User Setup ===');
    console.log('This script will help you add the first admin user to your GeoBit application.');
    console.log('The user must already exist in Firebase Authentication.');
    console.log();

    const email = await prompt('Enter the email address of the admin user: ');

    try {
        // Check if the user exists in Firebase Auth
        const userRecord = await admin.auth().getUserByEmail(email);

        if (!userRecord) {
            throw new Error('User not found in Firebase Authentication');
        }

        // Check if the user is already an admin
        const adminSnapshot = await db.collection('adminUsers').doc(userRecord.uid).get();

        if (adminSnapshot.exists) {
            console.log(`\nUser ${email} is already an admin.`);
        } else {
            // Add user to admin collection
            await db.collection('adminUsers').doc(userRecord.uid).set({
                email: userRecord.email,
                displayName: userRecord.displayName || '',
                addedAt: admin.firestore.FieldValue.serverTimestamp(),
                addedBy: 'setup-script',
            });

            console.log(`\nSuccess! User ${email} is now an admin.`);
        }

        // Create setup token for browser setup if needed
        const setupToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        console.log('\n=== Web Setup ===');
        console.log('If you need to add more admins through the web interface,');
        console.log('use this temporary setup token (valid for one session):');
        console.log(setupToken);
        console.log('\nStore this token securely in your Firebase Functions configuration:');
        console.log('Run: firebase functions:config:set app.setup_token="' + setupToken + '"');

    } catch (error) {
        console.error('\nError setting up admin user:', error.message);
    } finally {
        rl.close();
    }
}

setupAdmin(); 