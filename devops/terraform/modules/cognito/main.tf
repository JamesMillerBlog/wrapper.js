resource "aws_cognito_user_pool" "this" {
  name = "${var.service_name}-${var.stage_name}-pool"
}

resource "aws_cognito_user_pool_client" "this" {
  name = "${var.service_name}-${var.stage_name}-client"

  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_identity_pool" "this" {
  identity_pool_name               = "${var.service_name}_${var.stage_name}_identity_pool"
  allow_unauthenticated_identities = false
  developer_provider_name          = var.domain_name

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = "cognito-idp.eu-west-2.amazonaws.com/${aws_cognito_user_pool.this.id}"
    server_side_token_check = false
  }
}

resource "aws_iam_role" "authenticated" {
  name = "${var.service_name}-${var.stage_name}-cognito_authenticated"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.this.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role" "unauthenticated" {
  name = "${var.service_name}-${var.stage_name}-cognito_unauthenticated"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "authenticated" {
  name = "${var.service_name}-${var.stage_name}-authenticated_policy"
  role = aws_iam_role.authenticated.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "mobileanalytics:PutEvents",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "cognito-sync:*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "cognito-identity:*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "lambda:InvokeFunction",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:GetAccessKeyLastUsed",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:ListRoles",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "unauthenticated" {
  name = "${var.service_name}-${var.stage_name}-unauthenticated_policy"
  role = aws_iam_role.unauthenticated.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "cognito-identity:*",
      "Resource": "*"
    },
    {
      "Effect": "Deny",
      "Action": "lambda:InvokeFunction",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_cognito_identity_pool_roles_attachment" "this" {
  identity_pool_id = aws_cognito_identity_pool.this.id

  roles = {
    authenticated   = aws_iam_role.authenticated.arn
    unauthenticated = aws_iam_role.unauthenticated.arn
  }
}
