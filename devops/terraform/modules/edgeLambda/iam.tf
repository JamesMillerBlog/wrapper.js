resource "aws_iam_role" "this" {
  name               = "${var.function_name}-role"
  assume_role_policy = data.template_file.assume_role_policy.rendered
}

# resource "aws_iam_role_policy_attachment" "this" {
#   role       = aws_iam_role.this.name
#   policy_arn = var.s3_policy_arn
# }

// define edge lambda assume role policy
data "template_file" "assume_role_policy" {
  template = file("${path.module}/assume_execution_role.json")
}

// define edge lambda iam role policy
data "template_file" "iam_role_policy" {
  template = file("${path.module}/iam_role_execution_policy.json")

  vars = {
    aws_lambda_function_arn = aws_lambda_function.this.arn
  }
}

resource aws_iam_policy "logs" {
  name   = "${var.function_name}-logs"
  policy = data.template_file.iam_role_policy.rendered
}

resource "aws_iam_policy_attachment" "logs" {
  name       = "${var.function_name}-logs"
  roles   = [aws_iam_role.this.id]
  # roles      = [aws_iam_role.lambda.name]
  policy_arn = aws_iam_policy.logs.arn
}