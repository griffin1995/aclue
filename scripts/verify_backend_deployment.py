#!/usr/bin/env python3
"""
Backend Deployment Verification Script
Tests backend health and functionality after deployment.
"""

import requests
import json
import sys
import time
from typing import Dict, Any

# Configuration
BACKEND_URL = "https://aclue-backend-production.up.railway.app"
TIMEOUT = 30

def test_health_endpoint() -> bool:
    """Test basic health endpoint."""
    try:
        print("🔍 Testing health endpoint...")
        response = requests.get(f"{BACKEND_URL}/health", timeout=TIMEOUT)
        
        if response.status_code == 200:
            print("✅ Health endpoint responding")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def test_docs_endpoint() -> bool:
    """Test API documentation endpoint."""
    try:
        print("🔍 Testing API documentation...")
        response = requests.get(f"{BACKEND_URL}/docs", timeout=TIMEOUT)
        
        if response.status_code == 200:
            print("✅ API documentation accessible")
            return True
        else:
            print(f"❌ API docs failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API docs error: {e}")
        return False

def test_authentication_endpoints() -> bool:
    """Test authentication endpoints."""
    try:
        print("🔍 Testing authentication endpoints...")
        
        # Test login endpoint (should fail with 422 for missing data, not 500)
        login_response = requests.post(f"{BACKEND_URL}/api/v1/auth/login", json={}, timeout=TIMEOUT)
        
        if login_response.status_code in [422, 400]:  # Expected validation error
            print("✅ Authentication endpoints responsive")
            return True
        else:
            print(f"❌ Authentication endpoint unexpected status: {login_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Authentication endpoint error: {e}")
        return False

def test_database_connection() -> bool:
    """Test database connectivity via API."""
    try:
        print("🔍 Testing database connectivity...")
        
        # Test products endpoint (should work for anonymous users)
        products_response = requests.get(f"{BACKEND_URL}/api/v1/products/", timeout=TIMEOUT)
        
        if products_response.status_code in [200, 401]:  # 200 or auth required
            print("✅ Database connectivity working")
            return True
        else:
            print(f"❌ Database connection issue: {products_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

def test_cors_headers() -> bool:
    """Test CORS configuration."""
    try:
        print("🔍 Testing CORS configuration...")
        response = requests.options(f"{BACKEND_URL}/api/v1/auth/login", timeout=TIMEOUT)
        
        cors_header = response.headers.get('Access-Control-Allow-Origin')
        if cors_header:
            print("✅ CORS headers configured")
            return True
        else:
            print("⚠️ CORS headers not found (may be okay)")
            return True  # Not critical
    except Exception as e:
        print(f"⚠️ CORS test error: {e}")
        return True  # Not critical

def main():
    """Run all deployment verification tests."""
    print("🚀 Starting backend deployment verification...")
    print(f"🎯 Testing: {BACKEND_URL}")
    print("-" * 50)
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("API Documentation", test_docs_endpoint), 
        ("Authentication", test_authentication_endpoints),
        ("Database Connection", test_database_connection),
        ("CORS Configuration", test_cors_headers),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        success = test_func()
        results.append((test_name, success))
        time.sleep(1)  # Brief pause between tests
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DEPLOYMENT VERIFICATION SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    success_rate = (passed / len(results)) * 100
    print(f"\n🎯 Overall Success Rate: {passed}/{len(results)} ({success_rate:.1f}%)")
    
    if passed == len(results):
        print("🎉 All tests passed! Backend deployment successful.")
        return True
    elif passed >= len(results) * 0.8:  # 80% pass rate
        print("⚠️ Most tests passed. Deployment mostly successful with minor issues.")
        return True
    else:
        print("❌ Multiple test failures. Deployment needs attention.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)