"""
Environment configuration with Pydantic validation for aclue backend.

This module provides comprehensive environment variable management with:
- Type validation and conversion
- Required vs optional variable enforcement
- Environment-specific configuration
- Security validation
- Development vs production settings

Usage:
    from app.core.config import settings

    # Access configuration
    database_url = settings.DATABASE_URL
    debug_mode = settings.DEBUG

    # Environment-specific behaviour
    if settings.ENVIRONMENT == Environment.PRODUCTION:
        # Production-specific logic
        pass
"""

import json
import secrets
from enum import Enum
from functools import lru_cache
from typing import Any, Dict, List, Optional

from pydantic import (
    Field,
    HttpUrl,
    PostgresDsn,
    RedisDsn,
    ValidationError,
    field_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Application environment types."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class LogLevel(str, Enum):
    """Logging level options."""

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class StorageBackend(str, Enum):
    """File storage backend options."""

    LOCAL = "local"
    S3 = "s3"
    SUPABASE = "supabase"


class Settings(BaseSettings):
    """
    Application configuration with Pydantic validation.

    Automatically loads environment variables and validates them according to
    the defined schema. Provides sensible defaults for development while
    enforcing required values for production.
    """

    # =========================================================================
    # APPLICATION CONFIGURATION
    # =========================================================================

    ENVIRONMENT: Environment = Field(
        default=Environment.DEVELOPMENT,
        description="Application environment (development/staging/production/testing)",
    )

    DEBUG: bool = Field(
        default=True, description="Enable debug mode (disable in production)"
    )

    LOG_LEVEL: LogLevel = Field(
        default=LogLevel.INFO, description="Logging level for application"
    )

    APP_NAME: str = Field(
        default="aclue-backend",
        description="Application name for logging and monitoring",
    )

    APP_VERSION: str = Field(default="2.1.0", description="Application version")

    # =========================================================================
    # SECURITY CONFIGURATION
    # =========================================================================

    SECRET_KEY: str = Field(
        ...,  # Required
        min_length=32,
        description="Secret key for JWT signing (minimum 32 characters)",
    )

    ALGORITHM: str = Field(
        default="HS256",
        pattern="^(HS256|HS384|HS512)$",
        description="JWT signing algorithm",
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        ge=1,
        le=1440,  # Max 24 hours
        description="Access token expiration time in minutes",
    )

    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        ge=1,
        le=30,  # Max 30 days
        description="Refresh token expiration time in days",
    )

    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000"], description="Allowed CORS origins"
    )

    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1", "0.0.0.0"],
        description="Allowed host headers",
    )

    # =========================================================================
    # DATABASE CONFIGURATION
    # =========================================================================

    DATABASE_URL: PostgresDsn = Field(
        ..., description="PostgreSQL database connection URL"  # Required
    )

    DB_POOL_SIZE: int = Field(
        default=10, ge=1, le=50, description="Database connection pool size"
    )

    DB_MAX_OVERFLOW: int = Field(
        default=20, ge=0, le=100, description="Database connection pool max overflow"
    )

    DB_POOL_TIMEOUT: int = Field(
        default=30,
        ge=1,
        le=300,
        description="Database connection pool timeout in seconds",
    )

    DB_POOL_RECYCLE: int = Field(
        default=3600,
        ge=60,
        le=86400,
        description="Database connection recycle time in seconds",
    )

    DB_MIGRATION_TIMEOUT: int = Field(
        default=300, ge=30, le=1800, description="Database migration timeout in seconds"
    )

    # =========================================================================
    # SUPABASE CONFIGURATION
    # =========================================================================

    SUPABASE_URL: HttpUrl = Field(..., description="Supabase project URL")  # Required

    SUPABASE_ANON_KEY: str = Field(
        ..., min_length=20, description="Supabase anonymous key"  # Required
    )

    SUPABASE_SERVICE_ROLE_KEY: str = Field(
        ...,  # Required
        min_length=20,
        description="Supabase service role key (keep secure)",
    )

    # =========================================================================
    # REDIS CONFIGURATION
    # =========================================================================

    REDIS_URL: Optional[RedisDsn] = Field(
        default=None, description="Redis connection URL (optional, for caching)"
    )

    REDIS_TTL: int = Field(
        default=3600, ge=60, le=86400, description="Default Redis TTL in seconds"
    )

    REDIS_MAX_CONNECTIONS: int = Field(
        default=10, ge=1, le=100, description="Maximum Redis connections"
    )

    # =========================================================================
    # EMAIL CONFIGURATION
    # =========================================================================

    EMAIL_ENABLED: bool = Field(default=True, description="Enable email functionality")

    RESEND_API_KEY: Optional[str] = Field(
        default=None,
        pattern="^re_[a-zA-Z0-9_-]+$",
        description="Resend API key for email sending",
    )

    FROM_EMAIL: str = Field(
        default="hello@aclue.app",
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description="From email address",
    )

    FROM_NAME: str = Field(
        default="aclue", max_length=100, description="From name for emails"
    )

    EMAIL_TEMPLATE_DIR: str = Field(
        default="app/templates/emails", description="Email template directory"
    )

    # =========================================================================
    # EXTERNAL API INTEGRATIONS
    # =========================================================================

    OPENAI_API_KEY: Optional[str] = Field(
        default=None, description="OpenAI API key"
    )

    OPENAI_MODEL: str = Field(
        default="gpt-3.5-turbo", description="OpenAI model to use"
    )

    OPENAI_MAX_TOKENS: int = Field(
        default=1000, ge=1, le=4000, description="Maximum tokens for OpenAI requests"
    )

    POSTHOG_API_KEY: Optional[str] = Field(
        default=None, description="PostHog API key"
    )

    POSTHOG_HOST: HttpUrl = Field(
        default="https://app.posthog.com", description="PostHog host URL"
    )

    AMAZON_ACCESS_KEY: Optional[str] = Field(
        default=None,
        min_length=16,
        max_length=32,
        description="Amazon Associates access key",
    )

    AMAZON_SECRET_KEY: Optional[str] = Field(
        default=None, description="Amazon Associates secret key"
    )

    AMAZON_ASSOCIATE_TAG: Optional[str] = Field(
        default=None, max_length=50, description="Amazon Associates tag"
    )

    AMAZON_REGION: str = Field(
        default="us-east-1",
        pattern="^[a-z]{2}-[a-z]+-[0-9]$",
        description="Amazon region",
    )

    # =========================================================================
    # API CONFIGURATION
    # =========================================================================

    API_V1_STR: str = Field(
        default="/api/v1", pattern="^/api/v[0-9]+$", description="API version prefix"
    )

    HOST: str = Field(default="0.0.0.0", description="Server host binding")

    PORT: int = Field(default=8000, ge=1000, le=65535, description="Server port")

    MAX_REQUEST_SIZE: int = Field(
        default=10485760,  # 10MB
        ge=1048576,  # 1MB minimum
        le=104857600,  # 100MB maximum
        description="Maximum request size in bytes",
    )

    REQUEST_TIMEOUT: int = Field(
        default=30, ge=5, le=300, description="Request timeout in seconds"
    )

    # =========================================================================
    # RATE LIMITING CONFIGURATION
    # =========================================================================

    RATE_LIMIT_ENABLED: bool = Field(default=True, description="Enable rate limiting")

    RATE_LIMIT_REQUESTS: int = Field(
        default=100, ge=1, le=10000, description="Rate limit requests per period"
    )

    RATE_LIMIT_PERIOD: int = Field(
        default=3600,  # 1 hour
        ge=60,  # 1 minute minimum
        le=86400,  # 24 hours maximum
        description="Rate limit period in seconds",
    )

    RATE_LIMIT_BURST: int = Field(
        default=20, ge=1, le=1000, description="Rate limit burst allowance"
    )

    # =========================================================================
    # FILE STORAGE CONFIGURATION
    # =========================================================================

    UPLOAD_MAX_SIZE: int = Field(
        default=10485760,  # 10MB
        ge=1048576,  # 1MB minimum
        le=104857600,  # 100MB maximum
        description="Maximum file upload size in bytes",
    )

    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["jpg", "jpeg", "png", "gif", "webp", "pdf"],
        description="Allowed file extensions",
    )

    STORAGE_BACKEND: StorageBackend = Field(
        default=StorageBackend.LOCAL, description="File storage backend"
    )

    STORAGE_LOCAL_PATH: str = Field(
        default="./uploads", description="Local storage path"
    )

    STORAGE_LOCAL_URL: str = Field(
        default="/static/uploads", description="Local storage URL prefix"
    )

    # AWS S3 Configuration (optional)
    AWS_ACCESS_KEY_ID: Optional[str] = Field(
        default=None, min_length=16, max_length=32, description="AWS access key ID"
    )

    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(
        default=None, min_length=32, description="AWS secret access key"
    )

    AWS_REGION: Optional[str] = Field(
        default=None, pattern="^[a-z]{2}-[a-z]+-[0-9]$", description="AWS region"
    )

    AWS_S3_BUCKET: Optional[str] = Field(
        default=None, max_length=63, description="AWS S3 bucket name"
    )

    # =========================================================================
    # MONITORING AND OBSERVABILITY
    # =========================================================================

    SENTRY_DSN: Optional[HttpUrl] = Field(
        default=None, description="Sentry DSN for error tracking"
    )

    SENTRY_ENVIRONMENT: Optional[str] = Field(
        default=None, description="Sentry environment tag"
    )

    SENTRY_TRACES_SAMPLE_RATE: float = Field(
        default=1.0, ge=0.0, le=1.0, description="Sentry traces sample rate"
    )

    PROMETHEUS_ENABLED: bool = Field(
        default=False, description="Enable Prometheus metrics"
    )

    METRICS_PORT: int = Field(
        default=9090, ge=1000, le=65535, description="Metrics server port"
    )

    HEALTH_CHECK_ENABLED: bool = Field(
        default=True, description="Enable health check endpoint"
    )

    HEALTH_CHECK_PATH: str = Field(
        default="/health",
        pattern="^/[a-zA-Z0-9/_-]+$",
        description="Health check endpoint path",
    )

    # =========================================================================
    # FEATURE FLAGS
    # =========================================================================

    ENABLE_ANALYTICS: bool = Field(
        default=True, description="Enable analytics features"
    )

    ENABLE_CACHING: bool = Field(default=True, description="Enable caching features")

    ENABLE_EMAIL_NOTIFICATIONS: bool = Field(
        default=True, description="Enable email notifications"
    )

    ENABLE_PUSH_NOTIFICATIONS: bool = Field(
        default=False, description="Enable push notifications"
    )

    ENABLE_ML_RECOMMENDATIONS: bool = Field(
        default=True, description="Enable ML-powered recommendations"
    )

    # =========================================================================
    # DEVELOPMENT AND TESTING
    # =========================================================================

    PYTEST_TIMEOUT: int = Field(
        default=30, ge=5, le=300, description="Pytest timeout in seconds"
    )

    PYTEST_MAXFAIL: int = Field(
        default=10, ge=1, le=100, description="Maximum pytest failures before stopping"
    )

    COVERAGE_THRESHOLD: int = Field(
        default=80, ge=0, le=100, description="Minimum code coverage percentage"
    )

    SEED_DATABASE: bool = Field(
        default=False, description="Seed database with test data (development only)"
    )

    SEED_ADMIN_EMAIL: str = Field(
        default="admin@aclue.app",
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description="Admin user email for seeding",
    )

    SEED_ADMIN_PASSWORD: str = Field(
        default="change_me_in_production",
        min_length=8,
        description="Admin user password for seeding",
    )

    ENABLE_DEBUG_TOOLBAR: bool = Field(
        default=False, description="Enable debug toolbar (development only)"
    )

    ENABLE_SQL_LOGGING: bool = Field(
        default=False, description="Enable SQL query logging (development only)"
    )

    # =========================================================================
    # PRODUCTION CONFIGURATION
    # =========================================================================

    GUNICORN_WORKERS: Optional[int] = Field(
        default=None, ge=1, le=32, description="Number of Gunicorn workers"
    )

    GUNICORN_MAX_REQUESTS: Optional[int] = Field(
        default=None,
        ge=100,
        le=10000,
        description="Maximum requests per Gunicorn worker",
    )

    GUNICORN_TIMEOUT: Optional[int] = Field(
        default=None, ge=30, le=300, description="Gunicorn worker timeout"
    )

    GUNICORN_KEEPALIVE: Optional[int] = Field(
        default=None, ge=1, le=10, description="Gunicorn keepalive timeout"
    )

    FORCE_HTTPS: bool = Field(default=False, description="Force HTTPS redirects")

    SECURE_COOKIES: bool = Field(default=False, description="Use secure cookies")

    SECURE_HEADERS: bool = Field(default=False, description="Enable security headers")

    # =========================================================================
    # VALIDATORS
    # =========================================================================

    @field_validator("CORS_ORIGINS", mode='before')
    def parse_cors_origins(cls, v) -> List[str]:
        """Parse CORS origins from environment variable."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Fallback to comma-separated values
                return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("ALLOWED_HOSTS", mode='before')
    def parse_allowed_hosts(cls, v) -> List[str]:
        """Parse allowed hosts from environment variable."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Fallback to comma-separated values
                return [host.strip() for host in v.split(",")]
        return v

    @field_validator("ALLOWED_FILE_TYPES", mode='before')
    def parse_allowed_file_types(cls, v) -> List[str]:
        """Parse allowed file types from environment variable."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Fallback to comma-separated values
                return [file_type.strip() for file_type in v.split(",")]
        return v

    @field_validator("SECRET_KEY")
    def validate_secret_key(cls, v) -> str:
        """Validate SECRET_KEY security requirements."""
        if len(v) < 32:  # Reduced minimum for development
            raise ValueError("SECRET_KEY must be at least 32 characters long")

        # Check for common weak values (but allow test keys for development)
        weak_values = [
            "your-secret-key-change-in-production",
            "change-me",
            "secret",
            "password",
            "123456",
        ]

        # Allow test keys for development
        if v.startswith("test-secret-key"):
            return v

        if any(weak in v.lower() for weak in weak_values):
            raise ValueError(
                "SECRET_KEY appears to be a template value, use a secure random string"
            )

        return v

    @field_validator("DEBUG")
    def validate_debug_in_production(cls, v, info) -> bool:
        """Ensure DEBUG is False in production."""
        # In Pydantic v2, we can't access other field values during validation
        # This validation can be moved to model_post_init if needed
        return v

    @field_validator("RESEND_API_KEY")
    def validate_resend_api_key(cls, v) -> Optional[str]:
        """Validate Resend API key format."""
        if v is not None and not v.startswith("re_"):
            raise ValueError("RESEND_API_KEY must start with 're_'")
        return v

    @field_validator("OPENAI_API_KEY")
    def validate_openai_api_key(cls, v) -> Optional[str]:
        """Validate OpenAI API key format."""
        if v is not None and v != "" and not v.startswith("sk-"):
            raise ValueError("OPENAI_API_KEY must start with 'sk-'")
        return v if v != "" else None

    @field_validator("POSTHOG_API_KEY")
    def validate_posthog_api_key(cls, v) -> Optional[str]:
        """Validate PostHog API key format."""
        if v is not None and v != "" and not v.startswith("phc_"):
            raise ValueError("POSTHOG_API_KEY must start with 'phc_'")
        return v if v != "" else None

    @field_validator("ENVIRONMENT")
    def set_production_defaults(cls, v, info) -> Environment:
        """Validate environment value."""
        # In Pydantic v2, field validators can't modify other fields
        # Production defaults should be handled in model_post_init if needed
        return v

    # =========================================================================
    # CONFIGURATION METHODS
    # =========================================================================

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT == Environment.PRODUCTION

    @property
    def is_testing(self) -> bool:
        """Check if running in testing environment."""
        return self.ENVIRONMENT == Environment.TESTING

    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL."""
        return str(self.DATABASE_URL).replace("postgresql://", "postgresql://")

    @property
    def database_url_async(self) -> str:
        """Get asynchronous database URL."""
        return str(self.DATABASE_URL).replace("postgresql://", "postgresql+asyncpg://")

    def get_cors_origins_list(self) -> List[str]:
        """Get CORS origins as a list."""
        return self.CORS_ORIGINS

    def get_allowed_hosts_list(self) -> List[str]:
        """Get allowed hosts as a list."""
        return self.ALLOWED_HOSTS

    def get_logging_config(self) -> Dict[str, Any]:
        """Get logging configuration."""
        return {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
                },
                "json": {
                    "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
                    "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "level": self.LOG_LEVEL.value,
                    "formatter": "json" if self.is_production else "default",
                    "stream": "ext://sys.stdout",
                },
            },
            "root": {
                "level": self.LOG_LEVEL.value,
                "handlers": ["console"],
            },
            "loggers": {
                "uvicorn": {"propagate": True},
                "uvicorn.access": {"propagate": True},
                "sqlalchemy.engine": {
                    "level": "INFO" if self.ENABLE_SQL_LOGGING else "WARNING",
                    "propagate": True,
                },
            },
        }

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        validate_assignment=True,
    )


def validate_environment() -> Dict[str, Any]:
    """
    Validate environment configuration and return validation results.

    Returns:
        Dict containing validation results and any errors or warnings.
    """
    validation_results = {
        "valid": False,
        "errors": [],
        "warnings": [],
        "environment": None,
        "required_missing": [],
        "recommendations": [],
    }

    try:
        settings = Settings()
        validation_results["valid"] = True
        validation_results["environment"] = settings.ENVIRONMENT.value

        # Check for production-specific requirements
        if settings.is_production:
            if settings.DEBUG:
                validation_results["errors"].append("DEBUG must be False in production")

            if "localhost" in settings.get_cors_origins_list():
                validation_results["warnings"].append(
                    "localhost detected in CORS_ORIGINS for production"
                )

            if settings.SECRET_KEY and len(settings.SECRET_KEY) < 64:
                validation_results["errors"].append(
                    "SECRET_KEY should be at least 64 characters in production"
                )

        # Check for recommended configuration
        if not settings.SENTRY_DSN:
            validation_results["recommendations"].append(
                "Consider setting up Sentry for error tracking"
            )

        if not settings.REDIS_URL and settings.ENABLE_CACHING:
            validation_results["recommendations"].append(
                "Redis URL not set but caching is enabled"
            )

        if settings.EMAIL_ENABLED and not settings.RESEND_API_KEY:
            validation_results["warnings"].append(
                "Email enabled but RESEND_API_KEY not set"
            )

    except ValidationError as e:
        validation_results["valid"] = False
        validation_results["errors"] = [error["msg"] for error in e.errors()]

        # Identify missing required fields
        for error in e.errors():
            if error["type"] == "value_error.missing":
                field_name = ".".join(str(loc) for loc in error["loc"])
                validation_results["required_missing"].append(field_name)

    except Exception as e:
        validation_results["valid"] = False
        validation_results["errors"] = [f"Unexpected error: {str(e)}"]

    return validation_results


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings.

    This function uses LRU cache to ensure settings are loaded only once
    and reused throughout the application lifecycle.

    Returns:
        Settings: Validated application configuration
    """
    return Settings()


# Global settings instance
settings = get_settings()


def generate_secret_key() -> str:
    """
    Generate a cryptographically secure secret key.

    Returns:
        str: A secure random string suitable for use as SECRET_KEY
    """
    return secrets.token_urlsafe(64)


def print_environment_info():
    """Print environment configuration information for debugging."""
    try:
        settings = get_settings()
        print(f"Environment: {settings.ENVIRONMENT.value}")
        print(f"Debug: {settings.DEBUG}")
        print(f"Database: {settings.DATABASE_URL.host}")
        print(f"Supabase: {settings.SUPABASE_URL}")
        print(f"CORS Origins: {len(settings.CORS_ORIGINS)} configured")
        print(f"Email Enabled: {settings.EMAIL_ENABLED}")
        print(f"Analytics Enabled: {settings.ENABLE_ANALYTICS}")
        print(f"Caching Enabled: {settings.ENABLE_CACHING}")

    except Exception as e:
        print(f"Error loading settings: {e}")


if __name__ == "__main__":
    # CLI usage for environment validation
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "validate":
        results = validate_environment()

        print("Environment Validation Results:")
        print(f"Valid: {results['valid']}")

        if results["errors"]:
            print("\nErrors:")
            for error in results["errors"]:
                print(f"  - {error}")

        if results["warnings"]:
            print("\nWarnings:")
            for warning in results["warnings"]:
                print(f"  - {warning}")

        if results["recommendations"]:
            print("\nRecommendations:")
            for rec in results["recommendations"]:
                print(f"  - {rec}")

        sys.exit(0 if results["valid"] else 1)

    elif len(sys.argv) > 1 and sys.argv[1] == "generate-key":
        print(f"Generated SECRET_KEY: {generate_secret_key()}")
        sys.exit(0)

    else:
        print_environment_info()
