# GeoBit

A TLDR-style newsletter for geoscientists, providing concise summaries of the latest research, industry news, and developments in earth sciences.

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

## File Structure

```
/geobit/
├── .github/                  # GitHub workflows
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
│   │   ├── firebase.js       # Firebase configuration
│   │   ├── admin.js          # Admin utilities
│   │   └── newsletter.js     # Newsletter utilities
│   ├── styles/               # CSS styles
│   └── utils/                # Utility functions
├── functions/                # Firebase Cloud Functions
│   ├── src/
│   │   ├── newsletter/       # Newsletter generation
│   │   └── admin/            # Admin functions
│   ├── package.json
│   └── index.js              # Functions entry point
├── next.config.js            # Next.js config
├── firebase.json             # Firebase config
├── firestore.rules           # Firestore security rules
└── package.json              # Project dependencies
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

## Implementation Phases

### Phase 1: Newsletter MVP (Current)
- Simple landing page with subscription form
- Admin dashboard with basic content management
- Weekly newsletter with AI-summarized content
- Manual content curation with AI assistance

### Phase 2: Enhanced Newsletter
- Expanded source coverage
- Improved AI summarization quality
- Better categorization and tagging
- Email delivery analytics

### Phase 3: GeoBit Agent (Future)
- AI-powered research assistant
- Document processing capabilities
- Interactive query system
- Integration with newsletter content

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/szilarddenes/geobit.git
cd geobit
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore, Functions, and Hosting
   - Add your Firebase config to `.env.local`

4. Start development server
```bash
npm run dev
```

5. Deploy to Firebase
```bash
npm run build
firebase deploy
```

## Admin Dashboard Access

The admin dashboard is protected by a simple password system:

1. Set the admin password in Firebase environment variables
2. Access the admin dashboard at `/admin`
3. Enter the password to gain access
4. No user accounts required for administration

## Key Development Tasks

1. **Content Collection System**
   - Implement Perplexity-powered web search for geoscience content
   - Set up content storage in Firestore
   - Create content management interface

2. **AI Processing Pipeline**
   - Configure OpenRouter API integration
   - Implement content summarization workflow
   - Build content categorization system

3. **Newsletter Generation**
   - Create newsletter templates
   - Implement content selection algorithm
   - Build newsletter preview system

4. **Email Subscription & Delivery**
   - Implement subscriber management
   - Set up email service integration
   - Create analytics tracking