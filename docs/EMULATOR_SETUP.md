# Firebase Emulator Setup for GeoBit

This guide explains how to use Firebase emulators for local development of the GeoBit application without affecting your production data.

## What are Firebase Emulators?

Firebase emulators create a local development environment that mimics Firebase services:

- **Firestore Emulator**: Local database that doesn't affect your production Firestore
- **Functions Emulator**: Runs your Cloud Functions locally
- **Auth Emulator**: Simulates Firebase Authentication

## Benefits for Development

- Test without affecting production data
- Work offline
- Faster development cycles
- Safe environment for experimentation

## Setup Instructions

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Update your .env.development file

Make sure your `.env.development` file includes:

```
# Enable Firebase Emulators
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

You can also copy the rest of your Firebase configuration from your production environment:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=geobit-959c9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=geobit-959c9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=geobit-959c9.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here

# API Keys - Same as production
NEXT_PUBLIC_PERPLEXITY_API_KEY=your-perplexity-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
```

### 3. Starting the Emulators

You have two options to start the emulators:

#### Option 1: Using the provided script
```bash
# Make sure the script is executable
chmod +x start-emulators.sh

# Run the script
./start-emulators.sh
```

#### Option 2: Using npm script
```bash
# Start just the emulators
npm run emulators

# Start both emulators and Next.js development server
npm run dev:emulate
```

### 4. Accessing the Emulator UI

Once the emulators are running, you can access the Firebase Emulator UI at:
```
http://localhost:4000
```

This UI lets you:
- View and edit Firestore data
- Check function executions
- Manage authentication

### 5. Seeding Sample Data

To populate your emulators with sample data:

```bash
npm run seed:emulators
```

This will create sample subscribers, articles, content sources, and newsletters in your local Firestore emulator.

## How It Works

The emulator integration works through these components:

1. **firebase.json**: Configures the ports and settings for each emulator
2. **src/lib/firebase.js**: Contains logic to detect development mode and connect to emulators
3. **.env.development**: Controls whether emulators are used via `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` flag

When in development mode with emulators enabled, the app:
- Connects to local ports instead of production Firebase
- Shows a visual indicator (purple "EMULATORS" badge) in the UI
- Uses mock data and fallbacks when needed

## Switching Between Development and Production

### For Local Development (with Emulators)
```bash
# Ensure these variables are set in .env.development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
NODE_ENV=development
```

### For Testing Against Production (careful!)
```bash
# Set to false in .env.development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

## Troubleshooting

### Common Issues:

1. **Emulator Not Connecting**
   - Check that ports aren't in use by other applications
   - Verify that `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` is set

2. **Firebase Initialization Failed**
   - Make sure all Firebase config values are present in .env.development
   - Check browser console for specific errors

3. **Functions Not Working**
   - Verify that functions emulator is running
   - Check functions logs in the emulator UI

### Resetting Emulator Data
To clear all data and start fresh:
```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

## Additional Resources

- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
- [Firebase Local Development Guide](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)
- [Firestore Emulator Documentation](https://firebase.google.com/docs/firestore/using-console)