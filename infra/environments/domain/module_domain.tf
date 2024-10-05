module "domain" {
  source = "../../modules/route53/zones"

  domain_name = var.domain_name
}
module "certificate_manager" {
  source = "../../modules/certificate_manager/zones"

  domain_name = var.domain_name
}
