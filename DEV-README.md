# GeoBit Development Environment

This file provides instructions for setting up and running the GeoBit development environment with Firebase emulators and a test admin user.

## Quick Start

To start the development environment with Firebase emulators and a test admin user in one command:

```bash
npm run easy
```

This command:
1. Stops any running emulators or Next.js servers
2. Starts the Firebase emulators (Auth, Firestore, Functions, etc.)
3. Creates a test admin user (or uses an existing one)
4. Starts the Next.js development server with the correct environment variables

## Test Admin User Credentials

Once the environment is running, you can log in with these credentials:

```
Email: test@test.test
Password: testtest
```

## Firebase Emulator UI

Access the Firebase Emulator UI at:
```
http://localhost:4000
```

This UI allows you to:
- View and manipulate Firestore data
- Manage user accounts in the Auth emulator
- Inspect Function calls and logs

## Alternative Commands

If the easy script doesn't work for you, there are some alternatives:

1. Start just the Firebase emulators:
   ```bash
   npm run emulators
   ```

2. Start Next.js with emulator configuration:
   ```bash
   npm run dev:emu
   ```

3. Create a test admin user:
   ```bash
   npm run direct:admin
   ```

4. Check emulator status and debug issues:
   ```bash
   npm run fix-emulators
   ```

## Troubleshooting

If you're having issues:

1. Check if any processes are using port 3000 or the emulator ports:
   ```bash
   lsof -i :3000
   lsof -i :9099  # Auth emulator
   lsof -i :8080  # Firestore emulator
   ```

2. Kill any existing emulator or Next.js processes:
   ```bash
   pkill -f "firebase emulators"
   pkill -f "next dev"
   ```

3. Check the emulator logs:
   ```bash
   cat emulators.log
   ```

4. Make sure your `.env.development` file contains `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`

Happy coding! 