terraform {
  backend "local" {
    path = "local_state/terraform.tfstate"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.54.0"
    }
  }
}
