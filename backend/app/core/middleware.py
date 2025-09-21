"""Middleware configuration for FastAPI application."""

import time
import uuid
from fastapi import FastAPI, Request, Response
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings

logger = structlog.get_logger(__name__)

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address)

# Custom rate limit exceeded handler with structured logging
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    logger.warning(
        "Rate limit exceeded",
        client_ip=request.client.host if request.client else None,
        path=str(request.url.path),
        method=request.method,
        limit=str(exc.detail),
    )
    response = Response(
        content='{"error": "Rate limit exceeded", "detail": "Too many requests"}',
        status_code=429,
        headers={"Content-Type": "application/json"}
    )
    response.headers["Retry-After"] = "60"  # Suggest retry after 60 seconds
    return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests and responses."""
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        # Log request
        logger.info(
            "Request started",
            request_id=request_id,
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        # Process request
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(
                "Request failed",
                request_id=request_id,
                error=str(e),
                error_type=type(e).__name__,
            )
            raise
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            "Request completed",
            request_id=request_id,
            status_code=response.status_code,
            process_time=process_time,
        )
        
        # Add headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(process_time)
        
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware for adding comprehensive security headers.

    Implements OWASP security headers best practices including:
    - Content Security Policy (CSP)
    - Strict Transport Security (HSTS)
    - X-Frame-Options for clickjacking prevention
    - X-Content-Type-Options for MIME sniffing prevention
    - Referrer Policy for privacy
    - Permissions Policy for feature restrictions
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Core security headers - Always applied
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"

        # Permissions Policy - Restrict browser features
        response.headers["Permissions-Policy"] = (
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), "
            "magnetometer=(), microphone=(), payment=(), usb=()"
        )

        # Content Security Policy - Prevent XSS and injection attacks
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.aclue.app https://aclue-backend-production.up.railway.app",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ]

        # Add report-uri in production for CSP violation reporting
        if settings.ENVIRONMENT == "production":
            csp_directives.append("report-uri /api/v1/csp-report")

        response.headers["Content-Security-Policy"] = "; ".join(csp_directives)

        # Production-only security headers
        if settings.ENVIRONMENT == "production":
            # HTTP Strict Transport Security - Force HTTPS
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )
            # Expect-CT for certificate transparency
            response.headers["Expect-CT"] = (
                "max-age=86400, enforce"
            )

        # Remove sensitive headers that might leak information
        if "X-Powered-By" in response.headers:
            del response.headers["X-Powered-By"]
        if "Server" in response.headers:
            del response.headers["Server"]

        return response


def setup_middleware(app: FastAPI) -> None:
    """Configure middleware for the FastAPI application."""

    # Rate limiting state and exception handler
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

    # Security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # Request logging middleware
    app.add_middleware(RequestLoggingMiddleware)

    # Gzip compression middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS if settings.ALLOWED_HOSTS != ["*"] else ["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
    )

    # Trusted host middleware for production
    if settings.ENVIRONMENT == "production" and settings.ALLOWED_HOSTS != ["*"]:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.ALLOWED_HOSTS,
        )

    logger.info("Middleware setup complete")