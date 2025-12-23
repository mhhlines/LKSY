# Domain Configuration for lksy.org

# Cloud Load Balancer for custom domain
resource "google_compute_global_address" "lksy_ip" {
  name    = "lksy-ip"
  project = "visual-validation"
}

resource "google_compute_backend_service" "lksy_backend" {
  name                  = "lksy-backend"
  project               = "visual-validation"
  load_balancing_scheme = "EXTERNAL"
  
  backend {
    group = google_cloud_run_service.lksy_frontend.status[0].url
  }
}

# Note: Domain mapping for Cloud Run can also be done via:
# gcloud run domain-mappings create --service lksy-frontend --domain lksy.org --region us-central1

