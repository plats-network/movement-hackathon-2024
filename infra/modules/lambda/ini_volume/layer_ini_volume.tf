# layers
data "archive_file" "layer_zip" {
  type        = "zip"
  source_dir  = var.layer_path
  output_path = "../../temp/ini_volume_layer.zip"
}
resource "aws_lambda_layer_version" "nodejs20_break_trades_all_layer" {
  filename            = data.archive_file.layer_zip.output_path
  layer_name          = "plat-fellowship-${var.environment_name}-ini-volume"
  source_code_hash    = data.archive_file.layer_zip.output_base64sha256
  compatible_runtimes = ["python3.11"]
}
