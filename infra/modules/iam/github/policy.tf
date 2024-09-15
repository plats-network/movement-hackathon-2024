resource "aws_iam_policy" "github_deployment_policy" {
  name = "plat-fellowship-github-deployment-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ecr"
        Effect   = "Allow"
        Resource = ["*"]
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImageTagMutability",
          "ecr:GetAuthorizationToken",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
      },
      {
        Sid      = "sts"
        Effect   = "Allow"
        Resource = ["*"]
        Action = [
          "sts:GetServiceBearerToken"
        ]
      },
      {
        Sid      = "ecs"
        Effect   = "Allow"
        Resource = ["*"]
        Action = [
          "ecs:UpdateService"
        ]
      }
    ]
  })
}
