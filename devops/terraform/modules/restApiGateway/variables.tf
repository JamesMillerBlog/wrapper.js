variable "root_domain_name" {
  description = "Root domain name"
  type        = string
  default     = null
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = null
}

variable "certificate_arn" {
  description = "Certificate Arn"
  type        = string
  default     = null
}

variable "certificate_id" {
  description = "Certificate ID"
  type        = string
  default     = null
}

variable "stage_name" {
  description = "Name of the API Stage"
  type        = string
  default     = null
}

variable "cognito_arn" {
  description = "Arn of Cognito User Pool"
  type        = string
  default     = null
}