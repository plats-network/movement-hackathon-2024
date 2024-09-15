# public subnet
data "aws_subnet" "public_subnet_a" {
  id = var.public_subnet_a_id
}

data "aws_subnet" "public_subnet_b" {
  id = var.public_subnet_b_id
}
