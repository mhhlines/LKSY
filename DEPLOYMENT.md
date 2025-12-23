# Deployment Guide for lksy.org

This guide will walk you through deploying the LKSY Community Standards Platform to Google Cloud.

## Prerequisites

1. **Google Cloud SDK installed and authenticated:**
   ```bash
   gcloud auth login
   gcloud config set project visual-validation
   ```

2. **Enable required APIs:**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable compute.googleapis.com
   gcloud services enable servicenetworking.googleapis.com
   ```

3. **GitHub Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Create a token with `repo` scope
   - Save it for environment variables

4. **GitHub OAuth App (for authentication):**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Homepage URL: `https://lksy.org`
   - Authorization callback URL: `https://lksy.org/api/auth/callback`
   - Save Client ID and Client Secret

## Step 1: Set Up Environment Variables

Create environment variable files:

### Frontend (.env.local)
```bash
cd frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.lksy.org
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF
```

### API (.env)
```bash
cd api
cat > .env << EOF
DATABASE_URL=postgresql://lksy_user:PASSWORD@/lksy?host=/cloudsql/PROJECT_ID:us-central1:lksy-db
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=https://lksy.org
PORT=3001
NODE_ENV=production
EOF
```

### MCP Server (.env)
```bash
cd mcp-server
cat > .env << EOF
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
EOF
```

## Step 2: Set Up Cloud SQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create lksy-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --project=visual-validation

# Create database
gcloud sql databases create lksy \
  --instance=lksy-db \
  --project=visual-validation

# Create database user
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create lksy_user \
  --instance=lksy-db \
  --password=$DB_PASSWORD \
  --project=visual-validation

echo "Database password: $DB_PASSWORD"
echo "Save this password!"
```

**Update API .env with the actual DATABASE_URL:**
```bash
# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe lksy-db --format='value(connectionName)')
# Update .env file with: DATABASE_URL=postgresql://lksy_user:$DB_PASSWORD@/lksy?host=/cloudsql/$CONNECTION_NAME
```

## Step 3: Create GitHub Repository for Community Standards

You'll need to create a separate repository for the community standards data:

```bash
# Option 1: Create via GitHub CLI (if installed)
gh repo create lksy-org/community-standards --public

# Option 2: Create manually on GitHub.com
# Then push the community-standards folder:
cd community-standards
git init
git add .
git commit -m "Initial commit: 10 seed lists"
git remote add origin https://github.com/lksy-org/community-standards.git
git push -u origin main
```

## Step 4: Build and Push Docker Images

```bash
# Build frontend
cd frontend
gcloud builds submit --tag gcr.io/visual-validation/lksy-frontend

# Build API
cd ../api
gcloud builds submit --tag gcr.io/visual-validation/lksy-api

# Build MCP Server
cd ../mcp-server
gcloud builds submit --tag gcr.io/visual-validation/lksy-mcp-server
```

## Step 5: Deploy to Cloud Run

### Deploy Frontend
```bash
gcloud run deploy lksy-frontend \
  --image gcr.io/visual-validation/lksy-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://api.lksy.org,GITHUB_OWNER=lksy-org,GITHUB_REPO=community-standards" \
  --project visual-validation
```

### Deploy API
```bash
gcloud run deploy lksy-api \
  --image gcr.io/visual-validation/lksy-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars-from-file .env \
  --add-cloudsql-instances=visual-validation:us-central1:lksy-db \
  --project visual-validation
```

### Deploy MCP Server
```bash
gcloud run deploy lksy-mcp-server \
  --image gcr.io/visual-validation/lksy-mcp-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars-from-file .env \
  --project visual-validation
```

## Step 6: Configure Custom Domain

```bash
# Map lksy.org to frontend
gcloud run domain-mappings create \
  --service lksy-frontend \
  --domain lksy.org \
  --region us-central1 \
  --project visual-validation

# Map api.lksy.org to API
gcloud run domain-mappings create \
  --service lksy-api \
  --domain api.lksy.org \
  --region us-central1 \
  --project visual-validation
```

**Update DNS records** as instructed by the command output.

## Step 7: Run Database Migrations

```bash
# Connect to Cloud SQL and run migrations
gcloud sql connect lksy-db --user=lksy_user --database=lksy

# Or use Cloud Run job to run migrations
gcloud run jobs create lksy-migrate \
  --image gcr.io/visual-validation/lksy-api \
  --region us-central1 \
  --command="npm" \
  --args="run,migrate" \
  --set-env-vars-from-file api/.env \
  --add-cloudsql-instances=visual-validation:us-central1:lksy-db

gcloud run jobs execute lksy-migrate --region us-central1
```

## Step 8: Set Up Cloud Build Triggers (Optional)

For automatic deployments on git push:

```bash
# Frontend trigger
gcloud builds triggers create github \
  --name="lksy-frontend-deploy" \
  --repo-name="LKSY" \
  --repo-owner="mhhlines" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --substitutions="_SERVICE_NAME=lksy-frontend,_IMAGE_NAME=gcr.io/visual-validation/lksy-frontend"

# API trigger
gcloud builds triggers create github \
  --name="lksy-api-deploy" \
  --repo-name="LKSY" \
  --repo-owner="mhhlines" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --substitutions="_SERVICE_NAME=lksy-api,_IMAGE_NAME=gcr.io/visual-validation/lksy-api"
```

## Verification

1. Check service URLs:
   ```bash
   gcloud run services list --region us-central1
   ```

2. Test frontend:
   ```bash
   curl https://lksy.org
   ```

3. Test API:
   ```bash
   curl https://api.lksy.org/api/v1/stats
   ```

## Troubleshooting

- **Database connection issues**: Ensure Cloud SQL instance is running and connection name is correct
- **Build failures**: Check Cloud Build logs in GCP Console
- **Deployment errors**: Check Cloud Run logs
- **CORS errors**: Verify FRONTEND_URL matches actual frontend URL

## Next Steps

1. Set up monitoring and alerts in GCP Console
2. Configure backup strategy for Cloud SQL
3. Set up CI/CD pipelines
4. Configure custom domain SSL certificates (automatic with Cloud Run)

