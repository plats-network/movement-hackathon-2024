# service for repo api
resource "aws_ecs_service" "service" {
  name            = "plat-movement-${var.environment_name}-indexer"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.core.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.public_subnet_id]
    security_groups  = [var.security_group_ecs_task_service]
    assign_public_ip = true
  }
}
