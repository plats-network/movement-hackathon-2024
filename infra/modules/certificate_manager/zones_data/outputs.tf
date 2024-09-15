output "cert_arn" {
  value = data.aws_acm_certificate.domain.arn
}
