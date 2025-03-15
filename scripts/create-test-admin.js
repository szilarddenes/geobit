const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration for the test admin user
const TEST_USER = {
    email: 'test@test.test',
    password: 'testtest',
    displayName: 'Test Admin',
    localId: 'test-admin-user-id'
};

// Get project ID from .firebaserc
function getProjectId() {
    try {
        const firebaseRcPath = path.join(process.cwd(), '.firebaserc');
        const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
        return firebaseRc.projects.default;
    } catch (error) {
        console.warn('Could not read project ID from .firebaserc:', error.message);
        return 'geobit-959c9'; // Fallback project ID
    }
}

// Wait for an endpoint to be available
async function waitForEndpoint(name, url, maxRetries = 5, retryDelay = 2000) {
    console.log(`Checking if ${name} is accessible at ${url}`);

    for (let i = 0; i < maxRetries; i++) {
        try {
            // For Auth emulator, use a different check that's more reliable
            if (name === 'Auth emulator') {
                // Auth emulator specific check
                const testUrl = `${url}identitytoolkit.googleapis.com/v1/accounts:lookup?key=fake-api-key`;
                await axios.post(testUrl, { idToken: 'invalid-test-token' }, {
                    timeout: 3000,
                    validateStatus: status => true // Accept any status to check if it's responding
                });
            } else {
                await axios.get(url, {
                    timeout: 3000,
                    validateStatus: status => true // Accept any status for checking if the endpoint is up
                });
            }
            console.log(`✅ ${name} is accessible at ${url}`);
            return true;
        } catch (error) {
            // Check if it's just a typical auth error (means the server is up)
            if (error.response && error.response.status) {
                console.log(`✅ ${name} is accessible at ${url} (responded with status ${error.response.status})`);
                return true;
            }

            if (i < maxRetries - 1) {
                console.log(`⏳ ${name} not accessible yet. Retrying in ${retryDelay / 1000}s (${i + 1}/${maxRetries})...`);
                console.log(`  Debug: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error(`❌ ${name} not accessible after ${maxRetries} attempts`);
                console.error(`  Error details: ${error.message}`);
                return false;
            }
        }
    }
    return false;
}

// Create a test user in the Auth emulator with retries
async function createTestUser(maxRetries = 3) {
    const projectId = getProjectId();
    console.log(`Using project ID: ${projectId}`);

    // Wait for auth and firestore endpoints with longer timeouts
    console.log("Verifying emulator endpoints are accessible...");
    const authEndpoint = 'http://127.0.0.1:9099/';
    const firestoreEndpoint = 'http://127.0.0.1:8080/';

    const authReady = await waitForEndpoint('Auth emulator', authEndpoint, 10, 3000);
    if (!authReady) {
        throw new Error('Auth emulator is not accessible');
    }

    const firestoreReady = await waitForEndpoint('Firestore emulator', firestoreEndpoint, 10, 3000);
    if (!firestoreReady) {
        throw new Error('Firestore emulator is not accessible');
    }

    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt + 1}/${maxRetries} to create/verify test admin user`);

            // Try to sign in first to see if user already exists
            try {
                console.log(`Checking if user ${TEST_USER.email} already exists...`);
                const signInUrl = `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`;
                const signInResponse = await axios.post(signInUrl, {
                    email: TEST_USER.email,
                    password: TEST_USER.password,
                    returnSecureToken: true
                });

                const userId = signInResponse.data.localId;
                console.log(`✅ User ${TEST_USER.email} exists and authenticated successfully with ID: ${userId}`);

                // Try to ensure admin claims are set
                try {
                    console.log('Setting admin custom claims...');
                    // Use the emulator-specific endpoint
                    const setCustomClaimsUrl = `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts/${userId}:setClaims`;
                    await axios.post(setCustomClaimsUrl, {
                        customClaims: { admin: true }
                    });
                    console.log(`✅ Set admin custom claims using emulator endpoint`);
                } catch (claimsError) {
                    console.warn(`⚠️ Could not set claims using emulator endpoint: ${claimsError.message}`);

                    // Try with the regular endpoint as fallback
                    try {
                        const claimsUrl = `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-api-key`;
                        await axios.post(claimsUrl, {
                            localId: userId,
                            customAttributes: JSON.stringify({ admin: true })
                        });
                        console.log(`✅ Set admin custom claims using regular endpoint`);
                    } catch (regularClaimsError) {
                        console.warn(`⚠️ Could not set claims using regular endpoint: ${regularClaimsError.message}`);
                    }
                }

                // Ensure admin Firestore document exists
                try {
                    console.log('Creating/updating admin document in Firestore...');
                    const firestoreUrl = `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/adminUsers/${userId}`;
                    await axios.patch(firestoreUrl, {
                        fields: {
                            email: { stringValue: TEST_USER.email },
                            displayName: { stringValue: TEST_USER.displayName },
                            addedAt: { timestampValue: new Date().toISOString() },
                            addedBy: { stringValue: 'emulator-setup-script' }
                        }
                    });
                    console.log(`✅ Created/updated admin user document in Firestore`);
                } catch (firestoreError) {
                    console.warn(`⚠️ Could not update Firestore document: ${firestoreError.message}`);
                }

                return true;
            } catch (signInError) {
                // User doesn't exist or sign-in failed, try to create
                console.log(`User doesn't exist or sign-in failed: ${signInError.message}`);
                console.log('Attempting to create new user...');
            }

            // Create user in Auth emulator
            console.log(`Creating new user: ${TEST_USER.email}...`);
            const authUrl = `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`;

            const authResponse = await axios.post(authUrl, {
                email: TEST_USER.email,
                password: TEST_USER.password,
                returnSecureToken: true
            });

            const userId = authResponse.data.localId;
            console.log(`✅ Created test user with ID: ${userId}`);

            // Try both methods to set custom claims
            try {
                // Use the emulator-specific endpoint (more reliable)
                const setCustomClaimsUrl = `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts/${userId}:setClaims`;
                await axios.post(setCustomClaimsUrl, {
                    customClaims: { admin: true }
                });
                console.log(`✅ Set admin custom claims using emulator endpoint`);
            } catch (claimsError) {
                console.warn(`⚠️ Could not set claims using emulator endpoint: ${claimsError.message}`);

                // Try with the regular endpoint as fallback
                try {
                    const claimsUrl = `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-api-key`;
                    await axios.post(claimsUrl, {
                        localId: userId,
                        customAttributes: JSON.stringify({ admin: true })
                    });
                    console.log(`✅ Set admin custom claims using regular endpoint`);
                } catch (regularClaimsError) {
                    console.warn(`⚠️ Could not set claims using regular endpoint: ${regularClaimsError.message}`);
                }
            }

            // Create admin user document in Firestore
            try {
                const firestoreUrl = `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/adminUsers/${userId}`;
                await axios.patch(firestoreUrl, {
                    fields: {
                        email: { stringValue: TEST_USER.email },
                        displayName: { stringValue: TEST_USER.displayName },
                        addedAt: { timestampValue: new Date().toISOString() },
                        addedBy: { stringValue: 'emulator-setup-script' }
                    }
                });
                console.log(`✅ Created admin user document in Firestore`);
            } catch (firestoreError) {
                console.warn(`⚠️ Could not create Firestore document: ${firestoreError.message}`);
            }

            console.log('\n=== Test Admin User Created ===');
            console.log(`Email: ${TEST_USER.email}`);
            console.log(`Password: ${TEST_USER.password}`);
            console.log(`User ID: ${userId}`);
            console.log('Custom Claims: { "admin": true }');

            return true;
        } catch (error) {
            lastError = error;
            console.error(`❌ Error during attempt ${attempt + 1}: ${error.message}`);

            if (error.response) {
                console.error('Response error data:', JSON.stringify(error.response.data || {}, null, 2));
            }

            if (attempt < maxRetries - 1) {
                console.log(`⏳ Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    throw lastError || new Error('Failed to create test admin user after multiple attempts');
}

// Main function
async function main() {
    console.log('=== Creating Test Admin User in Firebase Emulators ===');

    try {
        const success = await createTestUser();
        if (success) {
            console.log('\n✅ Test admin user setup complete!');
            console.log('You can now sign in to the application with:');
            console.log(`Email: ${TEST_USER.email}`);
            console.log(`Password: ${TEST_USER.password}`);
            process.exit(0);
        } else {
            console.error('\n❌ Failed to set up test admin user');
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 