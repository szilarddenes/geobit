#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   GeoBit - Deployment Script   ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo -e "${RED}Firebase CLI is not installed. Please install it with 'npm install -g firebase-tools'${NC}"
  exit 1
fi

# Check if logged in to Firebase
echo -e "${YELLOW}Checking Firebase login status...${NC}"
firebase login:list &> /dev/null
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Please log in to Firebase:${NC}"
  firebase login
fi

# Get Firebase project ID
echo -e "${YELLOW}Checking Firebase project...${NC}"
PROJECT_ID=$(firebase projects:list --json | grep "\"name\": \"geobit" | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}No GeoBit project found. Please create one or select an existing project:${NC}"
  firebase projects:list
  echo -e "${YELLOW}Enter the project ID to use:${NC}"
  read PROJECT_ID
  
  if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}No project selected. Exiting.${NC}"
    exit 1
  fi
  
  firebase use --add "$PROJECT_ID"
else
  echo -e "${GREEN}Using Firebase project: $PROJECT_ID${NC}"
  firebase use "$PROJECT_ID"
fi

# Ask for environment variables
echo -e "${YELLOW}Do you want to configure environment variables? (y/n)${NC}"
read CONFIGURE_ENV

if [ "$CONFIGURE_ENV" = "y" ] || [ "$CONFIGURE_ENV" = "Y" ]; then
  echo -e "${YELLOW}Enter your OpenRouter API key:${NC}"
  read -s OPENROUTER_API_KEY
  
  echo -e "${YELLOW}Enter your admin password:${NC}"
  read -s ADMIN_PASSWORD
  
  echo -e "${YELLOW}Enter your SendGrid API key (or leave empty):${NC}"
  read -s SENDGRID_API_KEY
  
  # Set Firebase configuration
  echo -e "${YELLOW}Setting Firebase configuration...${NC}"
  firebase functions:config:set app.admin_token="$ADMIN_PASSWORD" openrouter.api_key="$OPENROUTER_API_KEY"
  
  if [ -n "$SENDGRID_API_KEY" ]; then
    firebase functions:config:set sendgrid.api_key="$SENDGRID_API_KEY"
  fi
fi

# Build the Next.js app
echo -e "${YELLOW}Building Next.js application...${NC}"
npm run build

# Build Firebase functions
echo -e "${YELLOW}Building Firebase functions...${NC}"
cd functions && npm run build && cd ..

# Deploy
echo -e "${YELLOW}Deploying to Firebase...${NC}"
firebase deploy

if [ $? -eq 0 ]; then
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}   Deployment Successful!   ${NC}"
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${BLUE}Your GeoBit application is now live at:${NC}"
  echo -e "${BLUE}https://$PROJECT_ID.web.app${NC}"
  echo -e "${GREEN}=========================================${NC}"
else
  echo -e "${RED}=========================================${NC}"
  echo -e "${RED}   Deployment Failed   ${NC}"
  echo -e "${RED}Please check the error messages above.${NC}"
  echo -e "${RED}=========================================${NC}"
fi