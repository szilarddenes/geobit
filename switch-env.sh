#!/bin/bash
# Environment switching script for Geobit project

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Geobit Environment Switcher${NC}"
echo "----------------------------"

if [ "$1" = "prod" ]; then
  echo -e "${RED}Switching to PRODUCTION environment${NC}"
  
  # Copy the production env file if it exists
  if [ -f .env.production ]; then
    cp .env.production .env.local
    echo "✓ Production environment variables copied to .env.local"
  else
    echo "⚠ .env.production file not found. Please create it first."
    exit 1
  fi
  
  # Switch Firebase project if Firebase CLI is installed
  if command -v firebase &> /dev/null; then
    firebase use geobit-959c9
    echo "✓ Firebase project switched to: geobit-959c9 (production)"
  else
    echo "⚠ Firebase CLI not found. Install with: npm install -g firebase-tools"
  fi
  
  echo -e "${GREEN}Production environment activated!${NC}"
  
elif [ "$1" = "dev" ]; then
  echo -e "${BLUE}Switching to DEVELOPMENT environment${NC}"
  
  # Copy the development env file if it exists
  if [ -f .env.development ]; then
    cp .env.development .env.local
    echo "✓ Development environment variables copied to .env.local"
  else
    echo "⚠ .env.development file not found. Please create it first."
    exit 1
  fi
  
  # Switch Firebase project if Firebase CLI is installed
  if command -v firebase &> /dev/null; then
    firebase use geobit-dev
    echo "✓ Firebase project switched to: geobit-dev (development)"
  else
    echo "⚠ Firebase CLI not found. Install with: npm install -g firebase-tools"
  fi
  
  echo -e "${GREEN}Development environment activated!${NC}"
  
else
  echo -e "${RED}Error: Please specify an environment${NC}"
  echo "Usage: ./switch-env.sh [dev|prod]"
  echo "  dev  - Switch to development environment"
  echo "  prod - Switch to production environment"
  exit 1
fi

# Reminder about environment
echo -e "\n${BLUE}Remember:${NC}"
echo "• Restart your development server if it's running"
echo "• Check Firebase project with: firebase use"
echo "• Verify environment with: grep -v '^#' .env.local"
