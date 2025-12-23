# Manual Environment File Setup

Since .env files are protected, create them manually with these exact contents:

## 1. Create `api/.env`

```bash
cat > api/.env << 'EOF'
DATABASE_URL=postgresql://lksy_user:PLACEHOLDER_PASSWORD@/lksy?host=/cloudsql/visual-validation:us-central1:lksy-db
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=mhhlines
GITHUB_REPO=LKSY
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=IRmTC5AGEB8BbzA239/MOla6r3hPPLF+cPmEz89SOXI=
FRONTEND_URL=https://lksy.org
PORT=3001
NODE_ENV=production
EOF
```

## 2. Create `frontend/.env.local`

```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.lksy.org
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF
```

## 3. Create `mcp-server/.env`

```bash
cat > mcp-server/.env << 'EOF'
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=mhhlines
GITHUB_REPO=LKSY
EOF
```

## What's Configured

✅ GitHub Personal Access Token  
✅ GitHub OAuth Client ID  
✅ GitHub OAuth Client Secret  
✅ JWT Secret  

## What's Still Needed

⏳ **DATABASE_URL** - Will be generated during `./deploy.sh`  
   - The database password will be created automatically
   - You'll need to update `api/.env` with the actual password after deployment

## Next Steps

1. Create the environment files using the commands above
2. Create the `community-standards` GitHub repository (see QUICKSTART.md Step 3)
3. Run `./deploy.sh` to deploy to Google Cloud
4. After deployment, update `api/.env` with the database password from the deploy output

