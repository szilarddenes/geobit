# GeoBit

A TLDR-style newsletter for geoscientists, providing concise summaries of the latest research, industry news, and developments in earth sciences.

> **Note:** This project has been converted to a pure JavaScript implementation. TypeScript has been removed for easier deployment and maintenance. See [README-JS.md](README-JS.md) for more details.

## Project Overview

GeoBit aggregates content from multiple geoscience sources, uses AI to generate concise summaries, and delivers regular digests to subscribers via email. The project follows a phased approach, starting with the newsletter system and later adding an AI research assistant (GeoBit Agent).

## News Collection and Processing

GeoBit utilizes Perplexity to actively search and collect the latest news from various reliable geoscience sources on the web. The AI system handles:

- Web searching for relevant geoscience content using Perplexity
- Filtering and selecting content from reliable scientific sources
- Generating concise TLDR-style summaries
- Categorizing content by topic and relevance
- Automating the newsletter content pipeline

This approach ensures fresh, high-quality content without needing direct API access to each news source.

## Tech Stack

- **Frontend**: Next.js web application
- **Backend**: Firebase (Firestore, Cloud Functions, Hosting)
- **AI Processing**: OpenRouter API (access to AI models for summarization)
- **Web Search**: Perplexity for content collection
- **Email Delivery**: SendGrid/Mailchimp

## System Architecture

```
┌───────────────────────────────────────┐
│                                     │
│            NEXT.JS FRONTEND         │
│                                     │
│  ┌───────────────┐    ┌───────────┐  │
│  │             │    │            │  │
│  │  Public     │    │  Admin     │  │
│  │  Pages      │    │  Dashboard │  │
│  │             │    │            │  │
│  └───────┬─────┘    └────────┬───┘  │
│         │                 │         │
└─────────┼─────────────────┼─────────┘
          │                 │          
┌─────────┼─────────────────┼─────────┐
│         │                 │         │
│         ▼                 ▼         │
│  ┌───────────────┐    ┌───────────┐  │
│  │             │    │            │  │
│  │  Public     │    │  Admin     │  │
│  │  API        │    │  API       │  │
│  │             │    │            │  │
│  └───────┬─────┘    └────────┬───┘  │
│         │                 │         │
│  FIREBASE FUNCTIONS & FIRESTORE     │
│                                     │
└─────────┬─────────────────┬─────────┘
          │                 │          
          ▼                 ▼          
┌──────────────┐      ┌──────────────┐
│              │      │                │
│ Content      │      │ Newsletter     │
│ Processing   │──────│ Generation     │
│              │      │                │
└──────┬───────┘      └────────┬──────┘
       │                        │        
       │                        │        
       ▼                        ▼        
┌──────────────┐      ┌──────────────┐
│              │      │                │
│ AI           │      │ Email          │
│ Summarization│      │ Delivery       │
│              │      │                │
└──────────────┘      └────────────────┘
```

## Features

### Public Features
- **Newsletter Subscription**: Simple email subscription form
- **Newsletter Archives**: Public access to past newsletters
- **Content Categories**: Browse content by geoscience category

### Admin Features (Hidden Dashboard)
- **Content Management**: Add, edit, review content sources
- **Newsletter Builder**: Create and preview newsletters
- **Subscriber Management**: View and manage subscriber list
- **Analytics**: Track newsletter performance metrics

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/szilarddenes/geobit.git
cd geobit
```

2. Install dependencies
```bash
npm install
cd functions
npm install
cd ..
```

3. Configure Environment
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Set up two projects: one for development (`geobit-dev`) and one for production (`geobit-959c9`)
   - Enable Firestore, Functions, Authentication, and Hosting in each project
   - Copy `.env.example` to `.env.development` and `.env.production`
   - Fill in your Firebase config values and API keys in each env file

4. Switch Between Environments
```bash
# For development
./switch-env.sh dev

# For production
./switch-env.sh prod
```

5. Start development server
```bash
npm run dev
```

6. Deploy to Firebase
```bash
# Deploy to development
git checkout develop
npm run deploy

# Deploy to production
git checkout master
npm run deploy
```

## Environment Management

The project is set up with separate development and production environments:

- **Development**: `geobit-dev` Firebase project, stored in `.env.development`
- **Production**: `geobit-959c9` Firebase project, stored in `.env.production`

GitHub Actions handle automated deployments:
- Pushes to `master` branch deploy to production
- Pushes to `develop` branch deploy to development
- Pull requests create preview deployments

## Admin Access

The admin dashboard is protected with Firebase Authentication:

1. Sign up as a normal user
2. In Firebase Console, add a custom claim or role to your user:
```javascript
// In Firebase Auth console or Functions
{
  "role": "admin"
}
```
3. Access the admin dashboard at `/admin`

## API Routes

The application uses Next.js API routes for server-side operations:

### Public API Endpoints
- `/api/newsletter/subscribe` - Subscribe to newsletter
- `/api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `/api/newsletter/latest` - Get latest newsletter

### Admin API Endpoints (Protected)
- `/api/admin/newsletter` - Manage newsletters
- `/api/admin/subscribers` - Manage subscribers
- `/api/admin/articles` - Manage content articles

## License

[MIT](LICENSE)
