resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "plat-fellowship-backend-${var.environment_name}-ecs-task-exec"
  assume_role_policy = data.aws_iam_policy_document.ecs_instance_assume_role_policy.json
  managed_policy_arns = [
    aws_iam_policy.ecs_task_execution_policy.arn
  ]
}

resource "aws_iam_role" "ecs_task_container_role" {
  name               = "plat-fellowship-backend-${var.environment_name}-ecs-task-con"
  assume_role_policy = data.aws_iam_policy_document.ecs_instance_assume_role_policy.json
  managed_policy_arns = [
    aws_iam_policy.ecs_task_container_policy.arn
  ]
}
