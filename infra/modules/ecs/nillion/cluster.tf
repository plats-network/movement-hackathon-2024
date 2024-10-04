resource "aws_ecs_cluster" "cluster" {
  name = "plat-movement-${var.environment_name}-nillion"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
