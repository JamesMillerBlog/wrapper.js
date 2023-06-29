resource "aws_dynamodb_table" "this" {
  name           = var.db_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = var.hash_key
  range_key      = var.range_key != null ? var.range_key : null

  attribute {
    name = var.hash_key
    type = var.hash_key_type
  }

  dynamic "attribute" {
    for_each = var.range_key == null ? [] : [1]
    content {
      name = var.range_key
      type = var.range_key_type
    }
  }
}

variable "attribute" {
  type = object({
    name = string
    type = string
  })
  default = null
}
