data "aws_route53_zone" "this" {
  name         = var.hosted_zone_name
  private_zone = false
}

// This Route53 record will point at our CloudFront distribution.
resource "aws_route53_record" "this" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = true
  }
  depends_on = [aws_cloudfront_distribution.this]
}