# variables.tf

variable "apphub_project_id" {
  description = "The ID of the GCP project where App Hub resources will be created."
  type        = string
}

variable "apphub_location" {
  description = "The location for the App Hub resources (must be 'us-central1')."
  type        = string
  default     = "us-central1"
}

variable "apphub_application_id" {
  description = "The ID for the main App Hub application."
  type        = string
  default     = "ares-explorer-prod-01"
}