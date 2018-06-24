variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "enhancedsociety-terraform"
    key    = "ypb-website"
    region = "ap-southeast-2"
  }
}

locals {
  common_tags = {
    Terraform   = "true"
  }
}

provider "aws" {
  version = "~> 1.9.0"
  region = "${var.aws_region}"
}

resource "aws_acm_certificate" "cert" {
  domain_name = "ypbsystems.com"
  subject_alternative_names = ["*.ypbsystems.com"]
  validation_method = "EMAIL"
  tags = "${local.common_tags}"
}

resource "aws_acm_certificate" "cert-www" {
  domain_name = "ypb.ypbsystems.com"
  subject_alternative_names = ["*.ypb.ypbsystems.com"]
  validation_method = "EMAIL"
  tags = "${local.common_tags}"
}

resource "aws_cloudfront_distribution" "ypb_distribution" {
  origin {
    domain_name = "ypb-orig.ypbsystems.com"
    origin_id = "ID-ypb-orig.ypbsystems.com"
    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port = "80"
      https_port = "443"
      origin_ssl_protocols = [
        "TLSv1"]
    }

  }
  aliases = ["www.ypb.ypbsystems.com", "ypb.ypbsystems.com"]
  enabled = true
  tags = "${local.common_tags}"

  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
      "OPTIONS",
      "PUT",
      "POST",
      "PATCH",
      "DELETE"]
    cached_methods = [
      "GET",
      "HEAD"]
    target_origin_id = "ID-ypb-orig.ypbsystems.com"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 3600 # increase this after testing
    compress               = true
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = "${aws_acm_certificate.cert-www.arn}"
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}
