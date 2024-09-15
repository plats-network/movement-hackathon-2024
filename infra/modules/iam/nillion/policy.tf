resource "aws_iam_policy" "ecs_task_execution_policy" {
  name = "plat-fellowship-${var.environment_name}-nillion-ecs-task-exec"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogStreams",
          "logs:GetLogEvents",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
        Sid      = "LogGroup"
      },
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Effect   = "Allow"
        Resource = "*"
        Sid      = "ECR"
      }
    ]
  })
}

resource "aws_iam_policy" "ecs_task_container_policy" {
  name = "plat-fellowship-${var.environment_name}-nillion-ecs-task-con"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["secretsmanager:GetSecretValue"]
        Effect   = "Allow"
        Resource = "*"
        Sid      = "SecretManager"
      }
    ]
  })
}
