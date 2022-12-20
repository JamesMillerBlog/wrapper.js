terraform {
  backend "s3" {
    bucket     = "${var.state_s3_bucket}"
    region     = "${var.region}"
    key        = "${var.state_s3_key}"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.27.0"
    }
  }
}

# data "terraform_remote_state" "state" {
#   backend = "s3"
#   config = {
#     bucket     = "${var.state_s3_bucket}"
#     region     = "${var.region}"
#     key        = "${var.state_s3_key}"
#   }
# }


provider "aws" {
  region = var.region
}