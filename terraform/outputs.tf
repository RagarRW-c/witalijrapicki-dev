# Outputs – użyj w GitHub Actions
output "s3_bucket_name" {
  value = aws_s3_bucket.website_bucket.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions_role.arn  # Z oidc.tf
}

# Outputy – rekordy DNS do dodania ręcznie w OVH
output "dkim_cname_records" {
  description = "3 rekordy CNAME - dodac w OVH dla DKIM"
  value = [
    for token in aws_ses_domain_dkim.main_dkim.dkim_tokens : {
      name  = "${token}._domainkey.${var.domain_name}"
      type  = "CNAME"
      value = "${token}.dkim.amazonses.com"
      ttl   = 3600
    }
  ]
}

output "mail_from_mx_record" {
  description = "Rekord MX dla mail-from"
  value = {
    name     = aws_ses_domain_mail_from.main.mail_from_domain
    type     = "MX"
    value    = "feedback-smtp.${var.aws_region}.amazonses.com"
    priority = 10
  }
}

output "mail_from_txt_record" {
  description = "Rekord TXT SPF dla mail-from"
  value = {
    name  = aws_ses_domain_mail_from.main.mail_from_domain
    type  = "TXT"
    value = "v=spf1 include:amazonses.com ~all"
  }
}
# weryfkacja gmail
resource "aws_ses_email_identity" "gmail_recipient" {
  email = "witalij.rapicki@gmail.com"
}

output "ses_domain_identity_arn" {
  value = aws_ses_domain_identity.main.arn
}



output "gmail_identity_arn" {
  description = "ARN zweryfikowanego Gmaila"
  value       = aws_ses_email_identity.gmail_recipient.arn
}