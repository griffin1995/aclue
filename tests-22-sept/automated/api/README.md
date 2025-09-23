# Aclue API Automated Testing Suite

## Overview
This comprehensive API testing suite uses multiple tools to validate the Aclue backend API's reliability, performance, and security.

## Tools Deployed
- Schemathesis: Automatic test generation from OpenAPI spec
- Dredd: API documentation contract validation
- APIFuzzer: Vulnerability and edge case testing
- Newman (Postman CLI): Automated collection runs
- Tavern: YAML-based API testing

## Setup
1. Install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
npm install -g dredd newman
```

2. Run tests:
```bash
chmod +x run_api_tests.sh
./run_api_tests.sh
```

## Test Configurations
- 500+ test examples per endpoint
- Contract compliance checks
- Vulnerability scanning
- Performance testing

## Reports
Test reports are generated in the `/reports` directory.
- Schemathesis: Detailed JSON report
- Dredd: XML validation report
- APIFuzzer: Vulnerability scan
- Newman: Postman collection results
- Comprehensive summary report

## Important Endpoints Tested
- Authentication: Register, Login, Refresh
- Product Endpoints
- Recommendations
- Newsletter Subscription