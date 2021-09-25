variable "function_name" {
  description = "Enter the function name"
  type        = string
  default     = null
}

variable "source_file" {
  description = "Enter the location of the lambda function file"
  type        = string
  default     = null
}

variable "output_path" {
  description = "The zip file that is generated based on the inputted Lambda"
  type        = string
  default     = null
}

variable "s3_policy_arn" {
  description = "S3 arn"
  type        = string
  default     = null
}

variable "auth_username" {
  description = "Username to access website"
  type        = string
  default     = null
}

variable "auth_password" {
  description = "Password to access website"
  type        = string
  default     = null
}