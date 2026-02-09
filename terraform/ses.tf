# SES – weryfikacja całej domeny (najlepsza praktyka)
resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

# DKIM – generuje 3 rekordy CNAME do dodania w OVH
resource "aws_ses_domain_dkim" "main_dkim" {
  domain = aws_ses_domain_identity.main.domain
}

# Mail From subdomain (poprawia dostarczalność)
resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "mail.${aws_ses_domain_identity.main.domain}"
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