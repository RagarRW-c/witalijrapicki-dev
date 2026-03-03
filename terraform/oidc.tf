# oidc.tf

# OIDC provider dla GitHub
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# IAM role dla GitHub Actions – trust na OIDC
resource "aws_iam_role" "github_actions_role" {
  name = "github-actions-deploy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn  # Fix: data source reference
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:RagarRW-c/witalijrapicki-dev:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}

# Policy do S3 sync + CloudFront invalidate
resource "aws_iam_policy" "deploy_policy" {
  name = "github-actions-deploy-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.website_bucket.arn}",
          "${aws_s3_bucket.website_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = "cloudfront:CreateInvalidation"
        Resource = aws_cloudfront_distribution.cdn.arn
      }
    ]
  })
}

# Attach policy do role
resource "aws_iam_role_policy_attachment" "deploy_attach" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.deploy_policy.arn
}