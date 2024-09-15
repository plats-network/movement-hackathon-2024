-include ./.env

# COMMON
init-common:
	cd environments/common && terraform init

plan-common:
	cd environments/common && terraform plan -var-file=config.tfvars 

apply-common:
	cd environments/common && terraform apply -var-file=config.tfvars 

destroy-common:
	cd environments/common && terraform destroy -var-file=config.tfvars 

# DOMAIN
init-domain:
	cd environments/domain && terraform init

plan-domain:
	cd environments/domain && terraform plan -var-file=config.tfvars 

apply-domain:
	cd environments/domain && terraform apply -var-file=config.tfvars 

destroy-domain:
	cd environments/domain && terraform destroy -var-file=config.tfvars 

# DEV
init-dev:
	cd environments/dev && terraform init

plan-dev:
	cd environments/dev && terraform plan -var-file=config.tfvars 

apply-dev:
	cd environments/dev && terraform apply -var-file=config.tfvars 

destroy-dev:
	cd environments/dev && terraform destroy -var-file=config.tfvars 
