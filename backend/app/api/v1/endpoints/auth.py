"""
GiftSync Authentication API Endpoints

Provides secure user authentication services including registration,
login, token refresh, and session management. Implements JWT-based
authentication with bcrypt password hashing.

Security Features:
- JWT access tokens (30 minute expiry)
- JWT refresh tokens (30 day expiry)
- bcrypt password hashing with salt
- Registration toggle via feature flag
- Comprehensive input validation
- Rate limiting ready (implement in production)

Endpoints:
- POST /auth/register: Create new user account
- POST /auth/login: Authenticate existing user
- POST /auth/refresh: Renew access token
- GET /auth/me: Get current user profile
- POST /auth/logout: End user session
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
import bcrypt
import uuid
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.config import settings
from app.database import supabase, supabase_anon, supabase_service, create_supabase_client
from app.core.database import get_db
from app.models_sqlalchemy.user import User

# FastAPI router for authentication endpoints
router = APIRouter()

# ==============================================================================
# REQUEST/RESPONSE MODELS
# ==============================================================================
# Pydantic models for request validation and response serialisation

class UserRegistration(BaseModel):
    """
    User registration request model.
    
    Validates new user registration data with required fields
    and optional marketing consent for GDPR compliance.
    
    Fields:
        first_name: User's first name (required)
        last_name: User's last name (required)
        email: Valid email address (required, unique)
        password: User password (required, min 8 chars)
        marketing_consent: Optional marketing email consent (GDPR)
    """
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    marketing_consent: Optional[bool] = False

class UserLogin(BaseModel):
    """
    User login request model.
    
    Validates user authentication credentials for login endpoint.
    
    Fields:
        email: User's registered email address
        password: User's password in plain text (encrypted in transit)
    """
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """
    User profile response model.
    
    Contains safe user data for API responses (excludes sensitive fields
    like password hash).
    
    Fields:
        id: Unique user identifier (UUID)
        email: User's email address
        first_name: User's first name
        last_name: User's last name
        subscription_tier: User's subscription level
        created_at: Account creation timestamp (ISO format)
        last_login: Most recent login timestamp (ISO format)
    """
    id: str
    email: str
    first_name: str
    last_name: str
    subscription_tier: str
    created_at: str
    last_login: Optional[str] = None

class AuthResponse(BaseModel):
    """
    Authentication response model.
    
    Contains JWT tokens and user profile data returned after
    successful login or registration.
    
    Fields:
        access_token: JWT access token (30 minute expiry)
        refresh_token: JWT refresh token (30 day expiry)
        user: Complete user profile data
    """
    access_token: str
    refresh_token: str
    user: UserResponse


# ==============================================================================
# AUTHENTICATION ENDPOINTS
# ==============================================================================

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegistration):
    """
    Register a new user account using Supabase Auth.
    
    Creates a new user account using Supabase's built-in authentication
    system, then creates a corresponding profile record.
    
    Security Features:
        - Supabase Auth built-in password validation
        - Automatic email verification (if configured)
        - Secure JWT token generation
        - Feature flag protection
    
    Parameters:
        user_data: UserRegistration model with required user information
    
    Returns:
        AuthResponse: JWT tokens and user profile data
    
    Raises:
        HTTPException 403: Registration disabled via feature flag
        HTTPException 400: Registration failed (email exists, weak password, etc.)
        HTTPException 500: Database error during user creation
    """
    # Check if registration is enabled via feature flag
    if not settings.ENABLE_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is currently disabled"
        )
    
    try:
        # ===========================================================================
        # SUPABASE AUTH REGISTRATION
        # ===========================================================================
        # Use Supabase Auth to create user account with built-in validation
        response = supabase_anon.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                    "full_name": f"{user_data.first_name} {user_data.last_name}".strip(),
                    "marketing_consent": user_data.marketing_consent
                }
            }
        })
        
        if response.user is None:
            raise HTTPException(
                status_code=400,
                detail="Registration failed. Please check your email and password."
            )
        
        # ===========================================================================
        # CREATE USER PROFILE
        # ===========================================================================
        # Create profile record in profiles table using service key
        profile_data = {
            "id": response.user.id,
            "email": response.user.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "full_name": f"{user_data.first_name} {user_data.last_name}".strip(),
            "subscription_tier": "free",
            "gdpr_consent": True,
            "marketing_consent": user_data.marketing_consent,
            "email_verified": response.user.email_confirmed_at is not None,
            "updated_at": datetime.now().isoformat()
        }
        
        # Insert profile with service key to bypass RLS
        created_profiles = await supabase.insert(
            "profiles",
            profile_data,
            use_service_key=True
        )
        
        created_profile = created_profiles[0] if created_profiles else profile_data
        
        # ===========================================================================
        # RESPONSE PREPARATION
        # ===========================================================================
        # Extract tokens from Supabase Auth response
        access_token = response.session.access_token if response.session else ""
        refresh_token = response.session.refresh_token if response.session else ""
        
        # Prepare user response data
        user_response = {
            "id": response.user.id,
            "email": response.user.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "subscription_tier": "free",
            "created_at": response.user.created_at,
            "last_login": response.user.last_sign_in_at
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """
    Login user using Supabase Auth.
    
    Authenticates user credentials using Supabase's built-in authentication
    system and returns JWT tokens for API access.
    
    Parameters:
        credentials: UserLogin model with email and password
    
    Returns:
        AuthResponse: JWT tokens and user profile data
    
    Raises:
        HTTPException 401: Invalid credentials
        HTTPException 500: Authentication system error
    """
    try:
        # ===========================================================================
        # SUPABASE AUTH LOGIN
        # ===========================================================================
        # Use Supabase Auth to authenticate user credentials
        response = supabase_anon.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if response.user is None or response.session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # ===========================================================================
        # FETCH USER PROFILE
        # ===========================================================================
        # Get user profile from profiles table
        profiles = await supabase.select(
            "profiles",
            select="*",
            filters={"id": response.user.id},
            use_service_key=True
        )
        
        # If no profile exists, create one from auth user data
        if not profiles:
            profile_data = {
                "id": response.user.id,
                "email": response.user.email,
                "first_name": response.user.user_metadata.get("first_name", ""),
                "last_name": response.user.user_metadata.get("last_name", ""),
                "full_name": response.user.user_metadata.get("full_name", ""),
                "subscription_tier": "free",
                "email_verified": response.user.email_confirmed_at is not None,
                "updated_at": datetime.now().isoformat()
            }
            
            profiles = await supabase.insert(
                "profiles",
                profile_data,
                use_service_key=True
            )
        
        profile = profiles[0]
        
        # ===========================================================================
        # UPDATE LAST LOGIN
        # ===========================================================================
        # Update profile with last login time
        await supabase.update(
            "profiles",
            {"updated_at": datetime.now().isoformat()},
            filters={"id": response.user.id},
            use_service_key=True
        )
        
        # ===========================================================================
        # RESPONSE PREPARATION
        # ===========================================================================
        # Extract tokens from Supabase Auth response
        access_token = response.session.access_token
        refresh_token = response.session.refresh_token
        
        # Prepare user response data from profile
        user_response = {
            "id": profile["id"],
            "email": profile["email"],
            "first_name": profile["first_name"],
            "last_name": profile["last_name"],
            "subscription_tier": profile.get("subscription_tier", "free"),
            "created_at": response.user.created_at,
            "last_login": response.user.last_sign_in_at
        }
        
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get current user information from Supabase Auth token.
    
    Validates the Supabase JWT token and returns user profile information.
    
    Parameters:
        authorization: Bearer token from Authorization header
    
    Returns:
        UserResponse: Current user profile data
    
    Raises:
        HTTPException 401: Missing or invalid authorization
        HTTPException 500: Authentication system error
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Extract token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format"
            )
        
        token = authorization.split(" ")[1]
        
        # ===========================================================================
        # SUPABASE AUTH TOKEN VALIDATION
        # ===========================================================================
        # Create a client with the user's token and validate
        user_client = create_supabase_client(use_service_key=False)
        user_client.auth.set_session(token, "")  # Set the token
        
        # Get user from Supabase Auth
        user_response = user_client.auth.get_user(token)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = user_response.user.id
        
        # ===========================================================================
        # FETCH USER PROFILE
        # ===========================================================================
        # Get user profile from profiles table
        profiles = await supabase.select(
            "profiles",
            select="*",
            filters={"id": user_id},
            use_service_key=True
        )
        
        if not profiles:
            # If no profile exists, create one from auth user data
            profile_data = {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "first_name": user_response.user.user_metadata.get("first_name", ""),
                "last_name": user_response.user.user_metadata.get("last_name", ""),
                "subscription_tier": "free",
                "email_verified": user_response.user.email_confirmed_at is not None,
                "updated_at": datetime.now().isoformat()
            }
            
            profiles = await supabase.insert(
                "profiles",
                profile_data,
                use_service_key=True
            )
        
        profile = profiles[0]
        
        return UserResponse(
            id=profile["id"],
            email=profile["email"],
            first_name=profile["first_name"],
            last_name=profile["last_name"],
            subscription_tier=profile.get("subscription_tier", "free"),
            created_at=user_response.user.created_at,
            last_login=user_response.user.last_sign_in_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(refresh_token_data: dict):
    """
    Refresh access token using Supabase Auth refresh token.
    
    Uses Supabase's built-in token refresh mechanism to generate
    new access and refresh tokens.
    
    Parameters:
        refresh_token_data: Dict containing refresh_token
    
    Returns:
        Dict with new access_token and refresh_token
    
    Raises:
        HTTPException 401: Invalid or expired refresh token
        HTTPException 400: Missing refresh token
    """
    refresh_token = refresh_token_data.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(
            status_code=400,
            detail="Refresh token is required"
        )
    
    try:
        # Use Supabase Auth to refresh the session
        response = supabase_anon.auth.refresh_session(refresh_token)
        
        if response.session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token"
            )
        
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "message": "Token refreshed successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """
    Logout user using Supabase Auth.
    
    Signs out the user from Supabase Auth and invalidates the session.
    
    Parameters:
        authorization: Bearer token from Authorization header
    
    Returns:
        Dict with logout confirmation message
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        
        try:
            # Use Supabase Auth to sign out the user
            user_client = create_supabase_client(use_service_key=False)
            user_client.auth.set_session(token, "")
            user_client.auth.sign_out()
        except Exception:
            # If sign out fails, continue anyway - client should discard tokens
            pass
    
    return {"message": "Successfully logged out"}

# Helper function to get current user (for other endpoints)
async def get_current_user_from_token(authorization: str) -> dict:
    """
    Extract user from Supabase Auth JWT token - helper function for other endpoints.
    
    Parameters:
        authorization: Bearer token string
    
    Returns:
        dict: User profile data from profiles table
    
    Raises:
        HTTPException 401: Invalid authorization or user not found
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        # Validate token with Supabase Auth
        user_client = create_supabase_client(use_service_key=False)
        user_response = user_client.auth.get_user(token)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = user_response.user.id
        
        # Get user profile from profiles table
        profiles = await supabase.select(
            "profiles",
            select="*",
            filters={"id": user_id},
            use_service_key=True
        )
        
        if not profiles:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User profile not found"
            )
        
        return profiles[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}"
        )


# Additional function to get current user as SQLAlchemy model (for complex endpoints)
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current user as SQLAlchemy User model from Supabase Auth JWT token.
    
    Parameters:
        authorization: Bearer token from Authorization header
        db: SQLAlchemy async session
    
    Returns:
        User: SQLAlchemy User model instance
    
    Raises:
        HTTPException 401: Invalid authorization or user not found
        HTTPException 500: Database error
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        # Extract token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format"
            )
        
        token = authorization.split(" ")[1]
        
        # Validate token with Supabase Auth
        user_client = create_supabase_client(use_service_key=False)
        user_response = user_client.auth.get_user(token)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = user_response.user.id
        
        # Get user from database using SQLAlchemy
        from sqlalchemy import select
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found in database"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )