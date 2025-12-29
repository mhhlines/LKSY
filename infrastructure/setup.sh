#!/bin/bash
# Setup script for GCP infrastructure

set -e

PROJECT_ID="visual-validation"
PROJECT_NUMBER="722879364416"

echo "Setting up GCP infrastructure for lksy.org..."

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicenetworking.googleapis.com

# Create service account for Cloud Run
echo "Creating service accounts..."
gcloud iam service-accounts create lksy-cloud-run \
  --display-name="LKSY Cloud Run Service Account" \
  --project=$PROJECT_ID

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:lksy-cloud-run@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Create Cloud SQL instance (this will take several minutes)
echo "Creating Cloud SQL instance..."
gcloud sql instances create lksy-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --no-backup

# Create database
echo "Creating database..."
gcloud sql databases create lksy \
  --instance=lksy-db \
  --project=$PROJECT_ID

# Create database user
echo "Creating database user..."
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create lksy_user \
  --instance=lksy-db \
  --password=$DB_PASSWORD \
  --project=$PROJECT_ID

echo "Database setup complete!"
echo "Database password: $DB_PASSWORD"
echo "Save this password securely!"

# Note: Cloud Run services will be created via Terraform or Cloud Build
echo "Next steps:"
echo "1. Run terraform apply to create Cloud Run services"
echo "2. Configure domain mapping for lksy.org"
echo "3. Set up Cloud Build triggers"


