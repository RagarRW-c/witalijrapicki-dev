variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "eu-central-1"
}

variable "domain_name" {
  description = "Domena do weryfikacji SES"
  type        = string
  default     = "witalijrapicki.cloud"
}

variable "zone_id" {
  type = string
  default = ""
}

variable "ses_email" {
  type = string
  default = "witalij.rapicki@gmail.com"
}

