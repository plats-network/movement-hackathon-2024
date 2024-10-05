# module "indexer_secret_manager" {
#   source           = "../../modules/secret_manager/indexer"
#   environment_name = var.environment_name
# }

# module "indexer_ecr" {
#   source           = "../../modules/ecr/indexer"
#   environment_name = var.environment_name
# }

# module "indexer_iam" {
#   source           = "../../modules/iam/indexer"
#   environment_name = var.environment_name
# }

# module "indexer_network" {
#   source           = "../../modules/network/indexer"
#   environment_name = var.environment_name
#   vpc_id           = var.vpc_id
#   vpc_cidr_block   = module.network.vpc_cidr_block
# }

# module "indexer_ecs" {
#   source = "../../modules/ecs/indexer"

#   environment_name                = var.environment_name
#   logs_region                     = var.region
#   secret_arn                      = module.indexer_secret_manager.secret_arn
#   ecr_uri                         = module.indexer_ecr.ecr_uri
#   ecs_task_execution_role_arn     = module.indexer_iam.ecs_task_execution_role_arn
#   ecs_task_container_role_arn     = module.indexer_iam.ecs_task_container_role_arn
#   security_group_ecs_task_service = module.indexer_network.ecs_sg_id
#   public_subnet_id                = var.public_subnet_a_id
#   sqs_queue_url                   = module.ini_volume_sqs.aws_sqs_queue_url
#   backend_dns                     = module.backend_load_balancer.lb_dns_name
#   rpc_url                         = var.rpc_url
#   desired_count                   = 0
# }
