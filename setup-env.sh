#!/bin/bash
# Interactive setup script for environment variables

set -e

echo "🔧 LKSY Environment Setup"
echo "========================="
echo ""

# Check if .env files already exist
if [ -f "api/.env" ]; then
    echo "⚠️  api/.env already exists. Backing up to api/.env.backup"
    cp api/.env api/.env.backup
fi

if [ -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local already exists. Backing up to frontend/.env.local.backup"
    cp frontend/.env.local frontend/.env.local.backup
fi

if [ -f "mcp-server/.env" ]; then
    echo "⚠️  mcp-server/.env already exists. Backing up to mcp-server/.env.backup"
    cp mcp-server/.env mcp-server/.env.backup
fi

echo ""
echo "Please provide the following information:"
echo ""

# GitHub Token
read -p "GitHub Personal Access Token (with 'repo' scope): " GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token is required"
    exit 1
fi

# GitHub OAuth
read -p "GitHub OAuth Client ID: " GITHUB_CLIENT_ID
read -p "GitHub OAuth Client Secret: " GITHUB_CLIENT_SECRET

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Database password (will be generated when creating DB, but we'll ask for it)
read -p "Database password (or press Enter to generate): " DB_PASSWORD
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    echo "Generated database password: $DB_PASSWORD"
fi

# Project info
PROJECT_ID="visual-validation"
REGION="us-central1"
CONNECTION_NAME="$PROJECT_ID:$REGION:lksy-db"

# Create API .env
echo "Creating api/.env..."
cat > api/.env << EOF
DATABASE_URL=postgresql://lksy_user:$DB_PASSWORD@/lksy?host=/cloudsql/$CONNECTION_NAME
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://lksy.org
PORT=3001
NODE_ENV=production
EOF

# Create Frontend .env.local
echo "Creating frontend/.env.local..."
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://api.lksy.org
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF

# Create MCP Server .env
echo "Creating mcp-server/.env..."
cat > mcp-server/.env << EOF
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF

echo ""
echo "✅ Environment files created!"
echo ""
echo "📝 Important information saved:"
echo "   Database Password: $DB_PASSWORD"
echo "   JWT Secret: $JWT_SECRET"
echo ""
echo "⚠️  Save these values securely!"
echo ""
echo "Next steps:"
echo "1. Review the .env files and update if needed"
echo "2. Run ./deploy.sh to deploy to Google Cloud"
echo ""


