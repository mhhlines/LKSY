# Deployment Checklist

## ✅ Completed

- [x] Environment files created (`api/.env`, `frontend/.env.local`, `mcp-server/.env`)
- [x] GitHub Personal Access Token configured
- [x] GitHub OAuth App credentials configured
- [x] JWT Secret generated
- [x] Community standards data prepared (10 seed lists)

## ⏳ Before Deployment

### 1. Create Community Standards Repository

The `community-standards` folder needs to be pushed to GitHub as a separate repository.

**Quick Setup:**

1. Go to: https://github.com/new
2. Repository name: `community-standards`
3. Owner: `lksy-org` (or your organization)
4. Make it **Public**
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

**Then push the data:**

```bash
cd community-standards
git init
git add .
git commit -m "Initial commit: 10 seed lists, schema, and templates"
git branch -M main
git remote add origin https://github.com/lksy-org/community-standards.git
git push -u origin main
```

**Note:** If you don't have `lksy-org` organization, you can:
- Create it on GitHub first, OR
- Use your personal account and update `GITHUB_OWNER` in the .env files

### 2. Verify Google Cloud Setup

```bash
# Check authentication
gcloud auth list

# Verify project
gcloud config get-value project
# Should output: visual-validation

# If not set:
gcloud config set project visual-validation
```

## 🚀 Deploy

Once the repository exists and GCP is configured:

```bash
./deploy.sh
```

This will:
1. Enable required GCP APIs
2. Create Cloud SQL database (generates password)
3. Build Docker images
4. Deploy to Cloud Run

**After deployment**, you'll need to:
1. Update `api/.env` with the database password (shown in deploy output)
2. Redeploy the API service with the updated .env

## 📝 Post-Deployment

1. **Configure domain:**
   ```bash
   gcloud run domain-mappings create \
     --service lksy-frontend \
     --domain lksy.org \
     --region us-central1
   ```

2. **Update DNS** as instructed

3. **Run database migrations:**
   ```bash
   # Connect to Cloud SQL
   gcloud sql connect lksy-db --user=lksy_user --database=lksy
   
   # Then run the SQL from api/src/db/schema.sql
   ```

4. **Test the site:**
   - Frontend: https://lksy.org (after DNS)
   - API: https://api.lksy.org/api/v1/stats

## 🆘 Troubleshooting

- **"Repository not found"**: Make sure community-standards repo exists and is public
- **"Permission denied"**: Check gcloud authentication
- **"Project not found"**: Verify project ID is correct
- **Database connection errors**: Wait a few minutes after database creation, then update .env


