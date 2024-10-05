resource "aws_ecs_cluster" "cluster" {
  name = "plat-movement-${var.environment_name}-indexer"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
