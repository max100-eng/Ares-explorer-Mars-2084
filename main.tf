# main.tf - Configuración final con solución de sincronización y corrección de tipo de dato

# --- RECURSOS NATIVOS PARA HABILITAR APIS ---

resource "google_project_service" "apphub_api_service" {
  project            = var.apphub_project_id
  service            = "apphub.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudresourcemanager_api_service" {
  project            = var.apphub_project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sqladmin_api_service" {
  project            = var.apphub_project_id
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secretmanager_api_service" {
  project            = var.apphub_project_id
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

# --- RECURSO NATIVO PARA LA APLICACIÓN DE APP HUB (PADRE) ---

resource "google_apphub_application" "apphub_application" {
  project        = var.apphub_project_id
  location       = var.apphub_location
  application_id = var.apphub_application_id
  display_name   = "My Application Environment"
  
  scope {
    type = "REGIONAL" 
  }

  depends_on     = [google_project_service.apphub_api_service]
}


# --- Módulos de Balanceador de Carga (LB) ---
module "app1-global-lb-frontend" {
  source          = "github.com/terraform-google-modules/terraform-google-lb-http//modules/frontend?ref=v13.2.0"
  name            = "app1-global-lb-frontend"
  project_id      = "utilitarian-chemist-kvbmb"
  url_map_input   = module.app1-global-lb-backend.backend_service_info
  depends_on      = [google_project_service.apphub_api_service]
}

module "app1-global-lb-backend" {
  source      = "github.com/terraform-google-modules/terraform-google-lb-http//modules/backend?ref=v13.2.0"
  name        = "app1-global-lb-backend"
  project_id  = "utilitarian-chemist-kvbmb"
  serverless_neg_backends = [{
    region        = module.app1-frontend-service.location
    service_name  = module.app1-frontend-service.service_name
    service_version = ""
    type          = "cloud-run"
  }]
  depends_on = [google_project_service.apphub_api_service]
}

# --- Módulo de Servicio Frontend (Cloud Run) ---
module "app1-frontend-service" {
  source                        = "github.com/GoogleCloudPlatform/terraform-google-cloud-run//modules/v2?ref=v0.21.6"
  project_id                    = var.apphub_project_id
  location                      = "us-central1"
  service_name                  = "frontend-service"
  containers                    = [{"ports" = {"container_port" = 8080}, "container_image" = "us-docker.pkg.dev/cloudrun/container/hello", "container_name" = "service-container", "env_vars" = {"app1_backend_service_SERVICE_ENDPOINT" = module.app1-backend-service.service_uri}}]
  gpu_zonal_redundancy_disabled = false
  service_account_project_roles = ["roles/run.invoker"]
  vpc_access = {
    egress = "ALL_TRAFFIC"
    network_interfaces = {
      network    = "default"
      subnetwork = "default"
    }
  }
  cloud_run_deletion_protection = false
  enable_prometheus_sidecar     = true
  service_scaling = {
    min_instance_count = 0
  }
  template_scaling = {
    min_instance_count = 0
  }
  depends_on = [google_project_service.apphub_api_service]
}

# --- Módulo de Servicio Backend (Cloud Run) ---
module "app1-backend-service" {
  source                        = "github.com/GoogleCloudPlatform/terraform-google-cloud-run//modules/v2?ref=v0.21.6"
  project_id                    = var.apphub_project_id
  location                      = "us-central1"
  service_name                  = "backend-service"
  containers                    = [{"env_vars" = {"app1_database_postgresql_CLOUD_SQL_DATABASE_CONNECTION_NAME" = module.app1-database-postgresql.instance_connection_name, "app1_database_postgresql_CLOUD_SQL_DATABASE_HOST" = module.app1-database-postgresql.instance_first_ip_address, "app1_database_postgresql_CLOUD_SQL_DATABASE_NAME" = module.app1-database-postgresql.env_vars.CLOUD_SQL_DATABASE_NAME}, "ports" = {"container_port" = 8080}, "container_image" = "us-docker.pkg.dev/cloudrun/container/hello", "container_name" = "service-container", "env_secret_vars" = {"app1_database_secret_SECRET" = module.app1-database-secret.env_vars.SECRET}}]
  gpu_zonal_redundancy_disabled = false
  service_account_project_roles = concat(["roles/cloudsql.instanceUser", "roles/cloudsql.client"], ["roles/secretmanager.secretAccessor"])
  vpc_access = {
    egress = "ALL_TRAFFIC"
    network_interfaces = {
      network    = "default"
      subnetwork = "default"
    }
  }
  cloud_run_deletion_protection = false
  enable_prometheus_sidecar     = true
  service_scaling = {
    min_instance_count = 0
  }
  template_scaling = {
    min_instance_count = 0
  }
  depends_on = [google_project_service.apphub_api_service]
}

# --- Módulo de Base de Datos (Cloud SQL PostgreSQL) ---
module "app1-database-postgresql" {
  source                      = "github.com/terraform-google-modules/terraform-google-sql-db//modules/postgresql?ref=v26.2.2"
  project_id                  = var.apphub_project_id
  name                        = "postgresql-db"
  edition                     = "ENTERPRISE_PLUS"
  database_version            = "POSTGRES_15"
  availability_type           = "REGIONAL"
  deletion_protection         = false
  database_flags              = [{"value" = "on", "name" = "cloudsql.iam_authentication"}]
  data_cache_enabled          = true
  tier                        = "db-perf-optimized-N-8"
  deletion_protection_enabled = false
  disk_autoresize             = true
  backup_configuration = {
    enabled                        = true
    point_in_time_recovery_enabled = true
  }
  iam_users = [{
    email = module.app1-backend-service.service_account_id.email
    id    = module.app1-backend-service.service_account_id.id
    type  = "CLOUD_IAM_SERVICE_ACCOUNT"
  }]
  depends_on = [
    google_project_service.apphub_api_service,
    google_project_service.sqladmin_api_service
  ]
}

# --- Módulo de Secret Manager ---
module "app1-database-secret" {
  source      = "github.com/GoogleCloudPlatform/terraform-google-secret-manager//modules/simple-secret?ref=v0.9.0"
  project_id  = var.apphub_project_id
  name        = "db-credentials-secret"
  secret_data = module.app1-database-postgresql.generated_user_password
  depends_on  = [
    google_project_service.apphub_api_service,
    google_project_service.secretmanager_api_service
  ]
}

# --- SOLUCIÓN DE TIEMPO DE ESPERA (TIME_SLEEP) ---
# Esto pausa Terraform por 5 minutos para darle tiempo a la API de App Hub para "descubrir" los recursos.
resource "time_sleep" "wait_for_service_discovery" {
  # Depende de todos los servicios de la aplicación
  depends_on = [
    module.app1-frontend-service,
    module.app1-backend-service,
    module.app1-database-postgresql,
  ]

  # Espera 300 segundos (5 minutos)
  create_duration = "300s" 
}

# --- Módulo de AppHub ---
module "apphub" {
  source         = "github.com/GoogleCloudPlatform/terraform-google-apphub?ref=v0.4.0"
  project_id     = var.apphub_project_id
  location       = var.apphub_location
  
  # CORRECCIÓN FINAL DE TIPO DE DATO: Pasamos el objeto completo (apphub_service_uri), no solo la cadena (.service_uri)
  # Esto resuelve el error: incorrect list element type: object required, but have string.
  service_uris   = tolist([
    module.app1-frontend-service.apphub_service_uri,
    module.app1-backend-service.apphub_service_uri,
    module.app1-database-postgresql.apphub_service_uri
  ])
  application_id = var.apphub_application_id
  
  # Dependencia final: El módulo de App Hub espera a que el 'sleep' termine.
  depends_on     = [
    google_project_service.apphub_api_service,
    google_apphub_application.apphub_application,
    time_sleep.wait_for_service_discovery
  ]
}