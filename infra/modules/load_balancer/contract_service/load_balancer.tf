resource "aws_lb" "load_balancer" {
  name               = "plat-movement-${var.environment_name}-contract-svc"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [var.aws_security_group_load_balancer_id]
  subnets = [
    var.subnet_1a_load_balancer_id,
    var.subnet_1c_load_balancer_id
  ]

  enable_deletion_protection = false


  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-movement"
    Service     = "contract-svc"
  }
}

