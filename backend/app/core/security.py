"""
Security utilities for token creation and validation.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
import jwt
from app.core.config import settings


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Token payload data
        expires_delta: Token expiration time (defaults to 24 hours)
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    
    # Use a default secret for tests
    secret_key = getattr(settings, 'SECRET_KEY', 'test-secret-key')
    algorithm = getattr(settings, 'ALGORITHM', 'HS256')
    
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        secret_key = getattr(settings, 'SECRET_KEY', 'test-secret-key')
        algorithm = getattr(settings, 'ALGORITHM', 'HS256')
        
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None