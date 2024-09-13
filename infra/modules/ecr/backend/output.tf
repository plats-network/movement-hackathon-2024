output "ecr_uri" {
  value = aws_ecr_repository.main.repository_url
}

output "ecr_arn" {
  value = aws_ecr_repository.main.arn
}
