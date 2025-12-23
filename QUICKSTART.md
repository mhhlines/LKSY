# Quick Start Guide

Get lksy.org up and running in 5 steps!

## Step 1: Get GitHub Credentials

You need two things from GitHub:

### A. Personal Access Token
1. Visit: https://github.com/settings/tokens/new
2. Name: "LKSY Platform"
3. Select scopes:
   - ✅ **`repo`** (Full control of private repositories)
     - This includes: read/write access to code, create branches, create PRs, add labels
     - Works for both public and private repositories
     - Required for: fetching lists, creating proposal PRs, version management
4. Generate and **copy the token**

### B. OAuth App
1. Visit: https://github.com/settings/developers/apps/new
2. Application name: `lksy.org`
3. Homepage URL: `https://lksy.org`
4. Callback URL: `https://lksy.org/api/auth/callback`
5. Register and **copy Client ID and Secret**
   
   **Note:** The OAuth app will request `user:email` scope when users authenticate (this is handled automatically in the code - no additional setup needed)

## Step 2: Set Up Environment Variables

Run the interactive setup:

```bash
./setup-env.sh
```

Enter your GitHub credentials when prompted.

## Step 3: Create Community Standards Repository

```bash
# Option 1: If you have GitHub CLI
gh repo create lksy-org/community-standards --public

# Option 2: Create on GitHub.com, then:
cd community-standards
git init
git add .
git commit -m "Initial commit: 10 seed lists"
git branch -M main
git remote add origin https://github.com/lksy-org/community-standards.git
git push -u origin main
```

## Step 4: Verify Google Cloud

```bash
# Authenticate (if not already)
gcloud auth login

# Set project
gcloud config set project visual-validation

# Verify
gcloud config get-value project
# Should output: visual-validation
```

## Step 5: Deploy!

```bash
./deploy.sh
```

This will take about 10-15 minutes. The script will:
- ✅ Enable GCP APIs
- ✅ Create database
- ✅ Build Docker images
- ✅ Deploy to Cloud Run

## After Deployment

1. **Get your service URLs:**
   ```bash
   gcloud run services list --region us-central1
   ```

2. **Configure domain:**
   ```bash
   gcloud run domain-mappings create \
     --service lksy-frontend \
     --domain lksy.org \
     --region us-central1
   ```

3. **Update DNS** as instructed by the command output

4. **Run database migrations:**
   ```bash
   # Connect to Cloud SQL
   gcloud sql connect lksy-db --user=lksy_user --database=lksy
   
   # Then run the SQL from api/src/db/schema.sql
   ```

## Visit Your Site!

Once DNS propagates (usually 5-30 minutes):
- **Frontend**: https://lksy.org
- **API**: https://api.lksy.org/api/v1/stats

## Need Help?

- See `SETUP.md` for detailed instructions
- See `DEPLOYMENT.md` for advanced deployment options
- Check GCP Console for logs and monitoring

