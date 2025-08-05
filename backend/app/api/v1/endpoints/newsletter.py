"""
Newsletter Signup API Endpoint

This module provides API endpoints for managing newsletter signups with proper
database storage and email notifications.

Features:
- Newsletter signup with email validation
- Database storage with duplicate prevention
- Email notifications (admin + welcome)
- Analytics tracking
- Unsubscribe functionality
"""

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import logging
from app.database import get_supabase_service
from app.core.config import settings
from app.services.email_service import EmailService

# Configure logging
logger = logging.getLogger(__name__)

# Create router without prefix (will be added in api.py)
router = APIRouter(tags=["newsletter"])

# Pydantic Models
class NewsletterSignupRequest(BaseModel):
    """Request model for newsletter signup"""
    email: EmailStr = Field(..., description="Email address for newsletter signup")
    source: str = Field(default="maintenance_page", description="Source of the signup")
    user_agent: Optional[str] = Field(None, description="User agent string")

class NewsletterSignupResponse(BaseModel):
    """Response model for newsletter signup"""
    success: bool = Field(..., description="Whether signup was successful")
    message: str = Field(..., description="Response message")
    already_subscribed: bool = Field(default=False, description="Whether email was already subscribed")

class NewsletterSubscriberResponse(BaseModel):
    """Response model for newsletter subscriber info"""
    id: str
    email: str
    source: str
    signup_timestamp: datetime
    is_active: bool
    created_at: datetime

# Email service instance
email_service = EmailService()

@router.post("/signup", response_model=NewsletterSignupResponse)
async def newsletter_signup(
    request: NewsletterSignupRequest,
    background_tasks: BackgroundTasks,
    http_request: Request
):
    """
    Handle newsletter signup with database storage and email notifications.
    
    This endpoint:
    1. Validates email format
    2. Checks for existing subscription
    3. Stores signup in database
    4. Sends welcome email to subscriber
    5. Sends admin notification to contact@aclue.app
    
    Args:
        request: Newsletter signup request containing email and source
        background_tasks: FastAPI background tasks for email sending
        http_request: HTTP request object for IP address extraction
    
    Returns:
        NewsletterSignupResponse with success status and message
    """
    try:
        # Get client IP address
        client_ip = http_request.client.host if http_request.client else None
        
        # Get Supabase service client
        supabase = get_supabase_service()
        
        # Check if email already exists
        existing_signup = supabase.table("newsletter_signups").select("*").eq("email", request.email).execute()
        
        if existing_signup.data:
            # Email already exists
            logger.info(f"Newsletter signup attempted for existing email: {request.email}")
            return NewsletterSignupResponse(
                success=True,
                message="Thank you! You're already subscribed to our newsletter.",
                already_subscribed=True
            )
        
        # Create new newsletter signup record
        signup_data = {
            "email": request.email,
            "source": request.source,
            "user_agent": request.user_agent,
            "ip_address": client_ip,
            "signup_timestamp": datetime.utcnow().isoformat(),
            "is_active": True
        }
        
        # Insert into database
        result = supabase.table("newsletter_signups").insert(signup_data).execute()
        
        if not result.data:
            logger.error(f"Failed to insert newsletter signup: {result}")
            raise HTTPException(status_code=500, detail="Failed to save newsletter signup")
        
        signup_id = result.data[0]["id"]
        logger.info(f"Newsletter signup created successfully: {signup_id} for {request.email}")
        
        # Send emails in background
        background_tasks.add_task(
            send_newsletter_emails,
            request.email,
            signup_id,
            request.source
        )
        
        return NewsletterSignupResponse(
            success=True,
            message="Thank you for subscribing! Welcome email sent.",
            already_subscribed=False
        )
        
    except Exception as e:
        logger.error(f"Newsletter signup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during newsletter signup")

@router.get("/subscribers", response_model=List[NewsletterSubscriberResponse])
async def get_newsletter_subscribers(
    limit: int = 100,
    offset: int = 0,
    active_only: bool = True
):
    """
    Get list of newsletter subscribers (admin endpoint).
    
    Args:
        limit: Maximum number of subscribers to return
        offset: Number of subscribers to skip
        active_only: Whether to only return active subscribers
    
    Returns:
        List of newsletter subscribers
    """
    try:
        supabase = get_supabase_service()
        
        query = supabase.table("newsletter_signups").select("*")
        
        if active_only:
            query = query.eq("is_active", True)
        
        query = query.order("created_at", desc=True).limit(limit).offset(offset)
        
        result = query.execute()
        
        return [
            NewsletterSubscriberResponse(
                id=subscriber["id"],
                email=subscriber["email"],
                source=subscriber["source"],
                signup_timestamp=subscriber["signup_timestamp"],
                is_active=subscriber["is_active"],
                created_at=subscriber["created_at"]
            )
            for subscriber in result.data
        ]
        
    except Exception as e:
        logger.error(f"Error fetching newsletter subscribers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch newsletter subscribers")

@router.delete("/unsubscribe/{email}")
async def unsubscribe_newsletter(email: EmailStr):
    """
    Unsubscribe email from newsletter.
    
    Args:
        email: Email address to unsubscribe
    
    Returns:
        Success message
    """
    try:
        supabase = get_supabase_service()
        
        # Update subscriber to inactive
        result = supabase.table("newsletter_signups").update({
            "is_active": False,
            "unsubscribed_at": datetime.utcnow().isoformat()
        }).eq("email", email).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Email not found in newsletter list")
        
        logger.info(f"Newsletter unsubscribe successful: {email}")
        
        return {"success": True, "message": "Successfully unsubscribed from newsletter"}
        
    except Exception as e:
        logger.error(f"Newsletter unsubscribe error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to unsubscribe from newsletter")

async def send_newsletter_emails(email: str, signup_id: str, source: str):
    """
    Send welcome email to subscriber and admin notification.
    
    This function runs in the background to send:
    1. Welcome email to the subscriber
    2. Admin notification to contact@aclue.app
    
    Args:
        email: Subscriber email address
        signup_id: Newsletter signup ID
        source: Source of the signup
    """
    try:
        # Send welcome email to subscriber
        welcome_success = await email_service.send_welcome_email(email, source)
        
        # Send admin notification to contact@aclue.app
        admin_success = await email_service.send_admin_notification(email, source, signup_id)
        
        # Update database with email sending status
        supabase = get_supabase_service()
        supabase.table("newsletter_signups").update({
            "welcome_email_sent": welcome_success,
            "admin_notification_sent": admin_success,
            "email_sent": welcome_success and admin_success
        }).eq("id", signup_id).execute()
        
        logger.info(f"Newsletter emails sent - Welcome: {welcome_success}, Admin: {admin_success}")
        
    except Exception as e:
        logger.error(f"Error sending newsletter emails: {str(e)}")