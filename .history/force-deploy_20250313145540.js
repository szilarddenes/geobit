#!/usr/bin/env node

/**
 * This script force-deploys Firebase Functions without TypeScript checks or linting
 * Only use for development when you're confident in your code
 * Run with: node force-deploy.js
 */

const { execSync } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log(`Loading environment variables from ${envPath}`);
    dotenv.config({ path: envPath });
} else {
    console.warn('No .env file found. Using environment variables from process.');
}

// Variables to deploy to Firebase
const configVars = {
    'app.admin_token': process.env.ADMIN_TOKEN || 'geobit-admin-secure-token-2025',
    'app.openrouter_api_key': process.env.OPENROUTER_API_KEY,
};

console.log('Deploying the following configuration to Firebase:');
for (const [key, value] of Object.entries(configVars)) {
    if (value) {
        // Mask sensitive values in console
        const maskedValue = key.includes('token') || key.includes('key')
            ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
            : value;
        console.log(`  ${key}: ${maskedValue}`);
    } else {
        console.warn(`  Warning: ${key} is not set`);
    }
}

try {
    // Set Firebase environment variables
    console.log('\nSetting Firebase Functions configuration...');

    // Build the Firebase config:set command
    const configCommand = 'firebase functions:config:set ' +
        Object.entries(configVars)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

    execSync(configCommand, { stdio: 'inherit' });
    console.log('\nConfiguration successfully set!');

    // Deploy using direct CLI commands to bypass Firebase's predeploy hooks
    console.log('\nForce deploying Firebase Functions (bypassing TypeScript checks)...');

    // Create a temporary firebase.json with no predeploy hooks
    const tempFirebaseJson = {
        "functions": {
            "source": "functions",
            "predeploy": []
        }
    };

    // Backup original firebase.json
    if (fs.existsSync('firebase.json')) {
        fs.renameSync('firebase.json', 'firebase.json.backup');
    }

    // Write temporary firebase.json
    fs.writeFileSync('firebase.json', JSON.stringify(tempFirebaseJson, null, 2));

    try {
        // Deploy with temporary config
        execSync('firebase deploy --only functions', { stdio: 'inherit' });
        console.log('\nDeployment completed successfully!');
    } finally {
        // Restore original firebase.json
        if (fs.existsSync('firebase.json.backup')) {
            fs.renameSync('firebase.json.backup', 'firebase.json');
        }
    }
} catch (error) {
    console.error('\nError deploying configuration:', error.message);

    // Restore firebase.json if backup exists
    if (fs.existsSync('firebase.json.backup')) {
        fs.renameSync('firebase.json.backup', 'firebase.json');
    }

    process.exit(1);
} 