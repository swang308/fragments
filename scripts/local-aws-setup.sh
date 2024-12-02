#!/bin/sh

# Setup AWS environment variables for LocalStack and DynamoDB Local
echo "Setting AWS environment variables for LocalStack and DynamoDB Local"

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_SESSION_TOKEN=test
export AWS_DEFAULT_REGION=us-east-1

echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN"
echo "AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION"

# Wait for LocalStack S3 service to be ready
echo 'Waiting for LocalStack S3 to be ready...'
until (curl --silent http://localhost:4566/_localstack/health | grep "\"s3\": \"\(running\|available\)\"" > /dev/null); do
    sleep 5
done
echo 'LocalStack S3 is ready.'

# Create an S3 bucket with LocalStack
BUCKET_NAME="fragments"
echo "Creating LocalStack S3 bucket: $BUCKET_NAME"
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket $BUCKET_NAME
echo "S3 bucket '$BUCKET_NAME' created."

# Check if DynamoDB table 'fragments' already exists
TABLE_NAME="fragments"
echo "Checking if DynamoDB table '$TABLE_NAME' exists..."
if aws --endpoint-url=http://localhost:8000 dynamodb describe-table --table-name $TABLE_NAME > /dev/null 2>&1; then
    echo "DynamoDB table '$TABLE_NAME' already exists. Skipping creation."
else
    # Create DynamoDB table with Local DynamoDB
    echo "Creating DynamoDB table '$TABLE_NAME'..."
    aws --endpoint-url=http://localhost:8000 dynamodb create-table \
        --table-name $TABLE_NAME \
        --attribute-definitions \
            AttributeName=ownerId,AttributeType=S \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=ownerId,KeyType=HASH \
            AttributeName=id,KeyType=RANGE \
        --provisioned-throughput \
            ReadCapacityUnits=10,WriteCapacityUnits=5

    # Wait for the table to exist
    echo "Waiting for DynamoDB table '$TABLE_NAME' to exist..."
    aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name $TABLE_NAME
    echo "DynamoDB table '$TABLE_NAME' is ready."
fi

echo "Local AWS setup completed successfully."
