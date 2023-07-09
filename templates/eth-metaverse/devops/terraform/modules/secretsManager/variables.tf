variable "service_name" {
  description = "Name of service"
  type        = string
  default     = null
}

variable "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID"
  type        = string
  default     = null
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
  default     = null
}

variable "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  type        = string
  default     = null
}

variable "cognito_user_pool_client_arn" {
  description = "Cognito User Pool Client arn"
  type        = string
  default     = null
}

variable "cognito_authorizer" {
  description = "Cognito Authorizer ID"
  type        = string
  default     = null
}

variable "api_gateway_root_resource_id" {
  description = "Api Gateway Root Resouce ID"
  type        = string
  default     = null
}

variable "api_gateway_rest_api_id" {
  description = "Api Gateway Rest API ID"
  type        = string
  default     = null
}

variable "user_table_id" {
  description = "User Table ID"
  type        = string
  default     = null
}

variable "positions_table_id" {
  description = "Positions DynamoDB Table ID"
  type        = string
  default     = null
}

variable "secrets" {
  description = "Secrets"
  default     = {}
  type        = map(string)
}
