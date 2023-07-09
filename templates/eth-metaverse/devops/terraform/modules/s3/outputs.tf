output "website_endpoint" {
  value = aws_s3_bucket.this.website_endpoint
}

output "arn" {
  value = aws_s3_bucket.this.arn
}