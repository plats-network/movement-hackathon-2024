resource "aws_ecs_cluster" "cluster" {
  name = "plat-fellowship-backend-${var.environment_name}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
