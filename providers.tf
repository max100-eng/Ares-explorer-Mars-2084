provider "google" {
  default_labels = {
    goog-adc-tf-deployment = "export"
  }
  billing_project       = var.apphub_project_id # ¡CORREGIDO!
  user_project_override = true
}
provider "google-beta" {
  default_labels = {
    goog-adc-tf-deployment = "export"
  }
  billing_project       = var.apphub_project_id # ¡CORREGIDO!
  user_project_override = true
}
