#!/bin/bash

# Martha Deployment Script
# This script builds the React app, deploys AWS infrastructure via SAM, and syncs files to S3

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="itsmartha-stack"
REGION="us-east-1"  # ACM certificates must be in us-east-1 for CloudFront
HOSTED_ZONE_ID="${HOSTED_ZONE_ID}"  # Set this as environment variable
ENVIRONMENT="${ENVIRONMENT:-production}"

echo -e "${GREEN}Starting Martha deployment...${NC}"

# Check if required tools are installed
command -v sam >/dev/null 2>&1 || { echo -e "${RED}SAM CLI is required but not installed. Install it from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html${NC}" >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo -e "${RED}AWS CLI is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is required but not installed.${NC}" >&2; exit 1; }

# Check if HOSTED_ZONE_ID is set
if [ -z "$HOSTED_ZONE_ID" ]; then
    echo -e "${YELLOW}HOSTED_ZONE_ID is not set. Trying to fetch it...${NC}"
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --query "HostedZones[?Name=='seibtribe.us.'].Id" --output text | cut -d'/' -f3)
    if [ -z "$HOSTED_ZONE_ID" ]; then
        echo -e "${RED}Could not find Hosted Zone ID for seibtribe.us. Please set HOSTED_ZONE_ID environment variable.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Found Hosted Zone ID: $HOSTED_ZONE_ID${NC}"
fi

# Step 1: Build React application
echo -e "${YELLOW}Building React application...${NC}"
npm install
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}Build failed. 'build' directory not found.${NC}"
    exit 1
fi

# Step 2: Build SAM application
echo -e "${YELLOW}Building SAM application...${NC}"
sam build \
    --template-file template.yaml \
    --region $REGION

# Step 3: Deploy SAM application (create changeset and execute)
echo -e "${YELLOW}Deploying infrastructure with SAM...${NC}"
sam deploy \
    --stack-name $STACK_NAME \
    --region $REGION \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        HostedZoneId=$HOSTED_ZONE_ID \
        Environment=$ENVIRONMENT \
    --no-fail-on-empty-changeset \
    --confirm-changeset

# Step 4: Get the S3 bucket name and CloudFront distribution ID from stack outputs
echo -e "${YELLOW}Fetching stack outputs...${NC}"
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" \
    --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
    --output text)

if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${RED}Failed to get bucket name or distribution ID from stack outputs.${NC}"
    exit 1
fi

echo -e "${GREEN}Bucket Name: $BUCKET_NAME${NC}"
echo -e "${GREEN}Distribution ID: $DISTRIBUTION_ID${NC}"

# Step 5: Copy sample images to public/img if they don't exist
echo -e "${YELLOW}Setting up sample images...${NC}"
if [ ! -d "public/img" ]; then
    mkdir -p public/img
fi

# Create sample placeholder images if actual images don't exist
for i in {1..8}; do
    if [ ! -f "public/img/art${i}.jpg" ]; then
        echo -e "${YELLOW}Creating placeholder for art${i}.jpg${NC}"
        # You should replace these with actual Martha's art images
        # For now, we'll create a note about it
        touch "public/img/art${i}.jpg.placeholder"
    fi
done

# Step 6: Sync files to S3
echo -e "${YELLOW}Syncing files to S3...${NC}"

# First, sync the build directory
aws s3 sync build/ s3://$BUCKET_NAME/ \
    --delete \
    --region $REGION \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.json" \
    --exclude "*.txt"

# Then sync files with shorter cache times
aws s3 cp build/index.html s3://$BUCKET_NAME/index.html \
    --region $REGION \
    --cache-control "public, max-age=300" \
    --content-type "text/html"

aws s3 sync build/ s3://$BUCKET_NAME/ \
    --region $REGION \
    --cache-control "public, max-age=3600" \
    --exclude "*" \
    --include "*.json" \
    --include "*.txt"

# Sync the img directory from public
if [ -d "public/img" ]; then
    echo -e "${YELLOW}Syncing images...${NC}"
    aws s3 sync public/img/ s3://$BUCKET_NAME/img/ \
        --region $REGION \
        --cache-control "public, max-age=86400" \
        --exclude "*.placeholder"
fi

# Step 7: Create CloudFront invalidation
echo -e "${YELLOW}Creating CloudFront invalidation...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query "Invalidation.Id" \
    --output text)

echo -e "${GREEN}Invalidation created with ID: $INVALIDATION_ID${NC}"

# Step 8: Wait for invalidation to complete (optional)
echo -e "${YELLOW}Waiting for CloudFront invalidation to complete (this may take a few minutes)...${NC}"
aws cloudfront wait invalidation-completed \
    --distribution-id $DISTRIBUTION_ID \
    --id $INVALIDATION_ID

# Success message
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Website URL: $WEBSITE_URL${NC}"
echo -e "${GREEN}CloudFront Distribution ID: $DISTRIBUTION_ID${NC}"
echo -e "${GREEN}S3 Bucket: $BUCKET_NAME${NC}"
echo -e "${YELLOW}Note: DNS propagation may take up to 48 hours.${NC}"
echo -e "${YELLOW}Note: Please add your actual art images to the public/img/ directory.${NC}"