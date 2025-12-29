# Infrastructure Setup

This directory contains Terraform configuration for Google Cloud Platform resources.

## Prerequisites

1. Install Terraform
2. Authenticate with GCP: `gcloud auth application-default login`
3. Set project: `gcloud config set project visual-validation`
4. Enable required APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable compute.googleapis.com
   ```

## Setup

1. Create `terraform.tfvars`:
   ```hcl
   db_password  = "your-secure-password"
   github_token = "your-github-token"
   jwt_secret   = "your-jwt-secret"
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Plan changes:
   ```bash
   terraform plan
   ```

4. Apply:
   ```bash
   terraform apply
   ```

## Resources Created

- Cloud SQL PostgreSQL instance
- Cloud Run services (frontend, API, MCP server)
- Cloud Build triggers
- VPC network for private database access
- IAM roles and permissions

## Domain Configuration

After infrastructure is created, configure lksy.org domain:

```bash
gcloud run domain-mappings create \
  --service lksy-frontend \
  --domain lksy.org \
  --region us-central1
```

Then update DNS records as instructed by the command output.


