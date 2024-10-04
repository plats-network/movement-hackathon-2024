resource "aws_secretsmanager_secret" "secret" {
  name                    = "plat-movement-${var.environment_name}-contract-svc"
  recovery_window_in_days = 0
}
