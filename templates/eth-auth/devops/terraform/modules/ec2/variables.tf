variable "name" {
    description = "Name to be used on all resources"
    type = string
}

variable "description" {
    description = "Description of the service for systemd"
    type = string
    default = ""
}

variable "availability_zone" {
    description = "The availability zone for both the AWS instance and the EBS volume."
    type = string
}

variable "user" {
    description = "What user to run as. You will need to run as root to use one of the lower ports."
    type = string
    default = "root"
}

variable "key_name" {
    description = "Name of the SSH key to log in with"
    type = string
}

variable "instance_type" {
    description = "The default AWS instance size to run these containers on"
    type = string
}

variable "persistent_volume_size_gb" {
    description = "The size of the volume mounted"
    type = number
}

variable "working_directory" {
    description = "Where on the filesystem to mount our persistent volume"
    type = string
    default = "/persistent"
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