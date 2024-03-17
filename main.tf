terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "123"
  secret_key                  = "123"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  endpoints {
    s3 = "http://127.0.0.1:4566"
  }
}

# Create Bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "credentials"
}

resource "aws_s3_bucket_public_access_block" "bucket_public_access_block" {
  bucket                  = aws_s3_bucket.bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  depends_on              = [aws_s3_bucket.bucket]
}
