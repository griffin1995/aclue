#!/usr/bin/env python3
"""
Email Template Preview Generator for Aclue

This script generates HTML previews of email templates for development and testing.
It extracts the current email templates from the email service and creates preview files
that can be opened in a browser to see how emails will appear to recipients.

Features:
- Generates both welcome and admin notification email previews
- Creates light and dark theme versions
- Simulates different email client environments
- Creates mobile-responsive previews
- Provides sample data for realistic testing

Usage:
    python scripts/generate_email_previews.py

Output:
    - Saves preview files to backend/email_previews/ directory
    - Creates both individual and combined preview files
    - Generates client-specific compatibility versions
"""

import os
import sys
import asyncio
from datetime import datetime
from pathlib import Path

# Add the parent directory to the path so we can import our email service
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_service import EmailService

class EmailPreviewGenerator:
    """
    Generates HTML preview files for email templates.
    """

    def __init__(self, output_dir: str = "email_previews"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.email_service = EmailService()

    def generate_all_previews(self):
        """Generate all email template previews"""
        print("🎨 Generating Email Template Previews...")
        print("=" * 50)

        # Generate welcome email previews
        self._generate_welcome_email_previews()

        # Generate admin notification previews
        self._generate_admin_notification_previews()

        # Generate combined preview file
        self._generate_combined_preview()

        # Generate email client compatibility previews
        self._generate_client_compatibility_previews()

        print(f"\n✅ All previews generated successfully!")
        print(f"📁 Preview files saved to: {self.output_dir.absolute()}")
        print(f"🌐 Open any .html file in your browser to view the previews")

    def _generate_welcome_email_previews(self):
        """Generate welcome email template previews"""
        print("📧 Generating welcome email previews...")

        # Get the welcome email template
        template = self.email_service._get_welcome_email_template("maintenance_page")

        # Generate light theme version
        light_html = self._wrap_with_preview_styles(
            template.html_content,
            "Welcome Email - Light Theme",
            theme="light"
        )

        # Generate dark theme version
        dark_html = self._wrap_with_preview_styles(
            template.html_content,
            "Welcome Email - Dark Theme",
            theme="dark"
        )

        # Save preview files
        (self.output_dir / "welcome_email_light.html").write_text(light_html, encoding='utf-8')
        (self.output_dir / "welcome_email_dark.html").write_text(dark_html, encoding='utf-8')

        # Generate mobile preview
        mobile_html = self._wrap_with_preview_styles(
            template.html_content,
            "Welcome Email - Mobile Preview",
            theme="light",
            mobile=True
        )
        (self.output_dir / "welcome_email_mobile.html").write_text(mobile_html, encoding='utf-8')

        print("  ✓ welcome_email_light.html")
        print("  ✓ welcome_email_dark.html")
        print("  ✓ welcome_email_mobile.html")

    def _generate_admin_notification_previews(self):
        """Generate admin notification template previews"""
        print("🔔 Generating admin notification previews...")

        # Get the admin notification template with sample data
        template = self.email_service._get_admin_notification_template(
            subscriber_email="preview.user@example.com",
            source="maintenance_page",
            signup_id="preview-12345-abcde"
        )

        # Generate light theme version
        light_html = self._wrap_with_preview_styles(
            template.html_content,
            "Admin Notification - Light Theme",
            theme="light"
        )

        # Generate dark theme version
        dark_html = self._wrap_with_preview_styles(
            template.html_content,
            "Admin Notification - Dark Theme",
            theme="dark"
        )

        # Save preview files
        (self.output_dir / "admin_notification_light.html").write_text(light_html, encoding='utf-8')
        (self.output_dir / "admin_notification_dark.html").write_text(dark_html, encoding='utf-8')

        print("  ✓ admin_notification_light.html")
        print("  ✓ admin_notification_dark.html")

    def _generate_combined_preview(self):
        """Generate a combined preview file showing all templates"""
        print("📊 Generating combined preview...")

        welcome_template = self.email_service._get_welcome_email_template("maintenance_page")
        admin_template = self.email_service._get_admin_notification_template(
            subscriber_email="preview.user@example.com",
            source="maintenance_page",
            signup_id="preview-12345-abcde"
        )

        combined_html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aclue Email Templates - Combined Preview</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f5f5f5;
                }}
                .preview-container {{
                    max-width: 1200px;
                    margin: 0 auto;
                }}
                .preview-header {{
                    text-align: center;
                    margin-bottom: 40px;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .preview-section {{
                    margin-bottom: 40px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    overflow: hidden;
                }}
                .section-header {{
                    background: #3b82f6;
                    color: white;
                    padding: 15px 20px;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }}
                .email-frame {{
                    border: none;
                    width: 100%;
                    min-height: 600px;
                    background: white;
                }}
                .theme-toggle {{
                    margin: 20px;
                    text-align: center;
                }}
                .theme-button {{
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 0 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }}
                .theme-button:hover {{
                    background: #2563eb;
                }}
                .preview-info {{
                    background: #f8fafc;
                    padding: 15px 20px;
                    border-left: 4px solid #3b82f6;
                    margin: 20px;
                    border-radius: 0 5px 5px 0;
                }}
                .timestamp {{
                    color: #666;
                    font-size: 14px;
                    text-align: center;
                    margin-top: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="preview-container">
                <div class="preview-header">
                    <h1>📧 Aclue Email Templates Preview</h1>
                    <p>Generated on {datetime.now().strftime('%Y-%m-%d at %H:%M:%S UTC')}</p>
                    <div class="preview-info">
                        <strong>📋 Template Status:</strong> These previews show the current email templates from the Aclue email service.
                        Both light and dark themes are supported automatically based on user preferences.
                    </div>
                </div>

                <div class="preview-section">
                    <h2 class="section-header">💌 Welcome Email Template</h2>
                    <div class="theme-toggle">
                        <button class="theme-button" onclick="toggleWelcomeTheme()">🌙 Toggle Dark Mode</button>
                    </div>
                    <div id="welcome-content">
                        {welcome_template.html_content}
                    </div>
                </div>

                <div class="preview-section">
                    <h2 class="section-header">🔔 Admin Notification Template</h2>
                    <div class="theme-toggle">
                        <button class="theme-button" onclick="toggleAdminTheme()">🌙 Toggle Dark Mode</button>
                    </div>
                    <div id="admin-content">
                        {admin_template.html_content}
                    </div>
                </div>

                <div class="timestamp">
                    Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
                </div>
            </div>

            <script>
                function toggleWelcomeTheme() {{
                    const content = document.getElementById('welcome-content');
                    content.style.filter = content.style.filter ? '' : 'invert(0.9) hue-rotate(180deg)';
                }}

                function toggleAdminTheme() {{
                    const content = document.getElementById('admin-content');
                    content.style.filter = content.style.filter ? '' : 'invert(0.9) hue-rotate(180deg)';
                }}
            </script>
        </body>
        </html>
        """

        (self.output_dir / "combined_preview.html").write_text(combined_html, encoding='utf-8')
        print("  ✓ combined_preview.html")

    def _generate_client_compatibility_previews(self):
        """Generate email client specific compatibility previews"""
        print("🖥️  Generating email client compatibility previews...")

        welcome_template = self.email_service._get_welcome_email_template("maintenance_page")

        # Outlook compatibility version
        outlook_html = self._create_outlook_compatible_version(welcome_template.html_content)
        outlook_preview = self._wrap_with_preview_styles(
            outlook_html,
            "Welcome Email - Outlook Compatibility",
            theme="light"
        )
        (self.output_dir / "welcome_email_outlook.html").write_text(outlook_preview, encoding='utf-8')

        # Gmail compatibility version
        gmail_html = self._create_gmail_compatible_version(welcome_template.html_content)
        gmail_preview = self._wrap_with_preview_styles(
            gmail_html,
            "Welcome Email - Gmail Compatibility",
            theme="light"
        )
        (self.output_dir / "welcome_email_gmail.html").write_text(gmail_preview, encoding='utf-8')

        print("  ✓ welcome_email_outlook.html")
        print("  ✓ welcome_email_gmail.html")

    def _wrap_with_preview_styles(self, email_content: str, title: str, theme: str = "light", mobile: bool = False) -> str:
        """Wrap email content with preview-specific styles and controls"""

        theme_class = "dark-theme" if theme == "dark" else "light-theme"
        mobile_class = "mobile-preview" if mobile else ""

        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title} - Aclue Email Preview</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f5f5f5;
                }}

                .preview-header {{
                    text-align: center;
                    margin-bottom: 20px;
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }}

                .preview-container {{
                    max-width: 700px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                    overflow: hidden;
                }}

                .email-content {{
                    background: white;
                }}

                .mobile-preview {{
                    max-width: 375px;
                }}

                .dark-theme .email-content {{
                    background: #111827;
                    color: #e5e7eb;
                }}

                .preview-controls {{
                    padding: 15px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: center;
                }}

                .control-button {{
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    margin: 0 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                }}

                .control-button:hover {{
                    background: #2563eb;
                }}

                .preview-info {{
                    background: #f0f9ff;
                    padding: 10px 15px;
                    border-left: 4px solid #3b82f6;
                    margin: 10px 15px;
                    border-radius: 0 4px 4px 0;
                    font-size: 14px;
                }}

                .timestamp {{
                    color: #666;
                    font-size: 12px;
                    text-align: center;
                    padding: 10px;
                    background: #f8fafc;
                }}

                /* Force dark theme styles when class is applied */
                .dark-theme {{
                    background: #111827 !important;
                    color: #e5e7eb !important;
                }}

                .dark-theme .preview-header {{
                    background: #1f2937 !important;
                    color: #f9fafb !important;
                }}

                .dark-theme .preview-controls {{
                    background: #374151 !important;
                    border-color: #4b5563 !important;
                }}

                .dark-theme .timestamp {{
                    background: #374151 !important;
                    color: #d1d5db !important;
                }}

                /* Mobile responsive adjustments */
                @media (max-width: 480px) {{
                    .preview-container {{
                        margin: 0 10px;
                    }}

                    body {{
                        padding: 10px;
                    }}
                }}
            </style>
        </head>
        <body class="{theme_class}">
            <div class="preview-header">
                <h2>{title}</h2>
                <p>📧 Email Template Preview - Generated {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>

            <div class="preview-container {mobile_class}">
                <div class="preview-controls">
                    <button class="control-button" onclick="toggleTheme()">🌓 Toggle Theme</button>
                    <button class="control-button" onclick="toggleMobile()">📱 Toggle Mobile</button>
                    <button class="control-button" onclick="window.print()">🖨️ Print</button>
                </div>

                <div class="preview-info">
                    <strong>Preview Mode:</strong> {theme.title()} Theme{' - Mobile View' if mobile else ' - Desktop View'}
                </div>

                <div class="email-content">
                    {email_content}
                </div>

                <div class="timestamp">
                    Generated from email_service.py on {datetime.now().strftime('%Y-%m-%d at %H:%M:%S UTC')}
                </div>
            </div>

            <script>
                function toggleTheme() {{
                    document.body.classList.toggle('dark-theme');
                    document.body.classList.toggle('light-theme');
                }}

                function toggleMobile() {{
                    const container = document.querySelector('.preview-container');
                    container.classList.toggle('mobile-preview');
                }}
            </script>
        </body>
        </html>
        """

    def _create_outlook_compatible_version(self, html_content: str) -> str:
        """Create Outlook-compatible version of email template"""
        # Outlook has limited CSS support, so we need to inline styles and use tables
        # This is a simplified version - in production you'd use a proper email framework
        return html_content.replace(
            'style="',
            'style="font-family: Arial, sans-serif !important; '
        ).replace(
            'background: linear-gradient',
            'background: #3b82f6; /* Outlook fallback */'
        )

    def _create_gmail_compatible_version(self, html_content: str) -> str:
        """Create Gmail-compatible version of email template"""
        # Gmail strips certain CSS properties, so we provide fallbacks
        return html_content.replace(
            'backdrop-filter: blur(10px);',
            'backdrop-filter: blur(10px); background-color: rgba(248, 250, 252, 0.95) !important;'
        )

def main():
    """Main function to generate all email previews"""
    try:
        # Create output directory in the backend folder
        backend_dir = Path(__file__).parent.parent
        output_dir = backend_dir / "email_previews"

        # Initialize the preview generator
        generator = EmailPreviewGenerator(str(output_dir))

        # Generate all previews
        generator.generate_all_previews()

        print(f"\n🎉 Email preview generation completed successfully!")
        print(f"📁 Files saved to: {output_dir.absolute()}")
        print(f"\n🚀 Quick start:")
        print(f"   • Open 'combined_preview.html' for all templates")
        print(f"   • Open individual files for specific templates")
        print(f"   • Use browser dev tools to test responsive design")
        print(f"   • Check both light and dark theme versions")

        return True

    except Exception as e:
        print(f"❌ Error generating email previews: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)