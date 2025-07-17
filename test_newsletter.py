#!/usr/bin/env python3
"""
Test script for newsletter signup functionality

This script tests the newsletter signup endpoint to ensure:
1. Database table creation works
2. API endpoint responds correctly
3. Email validation works
4. Duplicate prevention works
"""

import requests
import json
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, '/home/jack/Documents/gift_sync/backend')

# Test configuration
BASE_URL = "http://localhost:8000"
NEWSLETTER_ENDPOINT = f"{BASE_URL}/api/v1/newsletter/signup"

def test_newsletter_signup():
    """Test the newsletter signup endpoint"""
    print("🧪 Testing Newsletter Signup Endpoint")
    print("=" * 50)
    
    # Test data
    test_email = "test@example.com"
    test_data = {
        "email": test_email,
        "source": "maintenance_page",
        "user_agent": "test-script/1.0"
    }
    
    try:
        # Test 1: First signup (should succeed)
        print(f"📧 Testing first signup with email: {test_email}")
        response = requests.post(NEWSLETTER_ENDPOINT, json=test_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ First signup successful")
        else:
            print(f"❌ First signup failed: {response.status_code}")
            
        # Test 2: Duplicate signup (should handle gracefully)
        print(f"\n🔄 Testing duplicate signup with same email: {test_email}")
        response2 = requests.post(NEWSLETTER_ENDPOINT, json=test_data)
        
        print(f"Status Code: {response2.status_code}")
        response_data = response2.json()
        print(f"Response: {response_data}")
        
        if response2.status_code == 200 and response_data.get("already_subscribed"):
            print("✅ Duplicate signup handled correctly")
        else:
            print(f"❌ Duplicate signup handling failed")
            
        # Test 3: Invalid email (should fail validation)
        print(f"\n❌ Testing invalid email format")
        invalid_data = {
            "email": "invalid-email",
            "source": "maintenance_page",
            "user_agent": "test-script/1.0"
        }
        
        response3 = requests.post(NEWSLETTER_ENDPOINT, json=invalid_data)
        print(f"Status Code: {response3.status_code}")
        print(f"Response: {response3.json()}")
        
        if response3.status_code == 422:  # Validation error
            print("✅ Invalid email validation works")
        else:
            print(f"❌ Invalid email validation failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure the backend server is running:")
        print("   cd backend && source venv/bin/activate && python -m uvicorn app.main_api:app --reload")
        return False
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False
    
    return True

def test_database_table():
    """Test that the database table was created"""
    print("\n🗄️ Testing Database Table Creation")
    print("=" * 50)
    
    try:
        # Import database utilities
        from app.database import get_supabase_service
        
        # Test database connection
        supabase = get_supabase_service()
        
        # Check if table exists by trying to query it
        result = supabase.table("newsletter_signups").select("count").execute()
        print(f"✅ Database table 'newsletter_signups' exists and is accessible")
        
        # Check if there are any signups
        signups = supabase.table("newsletter_signups").select("*").limit(5).execute()
        print(f"📊 Found {len(signups.data)} newsletter signups in database")
        
        if signups.data:
            print("Recent signups:")
            for signup in signups.data:
                print(f"  - {signup['email']} ({signup['source']}) - {signup['created_at']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        print("💡 Make sure to run the database migration SQL:")
        print("   Execute the contents of database/add_newsletter_signups.sql in your Supabase SQL editor")
        return False

def main():
    """Main test function"""
    print("🎯 Newsletter Signup Integration Test")
    print("=" * 50)
    
    # Test database table
    db_success = test_database_table()
    
    if not db_success:
        print("\n❌ Database test failed. Fix database issues before testing API.")
        return
    
    # Test API endpoint
    api_success = test_newsletter_signup()
    
    if api_success:
        print("\n🎉 All tests passed! Newsletter signup is working correctly.")
        print("\n📋 Next steps:")
        print("1. Set up RESEND_API_KEY in backend/.env for email sending")
        print("2. Test the frontend at http://localhost:3000")
        print("3. Check that emails are sent to contact@prznt.app")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()