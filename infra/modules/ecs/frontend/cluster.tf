resource "aws_ecs_cluster" "cluster" {
  name = "plat-fellowship-${var.environment_name}-frontend"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
