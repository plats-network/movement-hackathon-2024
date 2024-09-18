module "frontend_ecr" {
  source           = "../../modules/ecr/frontend"
  environment_name = var.environment_name
}

module "frontend_iam" {
  source           = "../../modules/iam/frontend"
  environment_name = var.environment_name
}

module "frontend_network" {
  source           = "../../modules/network/frontend"
  environment_name = var.environment_name
  vpc_id           = var.vpc_id
  vpc_cidr_block   = module.network.vpc_cidr_block
}

module "frontend_load_balancer" {
  source                              = "../../modules/load_balancer/frontend"
  environment_name                    = var.environment_name
  aws_security_group_load_balancer_id = module.frontend_network.elb_sg_id
  subnet_1a_load_balancer_id          = var.public_subnet_a_id
  subnet_1c_load_balancer_id          = var.public_subnet_b_id
  vpc_id                              = var.vpc_id
  vpc_cidr_block                      = module.network.vpc_cidr_block
  certificate_arn                     = module.certificate_manager.cert_arn
}

module "frontend_ecs" {
  source                          = "../../modules/ecs/frontend"
  environment_name                = var.environment_name
  logs_region                     = var.region
  ecr_uri                         = module.frontend_ecr.ecr_uri
  ecs_task_execution_role_arn     = module.frontend_iam.ecs_task_execution_role_arn
  ecs_task_container_role_arn     = module.frontend_iam.ecs_task_container_role_arn
  security_group_ecs_task_service = module.frontend_network.ecs_sg_id
  public_subnet_id                = var.public_subnet_a_id
  target_group_arn                = module.frontend_load_balancer.load_balancer_target_group_arn
}


module "frontend_route_53" {
  source      = "../../modules/route53/record_frontend"
  domain_name = var.domain_name
  lb_dns_name = module.frontend_load_balancer.lb_dns_name
  lb_zone_id  = module.frontend_load_balancer.lb_zone_id
}
