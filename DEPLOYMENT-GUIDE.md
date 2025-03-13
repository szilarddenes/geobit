# Automatic Deployment Guide for GeoBit

This guide explains how to use the automatic GitHub Actions deployment workflow for GeoBit.

## How It Works

The setup uses GitHub Actions to automatically deploy your project to Firebase whenever you push to the master branch. The workflow will:

1. Build your Next.js application
2. Install dependencies for Firebase Functions
3. Deploy everything to Firebase

## Setup Instructions

### 1. Generate a Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service accounts
4. Click "Generate new private key"
5. Save the JSON file (you'll need it for the next step)

### 2. Add Secrets to Your GitHub Repository

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

   **Firebase Service Account**
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: *[Paste the entire content of the service account JSON file]*

   **Firebase Configuration**
   - `FIREBASE_API_KEY` - Your Firebase API key
   - `FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
   - `FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
   - `FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
   - `FIREBASE_APP_ID` - Your Firebase app ID

   You can find all these values in your Firebase project settings or in the Firebase config object.

### 3. Update Your Firebase Configuration (if needed)

Make sure your `firebase.json` file is correctly configured for your project. It should include configurations for hosting, functions, and firestore.

### 4. Push Your Changes

Now, whenever you push to the master branch, the GitHub Actions workflow will automatically:

- Build your application
- Deploy it to Firebase

## Using the Workflow

With this setup, your development workflow becomes:

1. Make changes to your code locally
2. Test your changes with `npm run dev`
3. Commit your changes
4. Push to the master branch:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin master
   ```

5. The GitHub Actions workflow will automatically deploy your changes to Firebase

## Monitoring Deployments

You can monitor the status of your deployments in the "Actions" tab of your GitHub repository.

## Troubleshooting

If a deployment fails, check the GitHub Actions logs for detailed error messages. Common issues include:

- Missing or incorrect secrets
- Build errors in your Next.js application
- Incorrect Firebase configuration
- Permission issues with the Firebase service account

If you need to update any secrets, go back to your repository settings and update the corresponding values.

## Additional Configuration

If you need to customize the deployment process, you can modify the `.github/workflows/firebase-deploy.yml` file. You might want to:

- Deploy only specific Firebase services
- Add more environment variables
- Change the deployment conditions (e.g., deploy only on tagged commits)
- Add testing steps before deployment

Refer to the [GitHub Actions documentation](https://docs.github.com/en/actions) and [Firebase GitHub Action documentation](https://github.com/FirebaseExtended/action-hosting-deploy) for more details.
