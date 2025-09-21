#!/usr/bin/env python3
"""
Direct test of Resend API email delivery.
Tests both welcome email and admin notification sending.
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.email_service import EmailService
from app.core.config import settings

async def test_email_delivery():
    """Test direct email delivery via Resend API"""

    print("🔧 Email Delivery Test - aclue.app Domain")
    print("=" * 50)

    # Check configuration
    print(f"✅ Resend API Key configured: {bool(settings.RESEND_API_KEY)}")
    print(f"✅ Resend API Key length: {len(settings.RESEND_API_KEY) if settings.RESEND_API_KEY else 0}")

    email_service = EmailService()
    print(f"✅ From email: {email_service.from_email}")
    print(f"✅ Admin email: {email_service.admin_email}")
    print("")

    # Test welcome email
    print("📧 Testing Welcome Email...")
    test_email = "jack@aclue.app"
    welcome_success = await email_service.send_welcome_email(test_email, "test_direct")
    print(f"Welcome email result: {'✅ SUCCESS' if welcome_success else '❌ FAILED'}")
    print("")

    # Test admin notification
    print("📧 Testing Admin Notification...")
    admin_success = await email_service.send_admin_notification(test_email, "test_direct", "test-id-123")
    print(f"Admin notification result: {'✅ SUCCESS' if admin_success else '❌ FAILED'}")
    print("")

    # Summary
    print("📊 EMAIL DELIVERY TEST SUMMARY")
    print("=" * 30)
    print(f"Welcome Email: {'✅ PASS' if welcome_success else '❌ FAIL'}")
    print(f"Admin Notification: {'✅ PASS' if admin_success else '❌ FAIL'}")
    print(f"Overall Status: {'✅ ALL EMAILS SENT' if (welcome_success and admin_success) else '⚠️ SOME EMAILS FAILED'}")

    return welcome_success and admin_success

if __name__ == "__main__":
    result = asyncio.run(test_email_delivery())
    sys.exit(0 if result else 1)