resource "aws_ecs_cluster" "cluster" {
  name = "plat-movement-${var.environment_name}-frontend"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
