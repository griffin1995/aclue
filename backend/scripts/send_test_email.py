#!/usr/bin/env python3
"""
Test Email Sender for Aclue Email Templates

This script allows developers to send actual test emails to preview how the templates
appear in real email clients. It uses the production email service but with test data.

Features:
- Send welcome email test
- Send admin notification test
- Support for different test scenarios
- Email validation and safety checks
- Environment configuration validation

Usage:
    python scripts/send_test_email.py --email your.email@example.com --type welcome
    python scripts/send_test_email.py --email admin@example.com --type admin
    python scripts/send_test_email.py --email test@example.com --type both

Safety Features:
- Only sends to explicitly provided email addresses
- Requires confirmation for sending
- Uses test data to avoid confusion
- Validates email service configuration
"""

import os
import sys
import asyncio
import argparse
from datetime import datetime
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_service import EmailService
from app.core.config import settings

class TestEmailSender:
    """
    Sends test emails using the production email service with test data.
    """

    def __init__(self):
        self.email_service = EmailService()

    async def send_welcome_email_test(self, test_email: str) -> bool:
        """Send a test welcome email"""
        print(f"📧 Sending welcome email test to: {test_email}")

        # Add test identifier to email content by temporarily modifying the source
        success = await self.email_service.send_welcome_email(
            email=test_email,
            source="email_preview_test"
        )

        if success:
            print(f"✅ Welcome email sent successfully to {test_email}")
        else:
            print(f"❌ Failed to send welcome email to {test_email}")

        return success

    async def send_admin_notification_test(self, test_email: str) -> bool:
        """Send a test admin notification email"""
        print(f"🔔 Sending admin notification test to: {test_email}")

        # Generate test data
        test_subscriber_email = "test.subscriber@preview.example.com"
        test_source = "email_preview_test"
        test_signup_id = f"preview-test-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        # Temporarily override admin email for testing
        original_admin_email = self.email_service.admin_email
        self.email_service.admin_email = test_email

        try:
            success = await self.email_service.send_admin_notification(
                subscriber_email=test_subscriber_email,
                source=test_source,
                signup_id=test_signup_id
            )

            if success:
                print(f"✅ Admin notification sent successfully to {test_email}")
            else:
                print(f"❌ Failed to send admin notification to {test_email}")

            return success

        finally:
            # Restore original admin email
            self.email_service.admin_email = original_admin_email

    def validate_configuration(self) -> bool:
        """Validate email service configuration"""
        print("🔧 Validating email service configuration...")

        issues = []

        # Check Resend API key
        if not settings.RESEND_API_KEY:
            issues.append("❌ RESEND_API_KEY not configured")
        else:
            print("✅ RESEND_API_KEY configured")

        # Check from email
        if not self.email_service.from_email:
            issues.append("❌ From email not configured")
        else:
            print(f"✅ From email: {self.email_service.from_email}")

        # Check admin email
        if not self.email_service.admin_email:
            issues.append("❌ Admin email not configured")
        else:
            print(f"✅ Admin email: {self.email_service.admin_email}")

        if issues:
            print("\n🚨 Configuration Issues:")
            for issue in issues:
                print(f"   {issue}")
            return False

        print("✅ All configuration checks passed!")
        return True

    def validate_email_address(self, email: str) -> bool:
        """Basic email address validation"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

def main():
    """Main function for sending test emails"""
    parser = argparse.ArgumentParser(
        description="Send test emails using Aclue email templates",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/send_test_email.py --email john@example.com --type welcome
  python scripts/send_test_email.py --email admin@company.com --type admin
  python scripts/send_test_email.py --email test@domain.com --type both
  python scripts/send_test_email.py --check-config

Safety Notes:
  - This script sends real emails to the specified address
  - Test emails include clear identification as test messages
  - Only use with email addresses you control
  - Requires valid Resend API configuration
        """
    )

    parser.add_argument(
        '--email',
        type=str,
        help='Email address to send test emails to'
    )

    parser.add_argument(
        '--type',
        choices=['welcome', 'admin', 'both'],
        default='welcome',
        help='Type of test email to send (default: welcome)'
    )

    parser.add_argument(
        '--check-config',
        action='store_true',
        help='Only check email service configuration without sending emails'
    )

    parser.add_argument(
        '--confirm',
        action='store_true',
        help='Skip confirmation prompts (use with caution)'
    )

    args = parser.parse_args()

    # Initialize the test email sender
    sender = TestEmailSender()

    # Validate configuration first
    if not sender.validate_configuration():
        print("\n❌ Email service configuration is invalid. Please check your environment variables.")
        return False

    # If only checking configuration, exit here
    if args.check_config:
        print("\n✅ Configuration check completed successfully!")
        return True

    # Validate email argument
    if not args.email:
        print("❌ Email address is required. Use --email your.address@example.com")
        return False

    if not sender.validate_email_address(args.email):
        print(f"❌ Invalid email address format: {args.email}")
        return False

    # Safety confirmation
    if not args.confirm:
        print(f"\n⚠️  WARNING: This will send real emails to {args.email}")
        print(f"📧 Email type: {args.type}")
        print(f"🕐 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        confirm = input("\nDo you want to proceed? (type 'yes' to continue): ").strip().lower()
        if confirm != 'yes':
            print("❌ Test email sending cancelled by user.")
            return False

    # Send test emails
    async def send_tests():
        success_count = 0
        total_count = 0

        if args.type in ['welcome', 'both']:
            total_count += 1
            if await sender.send_welcome_email_test(args.email):
                success_count += 1

        if args.type in ['admin', 'both']:
            total_count += 1
            if await sender.send_admin_notification_test(args.email):
                success_count += 1

        return success_count, total_count

    try:
        print(f"\n🚀 Sending test emails...")
        success_count, total_count = asyncio.run(send_tests())

        print(f"\n📊 Test Email Results:")
        print(f"   ✅ Successful: {success_count}/{total_count}")
        print(f"   📧 Sent to: {args.email}")
        print(f"   🕐 Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        if success_count == total_count:
            print(f"\n🎉 All test emails sent successfully!")
            print(f"📱 Check your email client ({args.email}) to see how the templates appear.")
            return True
        else:
            print(f"\n⚠️  Some test emails failed to send. Check the logs above for details.")
            return False

    except Exception as e:
        print(f"\n❌ Error sending test emails: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)