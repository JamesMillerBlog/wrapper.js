output "cert_arn" {
  value = aws_acm_certificate.this.arn
}

output "cert_id" {
  value = aws_acm_certificate_validation.this.id
}