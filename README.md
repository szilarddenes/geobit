# GeoBit

A TLDR-style newsletter for geoscientists, providing concise summaries of the latest research, industry news, and developments in earth sciences.

## Project Overview

GeoBit aggregates content from multiple geoscience sources, uses AI to generate concise summaries, and delivers regular digests to subscribers via email.

## Tech Stack

- **Frontend**: Next.js web application
- **Backend**: Firebase (Firestore, Cloud Functions, Hosting)
- **AI Processing**: OpenRouter API (access to AI models for summarization)
- **Web Search**: Perplexity for content collection
- **Email Delivery**: SendGrid/Mailchimp

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and update with your Firebase credentials

## Development

```
npm run dev
```

## Development with Firebase Emulators

```
# Start Firebase emulators
npm run emulators

# Start Next.js with emulator configuration
npm run dev:emu
```

## Production Build

```
npm run build
npm run start
```

## Deployment

```
npm run deploy
```
