output "root_resource_id" {
  value = aws_api_gateway_rest_api.this.root_resource_id
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.this.id
}

output "cognito_authorizer" {
  value = aws_api_gateway_authorizer.this.id
}