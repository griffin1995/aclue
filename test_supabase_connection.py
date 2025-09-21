#!/usr/bin/env python3
"""
Test Supabase connection and newsletter_signups table access
"""
import os
import sys
from supabase import create_client

def test_supabase_connection():
    """Test Supabase connection with both anon and service keys"""

    # Environment variables (from Documentation - full keys)
    SUPABASE_URL = "https://xchsarvamppwephulylt.supabase.co"
    SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY1MjksImV4cCI6MjA2NTg1MjUyOX0.qF2gpIKT7-wFOiIpgAe5unwHsAAttZXu_RAbVkexfb0"
    SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3NjUyOSwiZXhwIjoyMDY1ODUyNTI5fQ.ylz1FGYPLvvfX6UkZhAm8i65nwcnO90QN90ZxXdYZLE"

    print("🔧 Testing Supabase Connection...")
    print(f"URL: {SUPABASE_URL}")
    print(f"Anon Key: {SUPABASE_ANON_KEY[:20]}...")
    print(f"Service Key: {SUPABASE_SERVICE_KEY[:20]}...")
    print()

    # Test 1: Anon client connection
    print("📡 Test 1: Anon Client Connection")
    try:
        anon_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Anon client created successfully")

        # Try to access newsletter_signups with anon key
        result = anon_client.table("newsletter_signups").select("*").limit(1).execute()
        print(f"✅ Anon client newsletter_signups access: {len(result.data)} records")

    except Exception as e:
        print(f"❌ Anon client error: {e}")
    print()

    # Test 2: Service client connection
    print("🔑 Test 2: Service Client Connection")
    try:
        service_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print("✅ Service client created successfully")

        # Try to access newsletter_signups with service key
        result = service_client.table("newsletter_signups").select("*").limit(1).execute()
        print(f"✅ Service client newsletter_signups access: {len(result.data)} records")

    except Exception as e:
        print(f"❌ Service client error: {e}")
    print()

    # Test 3: Check table exists
    print("📋 Test 3: Check Table Schema")
    try:
        service_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        # Query information_schema to check if table exists
        result = service_client.rpc('exec', {
            'sql': "SELECT table_name FROM information_schema.tables WHERE table_name = 'newsletter_signups'"
        }).execute()

        if result.data:
            print("✅ newsletter_signups table exists")
        else:
            print("❌ newsletter_signups table does NOT exist")

    except Exception as e:
        print(f"❌ Table check error: {e}")
    print()

    # Test 4: Test insert with service key
    print("✏️ Test 4: Test Insert Operation")
    try:
        service_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        test_data = {
            "email": "test-debug@example.com",
            "source": "debug_test",
            "ip_address": "127.0.0.1"
        }

        result = service_client.table("newsletter_signups").insert(test_data).execute()

        if result.data:
            print(f"✅ Insert successful: {result.data[0]['id']}")

            # Clean up - delete the test record
            service_client.table("newsletter_signups").delete().eq("email", "test-debug@example.com").execute()
            print("🧹 Test record cleaned up")
        else:
            print("❌ Insert failed - no data returned")

    except Exception as e:
        print(f"❌ Insert error: {e}")
    print()

if __name__ == "__main__":
    test_supabase_connection()