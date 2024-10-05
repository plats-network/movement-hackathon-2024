# env
variable "environment_name" {
  type        = string
  description = "This is environment name [prod | stag | dev]"
}

# region
variable "logs_region" {
  type        = string
  description = "Region where CloudWatch Logs resides"
}

# secret
variable "secret_arn" {
  type        = string
  description = "ARN for getting value by key in secret manager"
}

# erc
variable "ecr_uri" {
  type        = string
  description = "ECR uri for image in ECS task definition"
}

# iam
variable "ecs_task_execution_role_arn" {
  type        = string
  description = "ecs task execution role arn"
}
variable "ecs_task_container_role_arn" {
  type        = string
  description = "ecs task container role arn"
}

# network
variable "security_group_ecs_task_service" {
  type        = string
  description = "ecs task container role arn"
}
variable "public_subnet_id" {
  type        = string
  description = "ecs task container role arn"
}
variable "sqs_queue_url" {
  type        = string
  description = "sqs_queue_url"
}

variable "backend_dns" {
  type        = string
  description = "backend_dns"
}

variable "rpc_url" {
  type        = string
  description = "rpc_url"
}

variable "desired_count" {
  type        = number
  description = "desired_count"
}
