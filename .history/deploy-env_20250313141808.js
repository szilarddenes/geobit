/**
 * Script to deploy environment variables to Firebase Functions
 * Run with: node deploy-env.js
 */

const { execSync } = require('child_process');
require('dotenv').config();

console.log('Deploying environment variables to Firebase Functions...');

// Collect the environment variables we want to deploy
const variables = [
    { key: 'app.admin_token', value: process.env.ADMIN_TOKEN },
    { key: 'app.openrouter_api_key', value: process.env.OPENROUTER_API_KEY }
];

// Build the Firebase CLI command
const command = variables
    .map(variable => {
        return `firebase functions:config:set ${variable.key}="${variable.value}"`;
    })
    .join(' && ');

try {
    // Execute the command
    execSync(command, { stdio: 'inherit' });
    console.log('Environment variables deployed successfully!');

    // Reminder about redeploying functions
    console.log('\nReminder: You must redeploy your functions for these changes to take effect:');
    console.log('firebase deploy --only functions');
} catch (error) {
    console.error('Error deploying environment variables:', error.message);
    process.exit(1);
} 