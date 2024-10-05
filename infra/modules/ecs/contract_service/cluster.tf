resource "aws_ecs_cluster" "cluster" {
  name = "plat-movement-${var.environment_name}-contract-svc"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
