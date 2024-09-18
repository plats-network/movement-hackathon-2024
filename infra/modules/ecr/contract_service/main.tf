resource "aws_ecr_repository" "main" {
  name                 = "plat-fellowship-${var.environment_name}-contract-service"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-fellowship"
    Service     = "contract-service"
  }
}
