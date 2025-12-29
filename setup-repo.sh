#!/bin/bash
# Setup script for community-standards repository

set -e

cd community-standards

echo "🔧 Setting up community-standards repository..."

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: 10 seed lists, schema, and templates"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote exists
if git remote | grep -q origin; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo ""
    echo "📝 To create the repository on GitHub:"
    echo ""
    echo "Option 1: Using GitHub CLI (if installed):"
    echo "  gh repo create lksy-org/community-standards --public --source=. --remote=origin --push"
    echo ""
    echo "Option 2: Manual creation:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Repository name: community-standards"
    echo "  3. Owner: lksy-org"
    echo "  4. Make it Public"
    echo "  5. Don't initialize with README"
    echo "  6. Create repository"
    echo "  7. Then run:"
    echo "     git remote add origin https://github.com/lksy-org/community-standards.git"
    echo "     git push -u origin main"
    echo ""
fi

echo ""
echo "✅ Repository setup complete!"
echo "   Once the GitHub repo exists, you can push with:"
echo "   git push -u origin main"


