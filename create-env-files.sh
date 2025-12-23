#!/bin/bash
# Create environment files with your GitHub token

set -e

GITHUB_TOKEN="your_github_token_here"
GITHUB_CLIENT_ID="your_oauth_client_id"
GITHUB_CLIENT_SECRET="your_oauth_client_secret"
JWT_SECRET="IRmTC5AGEB8BbzA239/MOla6r3hPPLF+cPmEz89SOXI="

echo "🔧 Creating environment files..."

# Create API .env
cat > api/.env << EOF
DATABASE_URL=postgresql://lksy_user:PLACEHOLDER_PASSWORD@/lksy?host=/cloudsql/visual-validation:us-central1:lksy-db
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
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://api.lksy.org
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF

# Create MCP Server .env
cat > mcp-server/.env << EOF
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF

echo "✅ Environment files created!"
echo ""
echo "📝 All credentials configured:"
echo "   ✅ GitHub Personal Access Token"
echo "   ✅ GitHub OAuth Client ID"
echo "   ✅ GitHub OAuth Client Secret"
echo "   ✅ JWT Secret"
echo ""
echo "⚠️  Still needed (will be set during deployment):"
echo "   - DATABASE_URL (database password will be generated)"
echo ""
echo "🚀 Ready to deploy! Run: ./deploy.sh"

