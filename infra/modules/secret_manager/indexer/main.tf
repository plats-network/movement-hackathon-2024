resource "aws_secretsmanager_secret" "secret" {
  name                    = "plat-movement-${var.environment_name}-indexer"
  recovery_window_in_days = 0
}
