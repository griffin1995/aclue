#!/bin/bash

# API Testing Master Script for Aclue Backend
# Comprehensive automated testing across multiple tools

# Ensure exit on any error
set -e

# Create output directory for reports
mkdir -p /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports

# Configuration Variables
PROD_API_URL="https://aclue-backend-production.up.railway.app"
LOCAL_API_URL="http://localhost:8000"
OPENAPI_SPEC="/api/v1/openapi.json"

# 1. Schemathesis Testing
echo "Running Schemathesis Tests..."
st run $PROD_API_URL$OPENAPI_SPEC \
    --checks all \
    --workers 4 \
    --max-examples 500 \
    --validate-schema=true \
    --output /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports/schemathesis_report.json

# 2. Dredd Contract Testing
echo "Running Dredd Contract Tests..."
dredd $OPENAPI_SPEC $PROD_API_URL \
    --output /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports/dredd_report.xml

# 3. APIFuzzer Vulnerability Scanning
echo "Running APIFuzzer Vulnerability Scan..."
python -m APIFuzzer \
    -s $PROD_API_URL$OPENAPI_SPEC \
    -o /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports/apifuzzer_report.json

# 4. Newman (Postman) Collection Runner
echo "Running Newman API Tests..."
newman run /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/postman_collection.json \
    -r cli,json \
    --reporter-json-export /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports/newman_report.json

# 5. Tavern API Tests
echo "Running Tavern API Tests..."
tavern-ci \
    --stdout \
    --log-dir /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports \
    /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/tavern_tests.yaml

# Compile Summary Report
python /home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/compile_reports.py

echo "API Testing Complete. Check reports in /reports directory."