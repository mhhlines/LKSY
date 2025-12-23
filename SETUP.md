# Setup Guide for lksy.org

This guide will help you set up the LKSY Community Standards Platform.

## Prerequisites Checklist

- [ ] Google Cloud SDK installed (`gcloud`)
- [ ] Authenticated with Google Cloud (`gcloud auth login`)
- [ ] Project set to `visual-validation` (`gcloud config set project visual-validation`)
- [ ] GitHub account with access to create repositories
- [ ] GitHub Personal Access Token (with `repo` scope)
- [ ] GitHub OAuth App created (for user authentication)

## Step 1: Get GitHub Credentials

### Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" > "Generate new token (classic)"
3. Name it: "LKSY Platform"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: lksy.org
   - **Homepage URL**: `https://lksy.org`
   - **Authorization callback URL**: `https://lksy.org/api/auth/callback`
4. Click "Register application"
5. **Copy the Client ID and Client Secret**

## Step 2: Set Up Environment Variables

Run the interactive setup script:

```bash
./setup-env.sh
```

This will prompt you for:
- GitHub Personal Access Token
- GitHub OAuth Client ID
- GitHub OAuth Client Secret
- Database password (or it will generate one)

Or create the files manually:

### api/.env
```bash
DATABASE_URL=postgresql://lksy_user:PASSWORD@/lksy?host=/cloudsql/visual-validation:us-central1:lksy-db
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=https://lksy.org
PORT=3001
NODE_ENV=production
```

### frontend/.env.local
```bash
NEXT_PUBLIC_API_URL=https://api.lksy.org
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
```

### mcp-server/.env
```bash
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
```

## Step 3: Create Community Standards Repository

You need to create a GitHub repository for the community standards data:

### Option A: Using GitHub CLI (if installed)
```bash
gh repo create lksy-org/community-standards --public --source=community-standards --remote=origin --push
```

### Option B: Manual Creation
1. Go to https://github.com/new
2. Repository name: `community-standards`
3. Owner: `lksy-org` (or your organization)
4. Make it **Public**
5. Don't initialize with README
6. Click "Create repository"

Then push the community-standards folder:
```bash
cd community-standards
git init
git add .
git commit -m "Initial commit: 10 seed lists and schema"
git branch -M main
git remote add origin https://github.com/lksy-org/community-standards.git
git push -u origin main
```

## Step 4: Verify Google Cloud Setup

```bash
# Check authentication
gcloud auth list

# Check project
gcloud config get-value project

# Should output: visual-validation

# If not, set it:
gcloud config set project visual-validation
```

## Step 5: Deploy

Once everything is set up, run:

```bash
./deploy.sh
```

This will:
1. Enable required GCP APIs
2. Create Cloud SQL database
3. Build Docker images
4. Deploy to Cloud Run

## Step 6: Configure Domain

After deployment, map your domain:

```bash
gcloud run domain-mappings create \
  --service lksy-frontend \
  --domain lksy.org \
  --region us-central1
```

Follow the instructions to update your DNS records.

## Troubleshooting

### "gcloud: command not found"
Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install

### "Permission denied" errors
Make sure you're authenticated: `gcloud auth login`

### "Project not found"
Verify project exists: `gcloud projects list`
Set project: `gcloud config set project visual-validation`

### Database connection issues
- Wait a few minutes after creating the database
- Verify the connection name format
- Check that Cloud SQL instance is running

## Next Steps After Deployment

1. Run database migrations (see DEPLOYMENT.md)
2. Test the API: `curl https://api.lksy.org/api/v1/stats`
3. Visit the frontend: `https://lksy.org`
4. Set up monitoring in GCP Console

