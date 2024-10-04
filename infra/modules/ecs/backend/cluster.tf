resource "aws_ecs_cluster" "cluster" {
  name = "plat-movement-${var.environment_name}-backend"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
