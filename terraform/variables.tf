variable "aws_region" {
  description = "AWS Region to deploy resources"
  type        = string
}

variable "sender_email" {
  description = "The email address to send emails from (must be verified in AWS SES)"
  type        = string
}

variable "sender_name" {
  description = "The display name for the sender"
  type        = string
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
}

variable "api_token" {
  description = "Shared secret token for API authentication"
  type        = string
  sensitive   = true
}
