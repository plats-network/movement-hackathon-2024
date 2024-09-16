resource "aws_ecs_cluster" "cluster" {
  name = "plat-fellowship-${var.environment_name}-indexer"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
