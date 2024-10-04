resource "aws_security_group" "ecs" {
  name        = "plat-movement-${var.environment_name}-nillion-ecs"
  description = "ECS Service security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = [
      var.vpc_cidr_block,
      "222.253.79.150/32" # Odin Hoang home IP
    ]
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
    Service     = "nillion"
  }
}
