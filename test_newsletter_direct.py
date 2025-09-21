#!/usr/bin/env python3
"""
Direct test of newsletter signup functionality
Tests the database connection and API without going through the full backend
"""

import os
import sys
import asyncio
from datetime import datetime
from supabase import create_client

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Supabase configuration from DEPLOYMENT.md
SUPABASE_URL = "https://xchsarvamppwephulylt.supabase.co"
# Service key from deployment docs (truncated for security)
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

async def test_newsletter_signup():
    """Test newsletter signup directly"""
    try:
        print("🔗 Testing Supabase connection...")

        # Create Supabase client
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        print("✅ Supabase client created")

        # Test table access
        print("📋 Testing table access...")
        result = supabase.table("newsletter_signups").select("count").execute()
        print(f"✅ Table accessible, current count: {len(result.data) if result.data else 0}")

        # Test insert
        print("📝 Testing newsletter signup insert...")
        test_email = f"test+{datetime.now().timestamp()}@example.com"

        signup_data = {
            "email": test_email,
            "source": "direct_test",
            "user_agent": "Python Test Script",
            "ip_address": "127.0.0.1",
            "signup_timestamp": datetime.utcnow().isoformat(),
            "is_active": True
        }

        insert_result = supabase.table("newsletter_signups").insert(signup_data).execute()

        if insert_result.data:
            print(f"✅ Newsletter signup successful! ID: {insert_result.data[0]['id']}")

            # Test select to verify
            verify_result = supabase.table("newsletter_signups").select("*").eq("email", test_email).execute()
            if verify_result.data:
                print(f"✅ Signup verified in database: {verify_result.data[0]['email']}")
                return True
            else:
                print("❌ Signup not found in database after insert")
                return False
        else:
            print(f"❌ Newsletter signup failed: {insert_result}")
            return False

    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        return False

async def test_subscribers_endpoint():
    """Test the subscribers endpoint directly"""
    try:
        print("\n📊 Testing subscribers list...")

        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        result = supabase.table("newsletter_signups").select("*").order("created_at", desc=True).limit(5).execute()

        if result.data:
            print(f"✅ Found {len(result.data)} newsletter signups:")
            for signup in result.data:
                print(f"  - {signup['email']} ({signup['source']}) at {signup['created_at']}")
            return True
        else:
            print("📭 No newsletter signups found")
            return True

    except Exception as e:
        print(f"❌ Subscribers test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Direct Newsletter Signup Test")
    print("=" * 50)

    # Check if we have the service key
    if "..." in SUPABASE_SERVICE_KEY:
        print("❌ SUPABASE_SERVICE_KEY is truncated. Please update with full key from Railway environment.")
        print("   Check Railway dashboard for the complete key.")
        sys.exit(1)

    # Run tests
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    signup_success = loop.run_until_complete(test_newsletter_signup())
    subscribers_success = loop.run_until_complete(test_subscribers_endpoint())

    print("\n" + "=" * 50)
    print("🏁 Test Results:")
    print(f"   Newsletter Signup: {'✅ PASS' if signup_success else '❌ FAIL'}")
    print(f"   Subscribers List: {'✅ PASS' if subscribers_success else '❌ FAIL'}")

    if signup_success and subscribers_success:
        print("\n🎉 All tests passed! Newsletter system is working.")
        print("   The issue is likely in the backend API configuration.")
    else:
        print("\n⚠️  Database tests failed. Check Supabase configuration.")