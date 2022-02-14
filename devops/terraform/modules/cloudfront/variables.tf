variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = null
}

variable "hosted_zone_name" {
  description = "Name of hosted zone"
  type        = string
  default     = null
}

variable "acm_cert_arn" {
  description = "ACM certificate arn"
  type        = string
  default     = null
}

variable "acm_cert_id" {
  description = "ACM certificate id (issued after cert validation is complete)"
  type        = string
  default     = null
}

variable "s3_website_endpoint" {
  description = "s3 website endpoint"
  type        = string
  default     = null
}

variable "default_root_object" {
  description = "Default Root Object"
  type        = string
  default     = ""
}

# variable "lambda_edge_qualified_arn" {
#   description = "Arn of Edge Lambda"
#   type        = string
#   default     = ""
# }