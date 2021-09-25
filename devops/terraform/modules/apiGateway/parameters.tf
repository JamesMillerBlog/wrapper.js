resource "aws_ssm_parameter" "rest_api_id" {
  name        = "${var.domain_name}_param_sls_rest_api_id"
  description = "REST API ID for ${var.domain_name}"
  type        = "SecureString"
  value       = aws_api_gateway_rest_api.this.id
}

resource "aws_ssm_parameter" "root_resource_id" {
  name        = "${var.domain_name}_param_sls_root_resource_id"
  description = "REST API ID for ${var.domain_name}"
  type        = "SecureString"
  value       = aws_api_gateway_rest_api.this.root_resource_id
}