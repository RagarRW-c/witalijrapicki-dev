terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~> 5.70"
    }
  }
  #backend s3 pozniej
}

provider "aws" {
  region = var.aws_region
}

