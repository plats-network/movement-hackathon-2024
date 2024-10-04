resource "aws_security_group" "ecs" {
  name        = "plat-movement-${var.environment_name}-frontend-ecs"
  description = "ECS Service security group"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
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
    Service     = "frontend"
  }
}

resource "aws_security_group" "elb_sg" {
  name        = "plat-movement-${var.environment_name}-frontend-elb"
  description = "ELB security group"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
    Service     = "frontend"
  }
}
