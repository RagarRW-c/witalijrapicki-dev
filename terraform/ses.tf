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

