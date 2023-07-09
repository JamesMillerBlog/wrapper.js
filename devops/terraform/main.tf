// We want AWS to host our zone so its nameservers can point to our CloudFront
// distribution.

module "nextjs_app_s3" {
    source = "./modules/s3"
    bucket = var.domain_name
    acl    = "public-read"
}

module "acm" {
    source = "./modules/acm"
    root_domain_name = var.root_domain_name
    domain_name = var.domain_name
    region = "us-east-1"
}

module "nextjs_app_cloudfront" {
    source = "./modules/cloudfront"
    hosted_zone_name = var.root_domain_name
    domain_name = var.domain_name
    # lambda_edge_qualified_arn = module.uri_redirect_edge_lambda.qualified_arn
    acm_cert_arn = module.acm.cert_arn
    acm_cert_id = module.acm.cert_id
    s3_website_endpoint = module.nextjs_app_s3.website_endpoint
    default_root_object = "index.html"
}

module "rest_api_gateway" {
    source = "./modules/restApiGateway"
    certificate_arn = module.acm.cert_arn
    root_domain_name = var.root_domain_name
    domain_name = "api.${var.domain_name}"
    certificate_id = module.acm.cert_id
    stage_name = var.stage
    cognito_arn = module.cognito.user_pool_client_arn
}

module "cognito" {
    source = "./modules/cognito"
    domain_name = var.domain_name
    stage_name = var.stage
    service_name = var.service_name
}

module "secrets_manager" {
    source = "./modules/secretsManager"
    service_name = var.service_name
    cognito_identity_pool_id = module.cognito.identity_pool_id
    cognito_user_pool_id = module.cognito.user_pool_id
    cognito_user_pool_client_id = module.cognito.user_pool_client_id
    cognito_user_pool_client_arn = module.cognito.user_pool_client_arn
    cognito_authorizer = module.rest_api_gateway.cognito_authorizer
    api_gateway_rest_api_id = module.rest_api_gateway.rest_api_id
    api_gateway_root_resource_id = module.rest_api_gateway.root_resource_id
}

# module "www_redirect_s3" {
#     source = "./modules/s3"
#     bucket = local.var.www_sub_domain_name
#     acl    = "public-read"
#     website = {
#         index_document = null
#         error_document = null
#         redirect_all_requests_to = "https://${local.var.root_domain_name}"
#     }
# }

# module "www_redirect_cloudfront" {
#     source = "./modules/cloudfront"
#     hosted_zone_name = local.var.root_domain_name
#     domain_name = local.var.domain_name
#     acm_cert_arn = module.acm.cert_arn
#     acm_cert_id = module.acm.cert_id
#     s3_website_endpoint = module.www_redirect_s3.website_endpoint
# }