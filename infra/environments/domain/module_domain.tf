module "certificate_manager" {
  source = "../../modules/certificate_manager/zones"

  domain_name = var.domain_name
}
