resource "aws_iam_role" "lambda_execution_role" {
  name               = "plat-fellowship-${var.environment_name}-ini-volume-lambda-execution-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
  managed_policy_arns = [
    aws_iam_policy.cloud_watch_log.arn,
    aws_iam_policy.sqs_io.arn,
    aws_iam_policy.lambda_io.arn,
    aws_iam_policy.secret_manager_readonly.arn,
    aws_iam_policy.network_connect.arn
  ]
}
