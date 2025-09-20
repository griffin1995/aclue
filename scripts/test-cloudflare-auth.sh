#!/bin/bash

# Test Cloudflare API Authentication
# This script helps diagnose Cloudflare API token issues

echo "🔐 Testing Cloudflare API Authentication..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if secrets are provided
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}ERROR: CLOUDFLARE_API_TOKEN environment variable is not set${NC}"
    echo "Please export your Cloudflare API token:"
    echo "export CLOUDFLARE_API_TOKEN='your_token_here'"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo -e "${RED}ERROR: CLOUDFLARE_ACCOUNT_ID environment variable is not set${NC}"
    echo "Please export your Cloudflare account ID:"
    echo "export CLOUDFLARE_ACCOUNT_ID='your_account_id_here'"
    exit 1
fi

echo "✅ Environment variables are set"
echo "Token format: ${CLOUDFLARE_API_TOKEN:0:8}...${CLOUDFLARE_API_TOKEN: -4}"
echo "Account ID: ${CLOUDFLARE_ACCOUNT_ID:0:8}...${CLOUDFLARE_ACCOUNT_ID: -4}"
echo ""

# Test 1: Verify token is valid
echo "🧪 Test 1: Verifying API token..."
response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json")

success=$(echo $response | jq -r '.success // false')
if [ "$success" = "true" ]; then
    echo -e "${GREEN}✅ API token is valid${NC}"
    token_status=$(echo $response | jq -r '.result.status')
    echo "Token status: $token_status"
else
    echo -e "${RED}❌ API token is invalid or expired${NC}"
    echo "Response: $response"
    echo ""
    echo -e "${YELLOW}🔄 How to fix:${NC}"
    echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Create a new API token with these permissions:"
    echo "   - Zone:Zone:Read"
    echo "   - Zone:Page Rules:Edit"
    echo "   - Account:Cloudflare Pages:Edit" 
    echo "3. Update your GitHub secrets with the new token"
    exit 1
fi

# Test 2: Check account access
echo ""
echo "🧪 Test 2: Checking account access..."
response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json")

success=$(echo $response | jq -r '.success // false')
if [ "$success" = "true" ]; then
    echo -e "${GREEN}✅ Account access is valid${NC}"
    account_name=$(echo $response | jq -r '.result.name')
    echo "Account name: $account_name"
else
    echo -e "${RED}❌ Cannot access account${NC}"
    echo "Response: $response"
    exit 1
fi

# Test 3: Check Pages project access
echo ""
echo "🧪 Test 3: Checking Cloudflare Pages project 'aclue'..."
response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/aclue" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json")

success=$(echo $response | jq -r '.success // false')
if [ "$success" = "true" ]; then
    echo -e "${GREEN}✅ Can access Cloudflare Pages project 'aclue'${NC}"
    project_name=$(echo $response | jq -r '.result.name')
    project_subdomain=$(echo $response | jq -r '.result.subdomain')
    echo "Project name: $project_name"
    echo "Project subdomain: $project_subdomain"
else
    echo -e "${RED}❌ Cannot access Cloudflare Pages project 'aclue'${NC}"
    echo "Response: $response"
    echo ""
    echo -e "${YELLOW}🔄 Possible fixes:${NC}"
    echo "1. Ensure the project name is correct in the workflow (currently: aclue)"
    echo "2. Verify the API token has Cloudflare Pages:Edit permissions"
    echo "3. Check if the project exists in your Cloudflare account"
fi

echo ""
echo "🎯 Authentication test complete!"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo "- If all tests pass, the authentication should work in GitHub Actions"
echo "- If any test fails, follow the fix instructions above"
echo "- Update your GitHub repository secrets with the correct values"