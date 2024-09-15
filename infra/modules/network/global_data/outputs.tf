output "vpc_cidr_block" {
  value = data.aws_vpc.selected.cidr_block
}
