output "identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}

output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.this.id
}

output "user_pool_client_arn" {
  value = aws_cognito_user_pool.this.arn
}