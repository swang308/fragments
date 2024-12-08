# scripts/local-aws-setup.sh

# Set up AWS environment variables for LocalStack and DynamoDB Local
echo "Setting up AWS environment variables for LocalStack and DynamoDB Local..."
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_SESSION_TOKEN=test
export AWS_DEFAULT_REGION=us-east-1

# Print environment variable details for verification
echo "AWS environment variables configured:"
echo "  AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "  AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "  AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN"
echo "  AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION"

# Wait for LocalStack S3 service to be ready
echo "Waiting for LocalStack S3 to be ready..."
until curl --silent http://localhost:4566/_localstack/health | grep "\"s3\": \"\(running\|available\)\"" > /dev/null; do
    sleep 5
done
echo "LocalStack S3 is ready."

# Create an S3 bucket in LocalStack
BUCKET_NAME="fragments"
echo "Creating LocalStack S3 bucket: $BUCKET_NAME..."
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket $BUCKET_NAME
echo "S3 bucket '$BUCKET_NAME' created successfully."

# Set up DynamoDB table in DynamoDB Local
DYNAMODB_TABLE_NAME="fragments"
echo "Creating DynamoDB table: $DYNAMODB_TABLE_NAME..."
aws --endpoint-url=http://localhost:8000 \
    dynamodb create-table \
    --table-name $DYNAMODB_TABLE_NAME \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5
echo "DynamoDB table '$DYNAMODB_TABLE_NAME' created successfully."

# Wait for the DynamoDB table to exist
echo "Waiting for DynamoDB table '$DYNAMODB_TABLE_NAME' to be ready..."
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name $DYNAMODB_TABLE_NAME
echo "DynamoDB table '$DYNAMODB_TABLE_NAME' is ready."

echo "Local AWS setup completed successfully."
