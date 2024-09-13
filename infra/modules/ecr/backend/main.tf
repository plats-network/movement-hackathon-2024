resource "aws_ecr_repository" "main" {
  name                 = "plat-fellowship-backend-${var.environment_name}"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }

  tags = {
    Name = "plat-fellowship-backend-${var.environment_name}"
  }
}
