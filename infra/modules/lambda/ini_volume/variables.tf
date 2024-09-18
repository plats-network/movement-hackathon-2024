# environment
variable "environment_name" {
  type        = string
  description = "This is environment name [prod | stag | dev]"
}

# iam
variable "lambda_execution_role_arn" {
  type        = string
  description = "lambda execution role arn"
}

variable "code_path" {
  type        = string
  description = "code_path"
}

variable "layer_path" {
  type        = string
  description = "layer_path"
}

variable "source_arn" {
  type        = string
  description = "source_arn"
}

variable "subnet_1a_load_balancer_id" {
  type        = string
  description = "subnet_1a_load_balancer_id"
}

variable "subnet_1c_load_balancer_id" {
  type        = string
  description = "subnet_1c_load_balancer_id"
}

variable "aws_security_group_id" {
  type        = string
  description = "aws_security_group_id"
}
