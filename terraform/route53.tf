# Route 53 Hosted Zone – pełna strefa DNS dla domeny
resource "aws_route53_zone" "main" {
  name = var.domain_name

  comment = "Hosted Zone dla witalijrapicki.dev / .cloud – zarządzana przez Terraform"

  # Opcjonalnie – jeśli chcesz prywatną strefę (nie w Twoim przypadku)
  # vpc {
  #   vpc_id = "vpc-12345678"
  # }
}

# Output – serwery NS do zmiany w OVH
output "route53_name_servers" {
  description = "Te 4 serwery NS wpisz w panelu OVH (Serwery DNS)"
  value       = aws_route53_zone.main.name_servers
}

# Teraz dodajemy rekordy DKIM, SPF, MX, DMARC automatycznie (bo mamy Hosted Zone)

# DKIM – 3 rekordy CNAME
resource "aws_route53_record" "dkim" {
  count = 3

  zone_id = aws_route53_zone.main.zone_id
  name    = "${aws_ses_domain_dkim.main_dkim.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 3600
  records = ["${aws_ses_domain_dkim.main_dkim.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# Mail From – rekord MX
resource "aws_route53_record" "mail_from_mx" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mail.${var.domain_name}"
  type    = "MX"
  ttl     = 3600
  records = ["10 feedback-smtp.${var.aws_region}.amazonses.com"]
}

# Mail From – rekord TXT SPF
resource "aws_route53_record" "mail_from_txt" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mail.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["v=spf1 include:amazonses.com ~all"]
}

# DMARC – rekord TXT (opcjonalny, ale bardzo polecany)
resource "aws_route53_record" "dmarc" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["v=DMARC1; p=none; pct=100; rua=mailto:witalij.rapicki@gmail.com; sp=none; aspf=r;"]
}