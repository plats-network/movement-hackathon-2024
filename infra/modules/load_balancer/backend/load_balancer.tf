resource "aws_lb" "load_balancer" {
  name               = "plat-movement-${var.environment_name}-backend"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.aws_security_group_load_balancer_id]
  subnets = [
    var.subnet_1a_load_balancer_id,
    var.subnet_1c_load_balancer_id
  ]
  idle_timeout = 600
  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }

  enable_deletion_protection = false


  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-movement"
    Service     = "backend"
  }
}

