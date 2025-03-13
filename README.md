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
npm run deploy
```