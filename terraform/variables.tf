variable "aws_region" {
  description = "AWS Region to deploy resources"
  type        = string
  default     = "us-west-2"
}

variable "sender_email" {
  description = "The email address to send emails from (must be verified in AWS SES)"
  type        = string
}

variable "sender_name" {
  description = "The display name for the sender"
  type        = string
  default     = "Scramble 入会調整担当"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "kintone-email-sender"
}

variable "api_token" {
  description = "Shared secret token for API authentication"
  type        = string
  sensitive   = true
}
