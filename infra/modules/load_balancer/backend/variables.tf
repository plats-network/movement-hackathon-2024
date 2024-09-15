variable "environment_name" {
  type        = string
  description = "This is environment name [prod | dev | poc]"
}

variable "aws_security_group_load_balancer_id" {
  type        = string
  description = "aws_security_group_load_balancer_id"
}


variable "subnet_1a_load_balancer_id" {
  type        = string
  description = "subnet_1a_load_balancer_id"
}
variable "subnet_1c_load_balancer_id" {
  type        = string
  description = "subnet_1c_load_balancer_id"
}

variable "vpc_id" {
  type        = string
  description = "vpc_id"
}


# variable "certificate_arn" {
#   type        = string
#   description = "certificate_arn"
# }
