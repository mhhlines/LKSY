# Cloud SQL PostgreSQL Instance
resource "google_sql_database_instance" "lksy_db" {
  name             = "lksy-db"
  database_version = "POSTGRES_15"
  region           = "us-central1"
  project          = "visual-validation"

  settings {
    tier = "db-f1-micro"  # Start with smallest tier, can upgrade later
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.lksy_vpc.id
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "lksy_database" {
  name     = "lksy"
  instance = google_sql_database_instance.lksy_db.name
  project  = "visual-validation"
}

resource "google_sql_user" "lksy_user" {
  name     = "lksy_user"
  instance = google_sql_database_instance.lksy_db.name
  password = var.db_password
  project  = "visual-validation"
}

resource "google_compute_network" "lksy_vpc" {
  name                    = "lksy-vpc"
  auto_create_subnetworks = false
  project                 = "visual-validation"
}

resource "google_compute_subnetwork" "lksy_subnet" {
  name          = "lksy-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = "us-central1"
  network       = google_compute_network.lksy_vpc.id
  project       = "visual-validation"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}


