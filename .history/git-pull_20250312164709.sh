#!/bin/bash

# Set variables
PROJECT_DIR="$(pwd)"
DB_CONTAINER_NAME="db_geohisztor"
DB_USER="solid"
DB_PASSWORD="retekreteK33"
DB_NAME="db_geohisztor"
DB_DUMP_PATH="${PROJECT_DIR}/database/db-dump.sql"
DOCKER_COMPOSE="docker-compose"

# Step 1: Navigate to the project directory
cd "$PROJECT_DIR" || { echo "Project directory not found! Exiting."; exit 1; }

# Step 2: Pull latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git pull origin master || { echo "Failed to pull from GitHub! Exiting."; exit 1; }

# Step 5: Completion
echo "Pull complete!"

# Step 6: Start Svelte Project
echo "Starting NextJS Project..."
next dev
