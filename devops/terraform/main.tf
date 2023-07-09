// We want AWS to host our zone so its nameservers can point to our CloudFront
// distribution.

module "nextjs_app_s3" {
  source = "./modules/s3"
  bucket = var.domain_name
  acl    = "public-read"
}

module "acm" {
  source           = "./modules/acm"
  root_domain_name = var.root_domain_name
  domain_name      = var.domain_name
  region           = "us-east-1"
}

module "nextjs_app_cloudfront" {
  source           = "./modules/cloudfront"
  hosted_zone_name = var.root_domain_name
  domain_name      = var.domain_name
  # lambda_edge_qualified_arn = module.uri_redirect_edge_lambda.qualified_arn
  acm_cert_arn        = module.acm.cert_arn
  acm_cert_id         = module.acm.cert_id
  s3_website_endpoint = module.nextjs_app_s3.website_endpoint
  default_root_object = "index.html"
}

module "rest_api_gateway" {
  source           = "./modules/restApiGateway"
  certificate_arn  = module.acm.cert_arn
  root_domain_name = var.root_domain_name
  domain_name      = "api.${var.domain_name}"
  certificate_id   = module.acm.cert_id
  stage_name       = var.stage
  cognito_arn      = module.cognito.user_pool_client_arn
}

module "ws_api_gateway" {
  source           = "./modules/wsApiGateway"
  root_domain_name = var.root_domain_name
  domain_name      = "ws.${var.domain_name}"
  stage_name       = var.stage
}

module "cognito" {
  source       = "./modules/cognito"
  domain_name  = var.domain_name
  stage_name   = var.stage
  service_name = var.service_name
}

module "user_data_table" {
  source         = "./modules/dynamodb"
  db_table_name  = "${var.service_name}-${var.stage}-user-data-table"
  hash_key       = "address"
  range_key      = "nonce"
  hash_key_type  = "S"
  range_key_type = "S"
}

module "positions_data_table" {
  source         = "./modules/dynamodb"
  db_table_name  = "${var.service_name}-${var.stage}-positions-data-table"
  hash_key       = "type"
  range_key      = "uid"
  hash_key_type  = "S"
  range_key_type = "S"
}

module "secrets_manager" {
  source                       = "./modules/secretsManager"
  service_name                 = var.service_name
  cognito_identity_pool_id     = module.cognito.identity_pool_id
  cognito_user_pool_id         = module.cognito.user_pool_id
  cognito_user_pool_client_id  = module.cognito.user_pool_client_id
  cognito_user_pool_client_arn = module.cognito.user_pool_client_arn
  cognito_authorizer           = module.rest_api_gateway.cognito_authorizer
  api_gateway_rest_api_id      = module.rest_api_gateway.rest_api_id
  api_gateway_root_resource_id = module.rest_api_gateway.root_resource_id
  user_table_id                = module.user_data_table.id
  positions_table_id           = module.positions_data_table.id
}
