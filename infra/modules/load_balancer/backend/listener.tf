# listener (currnetly use http by missing domain)
resource "aws_lb_listener" "listener_http" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "listener_https" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}


resource "aws_lb_listener_rule" "internal_api_allow" {
  listener_arn = aws_lb_listener.listener_https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/internal/*"]
    }
  }
  condition {
    source_ip {
      values = [
        var.vpc_cidr_block,
        "171.252.188.6/32", # Aiden Sepiol home IP
        "222.253.79.150/32" # Odin Hoang home IP
      ]
    }
  }
}

resource "aws_lb_listener_rule" "internal_api_deny" {
  listener_arn = aws_lb_listener.listener_https.arn
  priority     = 200

  action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Forbidden"
      status_code  = "403"
    }
  }

  condition {
    path_pattern {
      values = ["/api/v1/internal/*"]
    }
  }
}
