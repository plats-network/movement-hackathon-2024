resource "aws_sqs_queue" "queue" {
  name                       = "plat-fellowship-${var.environment_name}-ini-volume"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 3600
  max_message_size           = 2048
  delay_seconds              = 0
  receive_wait_time_seconds  = 0
  fifo_queue                 = false

  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-fellowship"
    Service     = "ini-volume"
  }
}


