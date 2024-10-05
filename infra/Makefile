-include ./.env

# DEV
init-dev:
	cd environments/dev && terraform init

plan-dev:
	cd environments/dev && terraform plan -var-file=config.tfvars 

apply-dev:
	cd environments/dev && terraform apply -var-file=config.tfvars 

destroy-dev:
	cd environments/dev && terraform destroy -var-file=config.tfvars 
