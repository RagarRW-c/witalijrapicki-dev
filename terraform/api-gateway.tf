########################################
# API Gateway – REST API
########################################
resource "aws_api_gateway_rest_api" "contact_api" {
  name        = "contact-form-api"
  description = "API do formularza kontaktowego z załącznikiem"

  binary_media_types = ["*/*", "multipart/form-data"]  # Explicit binary + multipart

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact_form.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.contact_api.execution_arn}/*/*"
}

########################################
# Resource: /contact
########################################
resource "aws_api_gateway_resource" "contact" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  parent_id   = aws_api_gateway_rest_api.contact_api.root_resource_id
  path_part   = "contact"
}

########################################
# POST /contact
########################################
resource "aws_api_gateway_method" "contact_post" {
  rest_api_id      = aws_api_gateway_rest_api.contact_api.id
  resource_id      = aws_api_gateway_resource.contact.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = false  # Explicit – no API key

  request_parameters = {
    "method.request.header.Content-Type" = true
  }
}

resource "aws_api_gateway_integration" "contact_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.contact_api.id
  resource_id             = aws_api_gateway_resource.contact.id
  http_method             = aws_api_gateway_method.contact_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contact_form.invoke_arn

  request_templates = {
    "application/json" = jsonencode({})  # Passthrough for FormData
  }

  content_handling = "CONVERT_TO_BINARY"  # For attachments
}

# POST 200 response (CORS headers)
resource "aws_api_gateway_method_response" "post_200" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact.id
  http_method = aws_api_gateway_method.contact_post.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "post_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact.id
  http_method = aws_api_gateway_method.contact_post.http_method
  status_code = aws_api_gateway_method_response.post_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.post_200
  ]
}

########################################
# OPTIONS /contact – preflight CORS
########################################
resource "aws_api_gateway_method" "contact_options" {
  rest_api_id      = aws_api_gateway_rest_api.contact_api.id
  resource_id      = aws_api_gateway_resource.contact.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false  # Explicit

  request_parameters = {
    "method.request.header.Access-Control-Request-Headers" = true
    "method.request.header.Access-Control-Request-Method"  = true
    "method.request.header.Origin"                         = true
  }
}

resource "aws_api_gateway_integration" "contact_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact.id
  http_method = aws_api_gateway_method.contact_options.http_method

  type = "MOCK"

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact.id
  http_method = aws_api_gateway_method.contact_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id
  resource_id = aws_api_gateway_resource.contact.id
  http_method = aws_api_gateway_method.contact_options.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.options_200
  ]
}

########################################
# Deployment + Stage (z triggers dla auto-redeploy)
########################################
resource "aws_api_gateway_deployment" "contact_deployment" {
  rest_api_id = aws_api_gateway_rest_api.contact_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_method.contact_post.id,
      aws_api_gateway_integration.contact_lambda.id,
      aws_api_gateway_method.contact_options.id,
      aws_api_gateway_integration.contact_options_integration.id,
      aws_api_gateway_method_response.post_200.id,
      aws_api_gateway_integration_response.post_integration_response.id,
      aws_api_gateway_method_response.options_200.id,
      aws_api_gateway_integration_response.options_integration_response.id,
      aws_api_gateway_resource.contact.id,
      aws_api_gateway_rest_api.contact_api.binary_media_types,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "prod" {
  rest_api_id   = aws_api_gateway_rest_api.contact_api.id
  deployment_id = aws_api_gateway_deployment.contact_deployment.id
  stage_name    = "prod"

  xray_tracing_enabled = true  # Opcjonalnie – dla logów w CloudWatch

  depends_on = [aws_api_gateway_deployment.contact_deployment]
}

########################################
# Output
########################################
output "api_gateway_endpoint" {
  description = "Full URL for contact form endpoint (POST /contact)"
  value       = "${aws_api_gateway_stage.prod.invoke_url}/contact"
}