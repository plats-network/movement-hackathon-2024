resource "aws_secretsmanager_secret" "secret" {
  name                    = "plat-fellowship-backend-${var.environment_name}"
  recovery_window_in_days = 0
}
