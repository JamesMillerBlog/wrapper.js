variable "db_table_name" {
  description = "Name of stage"
  type        = string
  default     = null
}

variable "hash_key" {
  description = "Name of Partician Key"
  type        = string
  default     = null
}

variable "range_key" {
  description = "Name of Sort Key"
  type        = string
  default     = null
}

variable hash_key_type {
  description = "Name of Hash Key Type"
  type        = string
  default     = null
}

variable range_key_type {
  description = "Name of Range Key Type"
  type        = string
  default     = null
}