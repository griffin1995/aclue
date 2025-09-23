#!/usr/bin/env python3
"""
aclue Platform - Integration Test Suite

Quick integration tests to validate core functionality after configuration changes.
Tests authentication flow, API connectivity, and basic functionality.

Usage:
    python integration_test_suite.py [--verbose]
"""

import requests
import json
import argparse
import sys
from datetime import datetime

class aclueIntegrationTester:
    """Integration test suite for aclue platform"""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.base_url = "https://aclue-backend-production.up.railway.app"
        self.test_results = []

    def log(self, message: str, level: str = "INFO"):
        """Log test messages"""
        if self.verbose or level in ["ERROR", "PASS", "FAIL"]:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] {level}: {message}")

    def test_backend_health(self):
        """Test backend health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                self.log("Backend health check successful", "PASS")
                return True
            else:
                self.log(f"Backend health check failed: {response.status_code}", "FAIL")
                return False
        except Exception as e:
            self.log(f"Backend health check error: {str(e)}", "FAIL")
            return False

    def test_authentication_flow(self):
        """Test authentication endpoints"""
        try:
            # Test login with known working credentials
            login_data = {
                "email": "john.doe@example.com",
                "password": "password123"
            }

            response = requests.post(
                f"{self.base_url}/api/v1/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.log("Authentication flow successful", "PASS")
                    return True, data.get("access_token")
                else:
                    self.log("Authentication response missing required fields", "FAIL")
                    return False, None
            else:
                self.log(f"Authentication failed: {response.status_code} - {response.text}", "FAIL")
                return False, None

        except Exception as e:
            self.log(f"Authentication test error: {str(e)}", "FAIL")
            return False, None

    def test_protected_endpoint(self, access_token: str):
        """Test protected endpoint with authentication"""
        try:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }

            response = requests.get(
                f"{self.base_url}/api/v1/auth/me",
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                if "email" in data:
                    self.log("Protected endpoint access successful", "PASS")
                    return True
                else:
                    self.log("Protected endpoint response invalid", "FAIL")
                    return False
            else:
                self.log(f"Protected endpoint failed: {response.status_code}", "FAIL")
                return False

        except Exception as e:
            self.log(f"Protected endpoint test error: {str(e)}", "FAIL")
            return False

    def test_frontend_accessibility(self):
        """Test frontend accessibility"""
        try:
            response = requests.get("https://aclue.app", timeout=10)
            if response.status_code == 200:
                self.log("Frontend accessibility successful", "PASS")
                return True
            else:
                self.log(f"Frontend accessibility failed: {response.status_code}", "FAIL")
                return False
        except Exception as e:
            self.log(f"Frontend accessibility error: {str(e)}", "FAIL")
            return False

    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            headers = {
                "Origin": "https://aclue.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            }

            response = requests.options(
                f"{self.base_url}/api/v1/auth/login",
                headers=headers,
                timeout=10
            )

            if response.status_code in [200, 204]:
                cors_header = response.headers.get("Access-Control-Allow-Origin")
                if cors_header:
                    self.log("CORS configuration working", "PASS")
                    return True
                else:
                    self.log("CORS headers missing", "FAIL")
                    return False
            else:
                self.log(f"CORS preflight failed: {response.status_code}", "FAIL")
                return False

        except Exception as e:
            self.log(f"CORS test error: {str(e)}", "FAIL")
            return False

    def run_integration_tests(self):
        """Run all integration tests"""
        self.log("Starting aclue platform integration tests...")

        tests_passed = 0
        total_tests = 0

        # Test 1: Backend Health
        total_tests += 1
        if self.test_backend_health():
            tests_passed += 1

        # Test 2: Frontend Accessibility
        total_tests += 1
        if self.test_frontend_accessibility():
            tests_passed += 1

        # Test 3: Authentication Flow
        total_tests += 1
        auth_success, access_token = self.test_authentication_flow()
        if auth_success:
            tests_passed += 1

        # Test 4: Protected Endpoint (only if auth succeeded)
        if access_token:
            total_tests += 1
            if self.test_protected_endpoint(access_token):
                tests_passed += 1

        # Test 5: CORS Configuration
        total_tests += 1
        if self.test_cors_configuration():
            tests_passed += 1

        # Summary
        success_rate = (tests_passed / total_tests) * 100 if total_tests > 0 else 0

        print("\n" + "="*60)
        print("ACLUE PLATFORM INTEGRATION TEST RESULTS")
        print("="*60)
        print(f"Tests Passed: {tests_passed}/{total_tests}")
        print(f"Success Rate: {success_rate:.1f}%")

        if tests_passed == total_tests:
            print("✅ ALL INTEGRATION TESTS PASSED")
            print("🚀 Platform ready for production use")
            return True
        else:
            print("❌ SOME INTEGRATION TESTS FAILED")
            print("🔧 Review failed tests before deployment")
            return False

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="aclue Platform Integration Test Suite"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    args = parser.parse_args()

    # Run integration tests
    tester = aclueIntegrationTester(verbose=args.verbose)
    success = tester.run_integration_tests()

    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()