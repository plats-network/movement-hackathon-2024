resource "aws_security_group" "lambda" {
  name        = "plat-movement-${var.environment_name}-ini-volume-lambda"
  description = "ECS Service security group"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr_block]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-movement"
    Service     = "ini-volume-lambda"
  }
}

