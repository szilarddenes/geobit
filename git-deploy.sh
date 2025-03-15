#!/bin/bash

# Step 1: Navigate to the project directory
PROJECT_DIR="$(pwd)"
cd "$PROJECT_DIR" || { echo "Project directory not found! Exiting."; exit 1; }

# Optional: Check for --no-verify flag to skip git hooks
SKIP_HOOKS=""
if [[ "$1" == "--no-verify" ]]; then
    SKIP_HOOKS="--no-verify"
    echo "⚠️  Warning: Running with --no-verify, git hook checks will be skipped!"
fi

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

# Step 3: Manually run git-secrets if it exists and we're not skipping hooks
if [[ -z "$SKIP_HOOKS" && -f "./tools/git-secrets" ]]; then
    echo "Running security scan for API keys..."
    
    # Create a temporary list of files to scan (excluding documentation and .history)
    # This ensures we only scan files that will be committed and not documentation about keys
    GIT_STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR)
    GIT_UNSTAGED_FILES=$(git ls-files --modified --others --exclude-standard | grep -v "^\.history/" | grep -v "CLEANUP-INSTRUCTIONS.md" | grep -v "SECURITY-IMPROVEMENTS.md")
    ALL_FILES=$(echo "$GIT_STAGED_FILES $GIT_UNSTAGED_FILES" | tr ' ' '\n' | sort | uniq)
    
    # If there are files to scan, scan them
    if [ -n "$ALL_FILES" ]; then
        SCAN_FAILED=false
        
        while IFS= read -r file; do
            # Skip empty lines
            [ -z "$file" ] && continue
            
            # Skip documentation files about security
            [[ "$file" == "CLEANUP-INSTRUCTIONS.md" || "$file" == "SECURITY-IMPROVEMENTS.md" || "$file" == ".gitallowed" ]] && continue
            
            # Skip .history directory
            [[ "$file" == .history/* ]] && continue
            
            echo "  Scanning: $file"
            ./tools/git-secrets --scan "$file" > /dev/null 2>&1
            
            if [ $? -ne 0 ]; then
                echo "❌ Potential API key detected in: $file"
                SCAN_FAILED=true
            fi
        done <<< "$ALL_FILES"
        
        if [ "$SCAN_FAILED" = true ]; then
            echo "❌ Security scan failed - possible API keys or secrets detected."
            echo "   To bypass this check (only if you're certain no secrets are being committed):"
            echo "   Run: ./git-deploy.sh --no-verify"
            exit 1
        else
            echo "✅ Security scan passed"
        fi
    else
        echo "✅ No files to scan"
    fi
fi

# Step 4: Commit changes to GitHub with automatic message
AUTOMATIC_MESSAGE="Auto-deployed changes: $(date '+%Y-%m-%d %H:%M:%S') | Files Changed: $CHANGED_FILES | Files: $CHANGED_FILES_SUMMARY"
echo "Adding changes to Git..."
git add .
git commit $SKIP_HOOKS -m "$AUTOMATIC_MESSAGE"

if [ $? -ne 0 ]; then
    echo "No changes to commit. Exiting."
    exit 0
fi

# Step 5: Push changes
echo "Pushing changes to GitHub..."
git push origin master --force
if [ $? -ne 0 ]; then
    echo "Push failed. Exiting."
    exit 1
fi

# Step 6: Completion message
echo "Deployment completed successfully!"
echo "Commit Message: $AUTOMATIC_MESSAGE"