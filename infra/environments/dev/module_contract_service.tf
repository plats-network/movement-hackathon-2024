module "contract_service_secret_manager" {
  source           = "../../modules/secret_manager/contract_service"
  environment_name = var.environment_name
}
module "contract_service_ecr" {
  source           = "../../modules/ecr/contract_service"
  environment_name = var.environment_name
}

module "contract_service_iam" {
  source           = "../../modules/iam/contract_service"
  environment_name = var.environment_name
}

module "contract_service_network" {
  source           = "../../modules/network/contract_service"
  environment_name = var.environment_name
  vpc_id           = var.vpc_id
  vpc_cidr_block   = module.network.vpc_cidr_block
}

module "contract_service_load_balancer" {
  source                              = "../../modules/load_balancer/contract_service"
  environment_name                    = var.environment_name
  aws_security_group_load_balancer_id = module.contract_service_network.elb_sg_id
  subnet_1a_load_balancer_id          = var.public_subnet_a_id
  subnet_1c_load_balancer_id          = var.public_subnet_b_id
  vpc_id                              = var.vpc_id
  vpc_cidr_block                      = module.network.vpc_cidr_block
}

module "contract_service_ecs" {
  source                          = "../../modules/ecs/contract_service"
  environment_name                = var.environment_name
  logs_region                     = var.region
  secret_arn                      = module.contract_service_secret_manager.secret_arn
  ecr_uri                         = module.contract_service_ecr.ecr_uri
  ecs_task_execution_role_arn     = module.contract_service_iam.ecs_task_execution_role_arn
  ecs_task_container_role_arn     = module.contract_service_iam.ecs_task_container_role_arn
  security_group_ecs_task_service = module.contract_service_network.ecs_sg_id
  public_subnet_id                = var.public_subnet_a_id
  target_group_arn                = module.contract_service_load_balancer.load_balancer_target_group_arn
}
