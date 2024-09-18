variable "environment_name" {
  type        = string
  description = "This is environment name [prod | dev | poc]"
}

variable "vpc_id" {
  type        = string
  description = "vpc_id"
}

variable "vpc_cidr_block" {
  type        = string
  description = "vpc_cidr_block"
}
