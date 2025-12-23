#!/bin/bash
# Deployment script for lksy.org
# Run this script to deploy all services to Google Cloud

set -e

PROJECT_ID="visual-validation"
PROJECT_NUMBER="722879364416"
REGION="us-central1"

echo "🚀 Starting deployment of lksy.org..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with gcloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicenetworking.googleapis.com

# Check if database exists
echo "🗄️  Checking database..."
if ! gcloud sql instances describe lksy-db --project=$PROJECT_ID &> /dev/null; then
    echo "Creating Cloud SQL instance..."
    gcloud sql instances create lksy-db \
      --database-version=POSTGRES_15 \
      --tier=db-f1-micro \
      --region=$REGION \
      --project=$PROJECT_ID
    
    echo "Creating database..."
    gcloud sql databases create lksy \
      --instance=lksy-db \
      --project=$PROJECT_ID
    
    DB_PASSWORD=$(openssl rand -base64 32)
    echo "Creating database user..."
    gcloud sql users create lksy_user \
      --instance=lksy-db \
      --password=$DB_PASSWORD \
      --project=$PROJECT_ID
    
    echo "✅ Database created!"
    echo "⚠️  IMPORTANT: Save this database password: $DB_PASSWORD"
    echo "Update api/.env with: DATABASE_URL=postgresql://lksy_user:$DB_PASSWORD@/lksy?host=/cloudsql/$PROJECT_ID:$REGION:lksy-db"
else
    echo "✅ Database already exists"
fi

# Build and deploy services
echo "🏗️  Building Docker images..."

# Frontend
echo "Building frontend..."
cd frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/lksy-frontend --project=$PROJECT_ID || {
    echo "❌ Frontend build failed. Make sure you have Docker installed and Cloud Build API enabled."
    exit 1
}

# API
echo "Building API..."
cd ../api
gcloud builds submit --tag gcr.io/$PROJECT_ID/lksy-api --project=$PROJECT_ID || {
    echo "❌ API build failed."
    exit 1
}

# MCP Server
echo "Building MCP server..."
cd ../mcp-server
gcloud builds submit --tag gcr.io/$PROJECT_ID/lksy-mcp-server --project=$PROJECT_ID || {
    echo "❌ MCP server build failed."
    exit 1
}

cd ..

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."

# Get connection name
CONNECTION_NAME="$PROJECT_ID:$REGION:lksy-db"

# Deploy Frontend
echo "Deploying frontend..."
gcloud run deploy lksy-frontend \
  --image gcr.io/$PROJECT_ID/lksy-frontend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://api.lksy.org,GITHUB_OWNER=lksy-org,GITHUB_REPO=community-standards" \
  --project $PROJECT_ID \
  --quiet || echo "⚠️  Frontend deployment had issues. Check logs."

# Deploy API
echo "Deploying API..."
if [ -f "api/.env" ]; then
    gcloud run deploy lksy-api \
      --image gcr.io/$PROJECT_ID/lksy-api \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated \
      --set-env-vars-from-file api/.env \
      --add-cloudsql-instances=$CONNECTION_NAME \
      --project $PROJECT_ID \
      --quiet || echo "⚠️  API deployment had issues. Check logs."
else
    echo "⚠️  Warning: api/.env not found. Create it with required environment variables."
    echo "Deploying API without env vars (will need to update manually)..."
    gcloud run deploy lksy-api \
      --image gcr.io/$PROJECT_ID/lksy-api \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated \
      --add-cloudsql-instances=$CONNECTION_NAME \
      --project $PROJECT_ID \
      --quiet || echo "⚠️  API deployment had issues. Check logs."
fi

# Deploy MCP Server
echo "Deploying MCP server..."
if [ -f "mcp-server/.env" ]; then
    gcloud run deploy lksy-mcp-server \
      --image gcr.io/$PROJECT_ID/lksy-mcp-server \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated \
      --set-env-vars-from-file mcp-server/.env \
      --project $PROJECT_ID \
      --quiet || echo "⚠️  MCP server deployment had issues. Check logs."
else
    echo "⚠️  Warning: mcp-server/.env not found. Deploying without env vars..."
    gcloud run deploy lksy-mcp-server \
      --image gcr.io/$PROJECT_ID/lksy-mcp-server \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated \
      --project $PROJECT_ID \
      --quiet || echo "⚠️  MCP server deployment had issues. Check logs."
fi

# Get service URLs
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Service URLs:"
gcloud run services list --region $REGION --project $PROJECT_ID --format="table(metadata.name,status.url)"

echo ""
echo "📝 Next steps:"
echo "1. Configure custom domain: gcloud run domain-mappings create --service lksy-frontend --domain lksy.org --region $REGION"
echo "2. Run database migrations: See DEPLOYMENT.md Step 7"
echo "3. Update DNS records as instructed by domain mapping command"
echo "4. Set up environment variables in Cloud Run console if needed"

