# GeoBit JavaScript Implementation

This branch contains a pure JavaScript implementation of the GeoBit newsletter application. The TypeScript files have been converted to JavaScript for easier deployment and maintenance.

## Changes from the original version

1. Converted all TypeScript files in `functions/src` to JavaScript
2. Removed TypeScript dependencies
3. Updated `functions/package.json` to use JavaScript files directly
4. Simplified deployment scripts

## Project Structure

```
/geobit/
├── public/                   # Static assets
├── src/
│   ├── pages/                # Next.js pages
│   │   ├── api/              # API routes
│   │   │   ├── newsletter/   # Newsletter endpoints
│   │   │   └── admin/        # Admin endpoints (protected)
│   │   ├── _app.js           # App container
│   │   ├── index.js          # Landing page
│   │   ├── subscribe.js      # Subscription page
│   │   └── admin/            # Admin pages (protected)
│   ├── components/           # React components
│   ├── lib/                  # Shared libraries
│   ├── styles/               # CSS styles
├── functions/                # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.js          # Main functions entry point
│   │   ├── newsletter/       # Newsletter generation
│   │   ├── admin/            # Admin functions
│   │   └── content/          # Content collection
├── next.config.js            # Next.js config
├── firebase.json             # Firebase config
├── firestore.rules           # Firestore security rules
└── package.json              # Project dependencies
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/szilarddenes/geobit.git
cd geobit
git checkout js-implementation
```

2. Install dependencies
```bash
npm install
cd functions
npm install
cd ..
```

3. Set up environment variables
Create a `.env` file in the root directory with your Firebase and OpenRouter API credentials:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# OpenRouter API
OPENROUTER_API_KEY=your-openrouter-api-key
```

4. Start the development server
```bash
npm run dev
```

5. Deploy to Firebase
```bash
npm run build
firebase deploy
```

## Firebase Functions

This implementation uses Firebase Functions to handle server-side logic:

- **Newsletter Functions**: Generate and send newsletters
- **Admin Functions**: Secure admin operations
- **Content Functions**: Collect and process content from various sources

The functions can be deployed independently:

```bash
cd functions
npm run deploy
```

## License

This project is licensed under the MIT License.
