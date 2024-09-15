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
  description = "subnet_public_a_id"
}
variable "public_subnet_b_id" {
  type        = string
  description = "public_subnet_b_id"
}
