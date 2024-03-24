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
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  endpoints {
    s3       = "http://127.0.0.1:4566"
    iam      = "http://127.0.0.1:4566"
    lambda   = "http://127.0.0.1:4566"
    dynamodb = "http://127.0.0.1:4566"
  }
}

# Create Bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "credentials"
}

resource "aws_s3_bucket_public_access_block" "bucket_public_access_block" {
  bucket                  = aws_s3_bucket.bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  depends_on              = [aws_s3_bucket.bucket]
}

resource "aws_iam_role" "lambda_iam" {
  name = "lambda_iam_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_iam.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "s3:*"
        ],
        "Effect" : "Allow",
        "Resource" : "*"
      }
    ]
  })
}

# Creating Lambda resource
resource "aws_lambda_function" "lambda" {
  function_name = "digest-csv"
  role          = aws_iam_role.lambda_iam.arn
  handler       = "lambda/index.handler"
  runtime       = "nodejs20.x"
  timeout       = "60"
  filename      = "./lambda.zip"
}

resource "aws_s3_bucket_notification" "aws-lambda-trigger" {
  bucket = aws_s3_bucket.bucket.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda.arn
    events              = ["s3:ObjectCreated:*"]
  }
}
resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.bucket.id}"
}

resource "aws_dynamodb_table" "dynamodb_table" {
  name         = "credentials"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "identifier_code"
  attribute {
    name = "identifier_code"
    type = "S"
  }
}

resource "aws_iam_policy" "lambda_dynamodb_access" {
  name        = "lambda_dynamodb_access_policy"
  description = "IAM policy for accessing DynamoDB from Lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = [
        "dynamodb:PutItem",
      ],
      Effect   = "Allow",
      Resource = aws_dynamodb_table.dynamodb_table.arn,
    }],
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attach" {
  role       = aws_iam_role.lambda_iam.id
  policy_arn = aws_iam_policy.lambda_dynamodb_access.arn
}
