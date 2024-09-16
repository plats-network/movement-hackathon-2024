# module "nillion_ecr" {
#   source           = "../../modules/ecr/nillion"
#   environment_name = var.environment_name
# }

# module "nillion_iam" {
#   source           = "../../modules/iam/nillion"
#   environment_name = var.environment_name
# }

# module "nillion_network" {
#   source           = "../../modules/network/nillion"
#   environment_name = var.environment_name
#   vpc_id           = var.vpc_id
#   vpc_cidr_block   = module.network.vpc_cidr_block
# }

# module "nillion_ecs" {
#   source                          = "../../modules/ecs/nillion"
#   environment_name                = var.environment_name
#   logs_region                     = var.region
#   ecr_uri                         = module.nillion_ecr.ecr_uri
#   ecs_task_execution_role_arn     = module.nillion_iam.ecs_task_execution_role_arn
#   ecs_task_container_role_arn     = module.nillion_iam.ecs_task_container_role_arn
#   security_group_ecs_task_service = module.nillion_network.ecs_sg_id
#   public_subnet_id                = var.public_subnet_a_id
# }
