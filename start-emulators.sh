#!/bin/bash
# Start Firebase emulators for local development

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}GeoBit Firebase Emulators${NC}"
echo "----------------------------"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo -e "${RED}Firebase CLI not found. Installing...${NC}"
  npm install -g firebase-tools
fi

# Check if .env.development exists with emulator flag
if [ ! -f .env.development ]; then
  echo -e "${RED}Warning: .env.development file not found.${NC}"
  echo "Make sure you have a .env.development file with NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true"
fi

# Start emulators
echo -e "${GREEN}Starting Firebase emulators...${NC}"
echo "This will create a local version of Firestore, Functions, and Auth"
echo "Any data you add will be stored locally and not affect production"
echo ""
echo -e "${BLUE}Remember:${NC}"
echo "1. Run your Next.js app with: npm run dev"
echo "2. Access emulator UI at: http://localhost:4000"
echo ""

# Start the emulators
firebase emulators:start