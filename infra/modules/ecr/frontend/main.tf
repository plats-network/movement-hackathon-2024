resource "aws_ecr_repository" "main" {
  name                 = "plat-movement-${var.environment_name}-frontend"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-movement"
    Service     = "frontend"
  }
}
