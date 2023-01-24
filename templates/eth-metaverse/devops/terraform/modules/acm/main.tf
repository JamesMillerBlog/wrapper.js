terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "3.27.0"
        }
  }
}

provider "aws" {
    alias = "us-east-1"  
    region = "us-east-1"
}

data "aws_route53_zone" "this" {
  name         = var.root_domain_name
  private_zone = false
}

// Use the AWS Certificate Manager to create an SSL cert for our domain.
// This resource won't be created until you receive the email verifying you
// own the domain and you click on the confirmation link.
resource "aws_acm_certificate" "this" {
    provider = aws.us-east-1
    // We want a wildcard cert so we can host subdomains later.
    domain_name       = var.domain_name
    validation_method = "DNS"

    // We also want the cert to be valid for the root domain even though we'll be
    // redirecting to the www. domain immediately.
    subject_alternative_names = ["*.${var.domain_name}"]
    
    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_route53_record" "validation" {

    name            = aws_acm_certificate.this.domain_validation_options.*.resource_record_name[0]
    records         = [aws_acm_certificate.this.domain_validation_options.*.resource_record_value[0]]
    type            = aws_acm_certificate.this.domain_validation_options.*.resource_record_type[0]
    zone_id         = data.aws_route53_zone.this.zone_id
    ttl             = 60
    allow_overwrite = true

    depends_on = [aws_acm_certificate.this]
}

resource "aws_acm_certificate_validation" "this" {
    provider = aws.us-east-1
    certificate_arn = aws_acm_certificate.this.arn
    validation_record_fqdns = [ aws_route53_record.validation.fqdn ]
    
    depends_on = [aws_route53_record.validation]
}