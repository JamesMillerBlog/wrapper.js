#temporary
# data "aws_acm_certificate" "this" {
#     domain         = var.hosted_zone_name
#     provider = aws.acm
# } 

# provider "aws" {
#     alias = "acm"  
#     region = "us-east-1"
#     version = "2.68"
# }

#delete when acm works again

resource "aws_cloudfront_distribution" "this" {
    // origin is where CloudFront gets its content from.
    origin {
        // We need to set up a "custom" origin because otherwise CloudFront won't
        // redirect traffic from the root domain to the www domain, that is from
        // runatlantis.io to www.runatlantis.io.
        custom_origin_config {
            // These are all the defaults.
            http_port              = "80"
            https_port             = "443"
            origin_protocol_policy = "http-only"
            origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
        }

        // Here we're using our S3 bucket's URL!
        domain_name = var.s3_website_endpoint
        // This can be any name to identify this origin.
        origin_id   = var.domain_name
    }

    enabled             = true
    default_root_object = var.default_root_object

    // All values are defaults from the AWS console.
    default_cache_behavior {
        viewer_protocol_policy = "redirect-to-https"
        compress               = true
        allowed_methods        = ["GET", "HEAD"]
        cached_methods         = ["GET", "HEAD"]
        // This needs to match the `origin_id` above.
        target_origin_id       = var.domain_name
        min_ttl                = 0
        default_ttl            = 0
        max_ttl                = 0

        forwarded_values {
            query_string = false
            cookies {
            forward = "none"
            }
        }

        lambda_function_association {
            event_type = "viewer-request"
            lambda_arn = var.lambda_edge_qualified_arn
        }

    }

    // Here we're ensuring we can hit this distribution using www.runatlantis.io
    // rather than the domain name CloudFront gives us.
    aliases = [var.domain_name]

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    // Here's where our certificate is loaded in!
    viewer_certificate {
        acm_certificate_arn = var.acm_cert_arn #uncomment when acm works again
        # acm_certificate_arn = data.aws_acm_certificate.this.arn #temporary
        ssl_support_method  = "sni-only"
    }

    # depends_on = [var.s3_website_endpoint, var.acm_cert_id]
    # depends_on = [var.s3_website_endpoint, var.lambda_edge_qualified_arn]
    depends_on = [var.s3_website_endpoint, var.lambda_edge_qualified_arn, var.acm_cert_id]
    # depends_on = [var.s3_website_endpoint]
}