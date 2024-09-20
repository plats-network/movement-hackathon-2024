output "load_balancer_target_group_arn" {
  value = aws_lb_target_group.target_group.arn
}

output "lb_dns_name" {
  value = aws_lb.load_balancer.dns_name
}

output "lb_zone_id" {
  value = aws_lb.load_balancer.zone_id
}

