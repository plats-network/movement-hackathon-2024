module "ini_volume_iam" {
  source           = "../../modules/iam/ini_volume"
  environment_name = var.environment_name
}

module "ini_volume_sqs" {
  source = "../../modules/sqs/ini_volume"

  environment_name = var.environment_name
}

module "ini_volume_network" {
  source           = "../../modules/network/ini_volume"
  environment_name = var.environment_name
  vpc_id           = var.vpc_id
  vpc_cidr_block   = module.network.vpc_cidr_block
}

module "ini_volume_lambda" {
  source = "../../modules/lambda/ini_volume"

  environment_name           = var.environment_name
  lambda_execution_role_arn  = module.ini_volume_iam.lambda_execution_role_arn
  code_path                  = "../../../lambda/ini_volume/function"
  layer_path                 = "../../../lambda/ini_volume/layer"
  source_arn                 = module.ini_volume_sqs.aws_sqs_queue_arn
  subnet_1a_load_balancer_id = var.public_subnet_a_id
  subnet_1c_load_balancer_id = var.public_subnet_b_id
  aws_security_group_id      = module.ini_volume_network.lambda_sg_id
}
