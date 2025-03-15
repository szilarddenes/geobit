#!/bin/bash

# Script to set up git-secrets for preventing accidental API key commits
echo "🔒 Setting up git-secrets to protect against accidental API key commits..."

# Create tools directory if it doesn't exist
if [ ! -d "./tools" ]; then
    echo "Creating tools directory..."
    mkdir -p ./tools
fi

# Download git-secrets script if it doesn't exist
if [ ! -f "./tools/git-secrets" ]; then
    echo "Downloading git-secrets..."
    curl -Lo ./tools/git-secrets https://raw.githubusercontent.com/awslabs/git-secrets/master/git-secrets
    chmod +x ./tools/git-secrets
    echo "✅ git-secrets installed to ./tools/git-secrets"
else
    echo "✅ git-secrets already installed"
fi

# Register AWS patterns (includes common key formats)
echo "Registering AWS patterns..."
./tools/git-secrets --register-aws
echo "✅ AWS patterns registered"

# Add patterns for Google/Firebase API keys
echo "Adding pattern for Google API keys..."
./tools/git-secrets --add 'AIza[0-9A-Za-z\-_]{35}'
echo "✅ Google API key pattern added"

# Add patterns for OpenAI API keys
echo "Adding pattern for OpenAI API keys..."
./tools/git-secrets --add 'sk-[a-zA-Z0-9]{48}'
echo "✅ OpenAI API key pattern added"

# Add patterns for OpenRouter API keys
echo "Adding pattern for OpenRouter API keys..."
./tools/git-secrets --add 'sk-or-v1-[a-zA-Z0-9]{48}'
echo "✅ OpenRouter API key pattern added"

# Add patterns for generic API keys
echo "Adding patterns for generic API keys..."
./tools/git-secrets --add '[a-zA-Z0-9_]{32}'
echo "✅ Generic API key pattern added"

# Install git hooks
echo "Installing git hooks..."
./tools/git-secrets --install
echo "✅ Git hooks installed"

# Update git hooks with the correct path
echo "Updating git hooks with the correct path..."
PROJECT_DIR=$(pwd)
for hook in .git/hooks/pre-commit .git/hooks/commit-msg .git/hooks/prepare-commit-msg; do
    if [ -f "$hook" ]; then
        sed -i.bak "s|git secrets|$PROJECT_DIR/tools/git-secrets|g" "$hook" && rm -f "$hook.bak"
        echo "  ✅ Updated $hook with correct path"
    fi
done

# Add documentation files to allowed patterns
echo "Adding allowed patterns for documentation files..."
if [ -f ".gitallowed" ]; then
    echo "  ✅ .gitallowed file already exists"
else
    cat > .gitallowed << 'EOL'
# Allow documentation files to mention API keys for instructional purposes
CLEANUP-INSTRUCTIONS.md:.*AIzaSyDvpreQ684CJaRl0dfbhR9i_IDKz58JfMk.*
CLEANUP-INSTRUCTIONS.md:.*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.*
SECURITY-IMPROVEMENTS.md:.*AIza\[0-9A-Za-z\\-_\]\{35\}.*
SECURITY-IMPROVEMENTS.md:.*sk-\[a-zA-Z0-9\]\{48\}.*
SECURITY-IMPROVEMENTS.md:.*sk-or-v1-\[a-zA-Z0-9\]\{48\}.*

# Add this line to any future documentation files that need to mention API keys
# FUTURE-DOCUMENTATION.md:.*API_KEY_PATTERN.* 
EOL
    echo "  ✅ Created .gitallowed file"
fi

# Add the specific allowed patterns from .gitallowed
./tools/git-secrets --add --allowed "AIzaSyDvpreQ684CJaRl0dfbhR9i_IDKz58JfMk"
./tools/git-secrets --add --allowed "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"
echo "✅ Documentation patterns added to allowed list"

echo ""
echo "🎉 git-secrets setup complete!"
echo ""
echo "This will now scan for API keys and secrets in the following file types:"
echo "  - All text files (.txt, .md, .json, etc.)"
echo "  - Source code files (.js, .jsx, .ts, .tsx, .py, etc.)"
echo "  - Configuration files (.env, .yml, .yaml, etc.)"
echo ""
echo "To scan your repository now, run:"
echo "  ./tools/git-secrets --scan"
echo ""
echo "To bypass the check for a specific commit (USE WITH CAUTION):"
echo "  git commit --no-verify -m \"Your commit message\""
echo ""
echo "You can also use the git-deploy.sh script which has built-in scanning:"
echo "  ./git-deploy.sh          # Normal deploy with security checks"
echo "  ./git-deploy.sh --no-verify   # Skip security checks (use carefully!)"
echo "" 