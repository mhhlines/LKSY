# Cloud Run Services

# Frontend Service
resource "google_cloud_run_service" "lksy_frontend" {
  name     = "lksy-frontend"
  location = "us-central1"
  project  = "visual-validation"

  template {
    spec {
      containers {
        image = "gcr.io/visual-validation/lksy-frontend:latest"
        
        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = "https://api.lksy.org"
        }
        
        env {
          name  = "GITHUB_OWNER"
          value = "lksy-org"
        }
        
        env {
          name  = "GITHUB_REPO"
          value = "community-standards"
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# API Service
resource "google_cloud_run_service" "lksy_api" {
  name     = "lksy-api"
  location = "us-central1"
  project  = "visual-validation"

  template {
    spec {
      containers {
        image = "gcr.io/visual-validation/lksy-api:latest"
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.lksy_user.name}:${var.db_password}@${google_sql_database_instance.lksy_db.private_ip_address}:5432/${google_sql_database.lksy_database.name}"
        }
        
        env {
          name  = "GITHUB_TOKEN"
          value = var.github_token
        }
        
        env {
          name  = "GITHUB_OWNER"
          value = "lksy-org"
        }
        
        env {
          name  = "GITHUB_REPO"
          value = "community-standards"
        }
        
        env {
          name  = "JWT_SECRET"
          value = var.jwt_secret
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "20"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# MCP Server Service
resource "google_cloud_run_service" "lksy_mcp_server" {
  name     = "lksy-mcp-server"
  location = "us-central1"
  project  = "visual-validation"

  template {
    spec {
      containers {
        image = "gcr.io/visual-validation/lksy-mcp-server:latest"
        
        env {
          name  = "GITHUB_TOKEN"
          value = var.github_token
        }
        
        env {
          name  = "GITHUB_OWNER"
          value = "lksy-org"
        }
        
        env {
          name  = "GITHUB_REPO"
          value = "community-standards"
        }
        
        resources {
          limits = {
            cpu    = "500m"
            memory = "256Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM: Allow unauthenticated access to frontend
resource "google_cloud_run_service_iam_member" "frontend_public" {
  service  = google_cloud_run_service.lksy_frontend.name
  location = google_cloud_run_service.lksy_frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# IAM: Allow authenticated access to API
resource "google_cloud_run_service_iam_member" "api_public" {
  service  = google_cloud_run_service.lksy_api.name
  location = google_cloud_run_service.lksy_api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

variable "github_token" {
  description = "GitHub token for API access"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for token signing"
  type        = string
  sensitive   = true
}

