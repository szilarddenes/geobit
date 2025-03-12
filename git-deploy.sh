#!/bin/bash

# Step 1: Navigate to the project directory
PROJECT_DIR="$(pwd)"
cd "$PROJECT_DIR" || { echo "Project directory not found! Exiting."; exit 1; }

# Step 2: Check for changed files
CHANGED_FILES=$(git status --porcelain | wc -l)
CHANGED_FILES_SUMMARY=$(git status --porcelain | awk '{print $2}' | head -5 | tr '\n' ' ')
if [ "$CHANGED_FILES" -gt 5 ]; then
    CHANGED_FILES_SUMMARY="$CHANGED_FILES_SUMMARY... (+$(($CHANGED_FILES - 5)) more)"
fi

if [ "$CHANGED_FILES" -eq 0 ]; then
    echo "No changes detected since the last push."
    read -p "Do you want to force update everything anyway? (y/n): " FORCE_UPDATE
    if [[ "$FORCE_UPDATE" != "y" ]]; then
        echo "Exiting without pushing changes."
        exit 0
    fi
else
    echo "Changes detected: $CHANGED_FILES_SUMMARY"
fi

# Step 3: Commit changes to GitHub with automatic message
AUTOMATIC_MESSAGE="Auto-deployed changes: $(date '+%Y-%m-%d %H:%M:%S') | Files Changed: $CHANGED_FILES | Files: $CHANGED_FILES_SUMMARY"
echo "Adding changes to Git..."
git add .
git commit -m "$AUTOMATIC_MESSAGE"

if [ $? -ne 0 ]; then
    echo "No changes to commit. Exiting."
    exit 0
fi

# Step 4: Pull and push changes
# echo "Pulling remote changes..."
# git pull origin master --rebase
# if [ $? -ne 0 ]; then
#     echo "Pull failed. Resolve conflicts manually. Exiting."
#     exit 1
# fi

echo "Pushing changes to GitHub..."
git push origin master --force
if [ $? -ne 0 ]; then
    echo "Push failed. Exiting."
    exit 1
fi

# Step 5: Completion message
echo "Deployment completed successfully!"
echo "Commit Message: $AUTOMATIC_MESSAGE"