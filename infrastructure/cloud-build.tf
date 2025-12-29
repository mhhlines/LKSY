# Cloud Build Configuration

resource "google_cloudbuild_trigger" "frontend_trigger" {
  name        = "lksy-frontend-build"
  description = "Build and deploy frontend on push to main"
  project     = "visual-validation"

  github {
    owner = "mhhlines"
    name  = "LKSY"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
  
  substitutions = {
    _SERVICE_NAME = "lksy-frontend"
    _IMAGE_NAME   = "gcr.io/visual-validation/lksy-frontend"
  }
}

resource "google_cloudbuild_trigger" "api_trigger" {
  name        = "lksy-api-build"
  description = "Build and deploy API on push to main"
  project     = "visual-validation"

  github {
    owner = "mhhlines"
    name  = "LKSY"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
  
  substitutions = {
    _SERVICE_NAME = "lksy-api"
    _IMAGE_NAME   = "gcr.io/visual-validation/lksy-api"
  }
}

resource "google_cloudbuild_trigger" "mcp_server_trigger" {
  name        = "lksy-mcp-server-build"
  description = "Build and deploy MCP server on push to main"
  project     = "visual-validation"

  github {
    owner = "mhhlines"
    name  = "LKSY"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
  
  substitutions = {
    _SERVICE_NAME = "lksy-mcp-server"
    _IMAGE_NAME   = "gcr.io/visual-validation/lksy-mcp-server"
  }
}


