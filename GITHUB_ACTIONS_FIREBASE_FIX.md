# Fixing the Firebase API Key Issue in GitHub Actions

This guide helps you resolve the error: `Firebase: Error (auth/invalid-api-key)` in your GitHub Actions workflow.

## The Problem

The build is failing because the Firebase API key is either invalid or not being properly passed to the Next.js build process during GitHub Actions deployment.

## Solution Steps

### 1. Update GitHub Repository Secrets

You need to ensure that your Firebase configuration is properly stored in GitHub secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add or update the following secrets with values from your Firebase project:

   - `PROD_FIREBASE_API_KEY` - Your Firebase Web API key
   - `PROD_FIREBASE_AUTH_DOMAIN` - Your Firebase Auth domain
   - `PROD_FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `PROD_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
   - `PROD_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
   - `PROD_FIREBASE_APP_ID` - Your Firebase app ID

### 2. Get Firebase Configuration Values

If you need to update these values:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `geobit-959c9`
3. Click the gear icon ⚙️ to access **Project settings**
4. Scroll down to **Your apps** section
5. Select your web app
6. Look for the `firebaseConfig` object which contains all needed values:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### 3. Verify Workflow File Configuration

The workflow file (`.github/workflows/firebase-hosting-merge.yml`) should include these environment variables during the build step:

```yaml
- name: Build Next.js app
  run: npm run build
  env:
    NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.PROD_FIREBASE_API_KEY }}
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.PROD_FIREBASE_AUTH_DOMAIN }}
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.PROD_FIREBASE_PROJECT_ID }}
    # ... other environment variables
```

### 4. Changes Made to Fix This Issue

We've made the following improvements to help resolve this issue:

1. **Enhanced Error Logging**: Added debug steps to the GitHub Actions workflow to verify secret presence.

2. **Improved Firebase Configuration Resilience**: Updated the Firebase app initialization to include:
   - Better environment variable validation
   - Detailed logging without exposing sensitive information
   - Production fallbacks for build process
   - Proper error handling and debugging information

3. **Development and Production Differentiation**: Different fallback strategies for development and production environments.

## Testing the Solution

After updating your GitHub secrets with the correct Firebase credentials:

1. Push a commit to the master branch to trigger the workflow
2. Monitor the GitHub Actions logs to ensure proper environment variable presence
3. Check if the build completes successfully

## Common Issues

- **Missing or Invalid Secrets**: If secrets are missing or invalid, verify them in Firebase Console.
- **Environment Variable Scope**: Make sure environment variables are defined at the correct step level.
- **Next.js Environment Variables**: Next.js requires `NEXT_PUBLIC_` prefix for client-side accessible variables.

If the issue persists, check the logs for more detailed error messages and ensure all required secrets are properly set. 