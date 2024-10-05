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

variable "subnet_id" {
  type        = string
  description = "subnet_id"
}


variable "aws_security_group_id" {
  type        = string
  description = "aws_security_group_id"
}

variable "backend_dns" {
  type        = string
  description = "backend_dns"
}

variable "rpc_url" {
  type        = string
  description = "rpc_url"
}
