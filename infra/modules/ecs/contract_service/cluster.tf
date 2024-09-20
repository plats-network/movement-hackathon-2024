resource "aws_ecs_cluster" "cluster" {
  name = "plat-fellowship-${var.environment_name}-contract-svc"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
