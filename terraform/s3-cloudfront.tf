# s3-cloudfront.tf

# S3 bucket dla static website
resource "aws_s3_bucket" "website_bucket" {
  bucket        = "witalijrapicki.cloud-static"  # Unikalna nazwa oparta na domenie – unikaj kropki w nazwie bucket dla HTTPS
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"  # Dodaj plik 404.html do /out w Next.js jeśli chcesz custom
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  depends_on = [ aws_s3_bucket_public_access_block.public_access ]
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# ACM cert dla SSL (CloudFront wymaga US East 1)
provider "aws" {
  alias  = "acm"
  region = "us-east-1"
}

resource "aws_acm_certificate" "cert" {
  provider = aws.acm

  domain_name       = "witalijrapicki.cloud"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Route53 validation rekord dla ACM (używa Twojej zone)
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id  # Twoja istniejąca zone z route53.tf
}

resource "aws_acm_certificate_validation" "cert_valid" {
  provider = aws.acm

  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# OAI dla CloudFront do S3 (bezpieczeństwo – tylko CloudFront ma dostęp)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for witalijrapicki.cloud"
}

# S3 policy dla OAI (tylko CloudFront może czytać)
resource "aws_s3_bucket_policy" "oai_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.website_bucket.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["witalijrapicki.cloud"]  # Twoja domena

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert_valid.certificate_arn
    ssl_support_method  = "sni-only"
  }

  # Custom error pages (404)
  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 0
  }
}

# Route53 rekord A do CloudFront (alias)
resource "aws_route53_record" "website" {
  zone_id = aws_route53_zone.main.zone_id  # Twoja istniejąca zone

  name = "witalijrapicki.cloud"
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

