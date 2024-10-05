# provider variable
variable "region" {
  type        = string
  description = "This is vpc region"
}

variable "environment_name" {
  type        = string
  description = "This is environment name [prod | stag | dev]"
}

variable "vpc_id" {
  type        = string
  description = "vpc_id"
}
variable "public_subnet_a_id" {
  type        = string
  description = "public_subnet_a_id"
}
variable "private_subnet_a_id" {
  type        = string
  description = "private_subnet_a_id"
}
variable "public_subnet_b_id" {
  type        = string
  description = "public_subnet_b_id"
}
variable "domain_name" {
  type        = string
  description = "domain_name"
}
variable "rpc_url" {
  type        = string
  description = "rpc_url"
}
