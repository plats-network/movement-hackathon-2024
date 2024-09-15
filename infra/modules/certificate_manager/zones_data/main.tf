data "aws_acm_certificate" "domain" {
  domain   = var.domain_name
  statuses = ["ISSUED"]
}
