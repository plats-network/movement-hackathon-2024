resource "aws_lb_target_group" "target_group" {
  name                              = "plat-fellowship-backend-${var.environment_name}"
  port                              = 80
  protocol                          = "HTTP"
  target_type                       = "ip"
  vpc_id                            = var.vpc_id
  deregistration_delay              = 300
  load_balancing_algorithm_type     = "round_robin"
  slow_start                        = 0
  load_balancing_cross_zone_enabled = "use_load_balancer_configuration"

  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 60
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 20
    unhealthy_threshold = 2
    matcher             = 200
  }

  stickiness {
    enabled         = false
    type            = "lb_cookie"
    cookie_duration = 86400
  }

  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-fellowship"
  }
}

