terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.27.0"
    }
  }
}

provider "aws" {
    alias = "lambda_edge"  
    region = "us-east-1"
}

resource "aws_lambda_function" "this" {
    filename = data.archive_file.lambda_zip_inline.output_path
    source_code_hash = data.archive_file.lambda_zip_inline.output_base64sha256
    function_name = var.function_name // Auth Lambda
    role          = aws_iam_role.this.arn
    handler       = "index.handler" // index.handler
    runtime        = "nodejs12.x"
    memory_size    = "128"
    timeout = "5"
    publish = true
    provider      = aws.lambda_edge

    depends_on = [aws_cloudwatch_log_group.this]
}

resource "aws_lambda_permission" "edgeLambda" {
  provider      = aws.lambda_edge
  statement_id  = "AllowExecutionFromCloudFront"
  action        = "lambda:GetFunction"
  function_name = aws_lambda_function.this.arn
  principal     = "replicator.lambda.amazonaws.com"
  
  depends_on = [aws_lambda_function.this]
}

data "archive_file" "lambda_zip_inline" {
  type        = "zip"
  output_path = "./modules/edgeLambda/src/auth_edge_lambda.zip"
  source {
    content  = <<EOF
      module.exports.handler = (event, context, callback) => {
        
          // Get the request and its headers
          const request = event.Records[0].cf.request;
          const headers = request.headers;

          // Specify the username and password to be used
          const user = "${var.auth_username}"
          const pw = "${var.auth_password}"

          // Build a Basic Authentication string
          const authString = 'Basic ' + new Buffer(user + ':' + pw).toString('base64');

          // Challenge for auth if auth credentials are absent or incorrect
          if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
              const response = {
                  status: '401',
                  statusDescription: 'Unauthorized',
                  body: 'Unauthorized',
                  headers: {
                      'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }]
                  },
              };
              callback(null, response);
          }

          // User has authenticated
          callback(null, request);
      };
EOF
    filename = "index.js"
  }
}


# data "archive_file" "lambda_zip" {
#   type        = "zip"
#   source_file = "./modules/edgeLambda/src/index.js" // ./terraform/lambda/index.js
#   output_path = "./modules/edgeLambda/src/auth_edge_lambda.zip" // ./terraform/lambda.zip
# }

# Cloud watch
resource aws_cloudwatch_log_group this {
  name              = var.function_name
  retention_in_days = 1
}
