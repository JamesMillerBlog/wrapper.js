# resource "aws_ssm_parameter" "endpoint" {
#   name        = "/cloudfront/${var.domain_name}/endpoint"
#   description = "Endpoint to connect to the ${var.domain_name} cloudfront cdn"
#   type        = "SecureString"
#   value       = aws_cloudfront_distribution.this.id
#   provider = aws.us-east-1
# }

# provider "aws" {
#     alias = "us-east-1"  
#     region = "us-east-1"
#     version = "2.68"
# }