resource "aws_ecs_cluster" "cluster" {
  name = "plat-fellowship-${var.environment_name}-contract-service"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
