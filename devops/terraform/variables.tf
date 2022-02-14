variable "root_domain_name" {
  description = "Root domain name for project"
  type        = string
  default = ""
}

variable "domain_name" {
  description = "Domain name for environment"
  type        = string
  default = ""
}

variable "stage" {
  description = "API Stage"
  type        = string
  default = ""
}

variable "region" {
  description = "Deployment region for resources"
  type        = string
  default = ""
}

variable "state_s3_key" {
  description = "The name of the terraform state file within the s3 bucket"
  type        = string
  default = ""
}

variable "state_s3_bucket" {
  description = "The s3 bucket that stores state for an environment"
  type        = string
  default = ""
}

variable "chain_network_id" {
  description = "The network id of the private eth blockchain"
  type        = string
  default = ""
}

variable "chain_account_password" {
  description = "Account password required for the coin base account on eth blockchain"
  type        = string
  default     = null
}

variable "service_name" {
  description = "Serverless framework service name"
  type        = string
  default     = null
}