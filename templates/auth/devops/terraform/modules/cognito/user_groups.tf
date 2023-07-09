resource "aws_iam_role" "this" {
  name = "${var.service_name}-${var.stage_name}-ffmAndClientRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
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
    }
  ]
}
EOF
}

resource "aws_cognito_user_group" "admin" {
  name         = "${var.service_name}-${var.stage_name}-admin"
  user_pool_id = aws_cognito_user_pool.this.id
  description  = "Admin Role"
  role_arn     = aws_iam_role.this.arn
}

resource "aws_cognito_user_group" "customer" {
  name         = "${var.service_name}-${var.stage_name}-customer"
  user_pool_id = aws_cognito_user_pool.this.id
  description  = "Client Role"
  role_arn     = aws_iam_role.this.arn
}