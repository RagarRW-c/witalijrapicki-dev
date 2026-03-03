# lambda - funkcja wysylajaca maim z formularza
resource "aws_lambda_function" "contact_form" {
  function_name = "contact-form-handler"
  role          = aws_iam_role.lambda_ses_role.arn
  handler       = "index.handler"
  runtime       = "python3.12"
  publish = true

  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  lifecycle {
    ignore_changes = []   # opcjonalnie – jeśli chcesz ręcznie zarządzać ZIP
  }
  environment {
    variables = {
      TO_EMAIL   = "witalij.rapicki@gmail.com" 
      FROM_EMAIL = "no-reply@witalijrapicki.cloud" 
    }
  }
}

#zip z kodem lambda
data "archive_file" "lambda_zip" {
  type = "zip"
  source_file = "lambda/index.py"
  output_path = "lambda/contact-form.zip"
}

#iam role dla lamdby - uprawnienia do ses
resource "aws_iam_role" "lambda_ses_role" {
  name = "lambda-ses-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

#policy dla lambda ses
resource "aws_iam_role_policy" "lambda_ses_policy" {
  role = aws_iam_role.lambda_ses_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}