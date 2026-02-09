# API Gateway – REST API z endpointem POST /contact
resource "aws_api_gateway_rest_api" "contact_api" {
  name        = "contact-form-api"
  description = "API do formularza kontaktowego z załącznikiem"
}

# Resource /contact
resource "aws_api_gateway_resource" "contact" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  parent_id   = aws_api_gateway_rest_api.contact_api.root_resource_id
  path_part   = "contact"
}

# Metoda POST /contact
resource "aws_api_gateway_method" "contact_post" {
  rest_api_id   = aws_api_gateway_rest_api.contact_api.id
  resource_id   = aws_api_gateway_resource.contact.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integracja z Lambdą
resource "aws_api_gateway_integration" "contact_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.contact_api.id
  resource_id             = aws_api_gateway_resource.contact.id
  http_method             = aws_api_gateway_method.contact_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contact_form.invoke_arn
}

# Uprawnienia dla API Gateway do wywoływania Lambdy
resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact_form.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.contact_api.execution_arn}/*/*"
}

# Deployment API Gateway – bez stage_name
resource "aws_api_gateway_deployment" "contact_deployment" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id

  # Triggers – redeploy przy każdej zmianie w API
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.contact.id,
      aws_api_gateway_method.contact_post.id,
      aws_api_gateway_integration.contact_lambda.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Stage "prod" – osobny zasób
resource "aws_api_gateway_stage" "prod" {
  rest_api_id   = aws_api_gateway_rest_api.contact_api.id
  deployment_id = aws_api_gateway_deployment.contact_deployment.id
  stage_name    = "prod"

  depends_on = [aws_api_gateway_deployment.contact_deployment]
}

# Output – pełny URL endpointu
output "api_gateway_endpoint" {
  description = "Pełny URL endpointu formularza (POST /contact)"
  value       = "${aws_api_gateway_stage.prod.invoke_url}/contact"
}