# deploy config
data "archive_file" "func_zip" {
  type        = "zip"
  source_dir  = var.code_path
  output_path = "../../temp/ini_volume.zip"
}
# main function
resource "aws_lambda_function" "ini_volume" {
  function_name                  = "plat-fellowship-${var.environment_name}-ini-volume"
  role                           = var.lambda_execution_role_arn
  architectures                  = ["x86_64"]
  description                    = "To Initialize Volume"
  filename                       = data.archive_file.func_zip.output_path
  handler                        = "main.main"
  memory_size                    = 512
  package_type                   = "Zip"
  publish                        = false
  reserved_concurrent_executions = -1
  runtime                        = "python3.11"
  skip_destroy                   = false
  source_code_hash               = data.archive_file.break_trades_zip.output_base64sha256
  timeout                        = 300
  layers                         = [aws_lambda_layer_version.nodejs20_break_trades_all_layer.arn]

  environment {
    variables = {
      BACKEND_URL = "http://172.31.21.6"
    }
  }
}
# trigger
resource "aws_lambda_permission" "lambda_break_trade_trigger_with_sqs" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ini_volume.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.source_arn
}

resource "aws_lambda_event_source_mapping" "lambda_trigger_mapping_with_sqs" {
  event_source_arn = var.source_arn
  function_name    = aws_lambda_function.ini_volume.function_name
}
