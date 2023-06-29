resource "aws_apigatewayv2_domain_name" "this" {
#   regional_certificate_arn = var.certificate_arn
    domain_name     = "${var.domain_name}"
  
    domain_name_configuration {
        certificate_arn = aws_acm_certificate.this.arn
        endpoint_type   = "REGIONAL"
        security_policy = "TLS_1_2"
    }

    depends_on = [aws_acm_certificate_validation.this]
}

resource "aws_apigatewayv2_api" "this" {
  name = "${var.domain_name}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_route" "this" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$default"
  target = "integrations/${aws_apigatewayv2_integration.this.id}"
}

resource "aws_apigatewayv2_route_response" "this" {
  api_id             = aws_apigatewayv2_api.this.id
  route_id           = aws_apigatewayv2_route.this.id
  route_response_key = "$default"
}

resource "aws_apigatewayv2_integration" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  integration_type = "MOCK"
}

resource "aws_apigatewayv2_deployment" "this" {
  api_id = aws_apigatewayv2_api.this.id
  depends_on = [aws_apigatewayv2_route.this, aws_apigatewayv2_integration.this]
  triggers = {
    redeployment = sha1(join(",", tolist([
      jsonencode(aws_apigatewayv2_integration.this),
      jsonencode(aws_apigatewayv2_route.this)
    ]
    )))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_apigatewayv2_stage" "this" {
  deployment_id = aws_apigatewayv2_deployment.this.id
  api_id   = aws_apigatewayv2_api.this.id
  name    = var.stage_name
}


data "aws_route53_zone" "this" {
  name         = var.root_domain_name
  private_zone = false
}


# Example DNS record using Route53.
# Route53 is not specifically required; any DNS host can be used.
resource "aws_route53_record" "this" {
  name    = aws_apigatewayv2_domain_name.this.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.this.zone_id 

  alias {
    evaluate_target_health = true
    name                   = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
    # name                   = aws_api_gateway_domain_name.this.regional_domain_name
    # zone_id                = aws_api_gateway_domain_name.this.regional_zone_id
  }
}