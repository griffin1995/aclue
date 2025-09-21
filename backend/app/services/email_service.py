"""
Aclue Email Service for Newsletter and Notifications

REBRANDING NOTE (August 2025):
This service was updated during the comprehensive rebrand from Aclue/aclue to Aclue.
All email templates, sender addresses, and domain references have been updated to
reflect the new Aclue brand identity and aclue.app domain.

This service handles sending emails for:
- Welcome emails to newsletter subscribers  
- Admin notifications to contact@aclue.app
- Other email notifications

Key Branding Updates:
- Sender email: aclue <noreply@aclue.app> (from aclue/aclue addresses)
- Admin email: contact@aclue.app (updated domain)
- Email templates: Complete rebrand with Aclue messaging and branding
- Domain references: All links point to aclue.app (primary domain)

Uses Resend API for reliable email delivery.
"""

import os
import logging
from typing import Optional
from dataclasses import dataclass
from datetime import datetime
import httpx
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class EmailTemplate:
    """Email template data structure"""
    subject: str
    html_content: str
    text_content: str

class EmailService:
    """
    Email service for handling all email communications.
    
    Features:
    - Newsletter welcome emails
    - Admin notifications
    - Email template management
    - Resend API integration
    """
    
    def __init__(self):
        self.resend_api_key = settings.RESEND_API_KEY
        # Rebranded email addresses (August 2025) - updated from aclue/aclue domains
        self.from_email = "aclue <noreply@aclue.app>"        # Primary sender for all notifications
        self.admin_email = "contact@aclue.app"               # Admin notifications recipient
        self.base_url = "https://api.resend.com"
        
    async def send_welcome_email(self, email: str, source: str) -> bool:
        """
        Send welcome email to newsletter subscriber.
        
        Args:
            email: Subscriber email address
            source: Source of the signup (e.g., 'maintenance_page')
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            template = self._get_welcome_email_template(source)
            
            success = await self._send_email(
                to_email=email,
                subject=template.subject,
                html_content=template.html_content,
                text_content=template.text_content
            )
            
            if success:
                logger.info(f"Welcome email sent successfully to {email}")
            else:
                logger.error(f"Failed to send welcome email to {email}")
                
            return success
            
        except Exception as e:
            logger.error(f"Error sending welcome email to {email}: {str(e)}")
            return False
    
    async def send_admin_notification(self, subscriber_email: str, source: str, signup_id: str) -> bool:
        """
        Send admin notification about new newsletter signup.
        
        Args:
            subscriber_email: Email address of the subscriber
            source: Source of the signup
            signup_id: Newsletter signup ID
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            template = self._get_admin_notification_template(subscriber_email, source, signup_id)
            
            success = await self._send_email(
                to_email=self.admin_email,
                subject=template.subject,
                html_content=template.html_content,
                text_content=template.text_content
            )
            
            if success:
                logger.info(f"Admin notification sent for signup: {subscriber_email}")
            else:
                logger.error(f"Failed to send admin notification for signup: {subscriber_email}")
                
            return success
            
        except Exception as e:
            logger.error(f"Error sending admin notification for {subscriber_email}: {str(e)}")
            return False
    
    async def _send_email(self, to_email: str, subject: str, html_content: str, text_content: str) -> bool:
        """
        Send email using Resend API.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text email content
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if not self.resend_api_key:
            logger.warning("RESEND_API_KEY not configured, skipping email send")
            return False
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/emails",
                    headers={
                        "Authorization": f"Bearer {self.resend_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "from": self.from_email,
                        "to": [to_email],
                        "subject": subject,
                        "html": html_content,
                        "text": text_content
                    }
                )
                
                if response.status_code == 200:
                    logger.info(f"Email sent successfully to {to_email}")
                    return True
                else:
                    logger.error(f"Failed to send email to {to_email}: {response.status_code} - {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            return False
    
    def _get_welcome_email_template(self, source: str) -> EmailTemplate:
        """
        Get welcome email template for newsletter subscriber.
        
        Args:
            source: Source of the signup
            
        Returns:
            EmailTemplate: Welcome email template
        """
        subject = "Welcome to aclue - AI-Powered Gift Discovery! 🎁"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to aclue</title>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .logo-img {{ max-width: 200px; height: auto; margin-bottom: 15px; filter: invert(1); }}
                .subtitle {{ font-size: 16px; opacity: 0.9; }}
                .feature {{ display: flex; align-items: center; margin: 15px 0; }}
                .feature-icon {{ width: 24px; height: 24px; margin-right: 12px; }}
                .cta-button {{ background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; font-size: 14px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://aclue.app/aclue_text_clean.png" alt="aclue - AI-Powered Gift Discovery" class="logo-img" onerror="this.style.display='none'; this.parentNode.innerHTML='<h3 style=&quot;color: white; margin: 0; font-family: Arial, sans-serif;&quot;>aclue</h3>';" />
                    <div class="subtitle">AI-Powered Gift Discovery</div>
                </div>
                
                <div class="content">
                    <h2>Welcome to the Future of Gift Discovery! 🚀</h2>
                    
                    <p>Thank you for joining our exclusive beta programme! You're now part of a select group who will be among the first to experience how AI can revolutionise gift-giving.</p>
                    
                    <h3>What's Coming Your Way:</h3>
                    
                    <div class="feature">
                        <span class="feature-icon">🧠</span>
                        <span><strong>AI-Powered Learning:</strong> Our neural network learns your unique preferences</span>
                    </div>
                    
                    <div class="feature">
                        <span class="feature-icon">✨</span>
                        <span><strong>Smart Recommendations:</strong> Personalised gift suggestions that actually understand you</span>
                    </div>
                    
                    <div class="feature">
                        <span class="feature-icon">👥</span>
                        <span><strong>Social Integration:</strong> Connect with friends and family for better gift ideas</span>
                    </div>
                    
                    <div class="feature">
                        <span class="feature-icon">⭐</span>
                        <span><strong>Curated Quality:</strong> Only the best products make it to your recommendations</span>
                    </div>
                    
                    <p>We're working hard to perfect the experience and will notify you the moment we're ready to launch. We'll keep you updated on our progress and notify you as soon as we're ready for you to experience the full aclue platform!</p>

                    <p>Have questions or feedback? Simply reply to this email - we read and respond to every message!</p>
                    
                    <p>Excited to have you on board,<br>
                    The aclue Team</p>
                </div>
                
                <div class="footer">
                    <p>You're receiving this email because you signed up for aclue beta access.</p>
                    <p>If you no longer wish to receive these emails, you can <a href="mailto:contact@aclue.app?subject=Unsubscribe">unsubscribe here</a>.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to aclue - AI-Powered Gift Discovery!

        Thank you for joining our exclusive beta programme! You're now part of a select group who will be among the first to experience how AI can revolutionise gift-giving.

        What's Coming Your Way:
        🧠 AI-Powered Learning: Our neural network learns your unique preferences
        ✨ Smart Recommendations: Personalised gift suggestions that actually understand you
        👥 Social Integration: Connect with friends and family for better gift ideas
        ⭐ Curated Quality: Only the best products make it to your recommendations

        We're working hard to perfect the experience and will notify you the moment we're ready to launch. We'll keep you updated on our progress and notify you as soon as we're ready for you to experience the full aclue platform!

        Have questions or feedback? Simply reply to this email - we read and respond to every message!

        Excited to have you on board,
        The aclue Team

        ---
        You're receiving this email because you signed up for aclue beta access.
        If you no longer wish to receive these emails, you can unsubscribe by emailing contact@aclue.app
        """
        
        return EmailTemplate(subject, html_content, text_content)
    
    def _get_admin_notification_template(self, subscriber_email: str, source: str, signup_id: str) -> EmailTemplate:
        """
        Get admin notification template for new newsletter signup.
        
        Args:
            subscriber_email: Email address of the subscriber
            source: Source of the signup
            signup_id: Newsletter signup ID
            
        Returns:
            EmailTemplate: Admin notification template
        """
        subject = f"New Newsletter Signup: {subscriber_email}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Newsletter Signup</title>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }}
                .content {{ background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }}
                .logo-img {{ max-width: 150px; height: auto; margin-bottom: 10px; filter: invert(1); }}
                .header-title {{ margin: 0; font-size: 20px; }}
                .info-box {{ background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }}
                .label {{ font-weight: bold; color: #374151; }}
                .value {{ color: #1f2937; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://aclue.app/aclue_text_clean.png" alt="aclue - AI-Powered Gift Discovery" class="logo-img" onerror="this.style.display='none'; this.parentNode.innerHTML='<h3 style=&quot;color: white; margin: 0; font-family: Arial, sans-serif;&quot;>aclue</h3>';" />
                    <h2 class="header-title">🎉 New Newsletter Signup - aclue</h2>
                </div>
                
                <div class="content">
                    <p>A new user has signed up for the aclue newsletter!</p>
                    
                    <div class="info-box">
                        <div><span class="label">Email:</span> <span class="value">{subscriber_email}</span></div>
                        <div><span class="label">Source:</span> <span class="value">{source}</span></div>
                        <div><span class="label">Signup ID:</span> <span class="value">{signup_id}</span></div>
                        <div><span class="label">Timestamp:</span> <span class="value">{datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</span></div>
                    </div>
                    
                    <p>The subscriber has been automatically sent a welcome email and added to the newsletter database.</p>
                    
                    <p>You can view all newsletter subscribers in the admin dashboard.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        New Newsletter Signup - aclue

        A new user has signed up for the aclue newsletter!

        Details:
        Email: {subscriber_email}
        Source: {source}
        Signup ID: {signup_id}
        Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

        The subscriber has been automatically sent a welcome email and added to the newsletter database.

        You can view all newsletter subscribers in the admin dashboard.
        """
        
        return EmailTemplate(subject, html_content, text_content)