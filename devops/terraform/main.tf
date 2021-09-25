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
}

module "auth_edge_lambda" {
    source = "./modules/edgeLambda"
    function_name = "client-auth-dev"
    auth_username = var.auth_username
    auth_password = var.auth_password
}

module "nextjs_app_cloudfront" {
    source = "./modules/cloudfront"
    hosted_zone_name = var.root_domain_name
    domain_name = var.domain_name
    lambda_edge_qualified_arn = module.auth_edge_lambda.qualified_arn
    acm_cert_arn = module.acm.cert_arn
    acm_cert_id = module.acm.cert_id
    s3_website_endpoint = module.nextjs_app_s3.website_endpoint
    default_root_object = "index.html"
}


module "api_gateway" {
    source = "./modules/apiGateway"
    certificate_arn = module.acm.cert_arn
    root_domain_name = var.root_domain_name
    domain_name = var.domain_name
    certificate_id = module.acm.cert_id
    stage_name = var.stage
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