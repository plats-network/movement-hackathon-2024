module "network" {
  source = "../../modules/network/global_data"

  environment_name   = var.environment_name
  vpc_id             = var.vpc_id
  public_subnet_a_id = var.public_subnet_a_id
  public_subnet_b_id = var.public_subnet_b_id
}
