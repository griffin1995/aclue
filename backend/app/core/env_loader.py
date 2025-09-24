"""
Environment loading utilities for aclue backend.

This module provides utilities for loading, validating, and managing
environment variables across different deployment scenarios.

Features:
- Environment file loading with precedence
- Validation and error reporting
- Secret key generation
- Environment health checks
- Deployment-specific configuration
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv

from app.core.config import validate_environment, generate_secret_key, get_settings


class EnvironmentLoader:
    """
    Environment loader with comprehensive validation and error handling.

    Provides utilities for loading environment variables from various sources
    with proper precedence and validation.
    """

    def __init__(self, project_root: Optional[Path] = None):
        """
        Initialize environment loader.

        Args:
            project_root: Project root directory (auto-detected if not provided)
        """
        self.project_root = project_root or self._find_project_root()
        self.loaded_files: List[Path] = []
        self.validation_results: Optional[Dict] = None

    def _find_project_root(self) -> Path:
        """Find project root directory by looking for common markers."""
        current = Path(__file__).parent

        # Look for common project markers
        markers = ["requirements.txt", "pyproject.toml", "setup.py", ".git", "app"]

        for _ in range(10):  # Limit search depth
            if any((current / marker).exists() for marker in markers):
                return current
            current = current.parent

        # Fallback to current directory
        return Path.cwd()

    def load_environment(
        self,
        environment: Optional[str] = None,
        override: bool = False,
        verbose: bool = False,
    ) -> bool:
        """
        Load environment variables from appropriate files.

        Args:
            environment: Target environment (development/staging/production)
            override: Whether to override existing environment variables
            verbose: Enable verbose logging

        Returns:
            bool: True if loading was successful
        """
        success = True

        # Determine environment
        if environment is None:
            environment = os.getenv("ENVIRONMENT", "development")

        # Define file loading order (later files override earlier ones)
        env_files = [
            self.project_root / ".env.default",  # Default values
            self.project_root / ".env",  # Local environment
            self.project_root / f".env.{environment}",  # Environment-specific
            self.project_root / ".env.local",  # Local overrides
        ]

        # Load each file that exists
        for env_file in env_files:
            if env_file.exists():
                try:
                    load_dotenv(env_file, override=override, verbose=verbose)
                    self.loaded_files.append(env_file)
                    if verbose:
                        print(f"✅ Loaded environment file: {env_file}")
                except Exception as e:
                    print(f"❌ Error loading {env_file}: {e}")
                    success = False

        # Validate loaded environment
        self.validation_results = validate_environment()

        if not self.validation_results["valid"]:
            success = False
            if verbose:
                self._print_validation_errors()

        return success

    def _print_validation_errors(self):
        """Print validation errors in a formatted way."""
        if not self.validation_results:
            return

        print("\n❌ Environment Validation Errors:")
        for error in self.validation_results["errors"]:
            print(f"  • {error}")

        if self.validation_results["warnings"]:
            print("\n⚠️  Environment Warnings:")
            for warning in self.validation_results["warnings"]:
                print(f"  • {warning}")

        if self.validation_results["missingRequired"]:
            print("\n🔑 Missing Required Variables:")
            for missing in self.validation_results["missingRequired"]:
                print(f"  • {missing}")

    def create_env_file(
        self, environment: str = "development", template_path: Optional[Path] = None
    ) -> Path:
        """
        Create a new environment file from template.

        Args:
            environment: Target environment
            template_path: Path to template file (.env.example)

        Returns:
            Path: Path to created environment file
        """
        if template_path is None:
            template_path = self.project_root / ".env.example"

        if not template_path.exists():
            raise FileNotFoundError(f"Template file not found: {template_path}")

        # Determine output file
        if environment == "development":
            output_file = self.project_root / ".env"
        else:
            output_file = self.project_root / f".env.{environment}"

        # Copy template to output file
        with open(template_path, "r") as template:
            content = template.read()

        # Replace placeholder values for development
        if environment == "development":
            content = self._apply_development_defaults(content)

        with open(output_file, "w") as output:
            output.write(content)

        print(f"✅ Created environment file: {output_file}")
        print("📝 Please review and update the values before using")

        return output_file

    def _apply_development_defaults(self, content: str) -> str:
        """Apply development-specific defaults to environment template."""
        replacements = {
            "your-secret-key-change-in-production-minimum-64-characters-required": generate_secret_key(),
            "postgresql://username:password@localhost:5432/aclue_dev": "postgresql://aclue:aclue_dev@localhost:5432/aclue_dev",
            "https://your-project-id.supabase.co": "https://localhost:54321",  # Local Supabase
            "your-supabase-anon-key-here": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",  # Placeholder
            "your-supabase-service-role-key-here": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",  # Placeholder
        }

        for placeholder, replacement in replacements.items():
            content = content.replace(placeholder, replacement)

        return content

    def check_environment_health(self) -> Dict[str, any]:
        """
        Perform comprehensive environment health check.

        Returns:
            Dict: Health check results
        """
        health = {
            "status": "healthy",
            "environment": os.getenv("ENVIRONMENT", "unknown"),
            "loaded_files": [str(f) for f in self.loaded_files],
            "validation": self.validation_results or validate_environment(),
            "required_missing": [],
            "security_issues": [],
            "warnings": [],
            "recommendations": [],
        }

        try:
            # Try to load settings to check for basic functionality
            settings = get_settings()

            # Check critical configuration
            if not settings.SECRET_KEY or len(settings.SECRET_KEY) < 64:
                health["security_issues"].append("SECRET_KEY is too short or missing")

            if not settings.DATABASE_URL:
                health["required_missing"].append("DATABASE_URL")

            if not settings.SUPABASE_URL:
                health["required_missing"].append("SUPABASE_URL")

            if settings.is_production and settings.DEBUG:
                health["security_issues"].append("DEBUG is enabled in production")

            # Check email configuration
            if settings.EMAIL_ENABLED and not settings.RESEND_API_KEY:
                health["warnings"].append(
                    "Email enabled but RESEND_API_KEY not configured"
                )

            # Check analytics configuration
            if settings.ENABLE_ANALYTICS and not settings.POSTHOG_API_KEY:
                health["recommendations"].append(
                    "Consider setting POSTHOG_API_KEY for analytics"
                )

            # Check monitoring configuration
            if settings.is_production and not settings.SENTRY_DSN:
                health["recommendations"].append(
                    "Consider setting up Sentry for production monitoring"
                )

            # Determine overall health status
            if health["required_missing"] or health["security_issues"]:
                health["status"] = "unhealthy"
            elif health["warnings"]:
                health["status"] = "warning"

        except Exception as e:
            health["status"] = "error"
            health["error"] = str(e)

        return health

    def generate_deployment_config(
        self, platform: str, environment: str = "production"
    ) -> str:
        """
        Generate deployment configuration for specific platforms.

        Args:
            platform: Deployment platform (railway, heroku, docker, vercel)
            environment: Target environment

        Returns:
            str: Platform-specific configuration
        """
        if platform.lower() == "railway":
            return self._generate_railway_config(environment)
        elif platform.lower() == "heroku":
            return self._generate_heroku_config(environment)
        elif platform.lower() == "docker":
            return self._generate_docker_config(environment)
        else:
            raise ValueError(f"Unsupported platform: {platform}")

    def _generate_railway_config(self, environment: str) -> str:
        """Generate Railway-specific configuration."""
        return """
# Railway Deployment Configuration
# Set these variables in Railway dashboard -> Variables

ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database (Railway will provide PostgreSQL URL)
DATABASE_URL=${{PGURL}}

# Security (generate secure values)
SECRET_KEY=<generate-64-char-secret>

# Supabase (use production instance)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=<your-production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-production-service-key>

# Email service
RESEND_API_KEY=<your-resend-api-key>

# CORS (production URLs only)
CORS_ORIGINS=["https://aclue.app","https://www.aclue.app"]
ALLOWED_HOSTS=["aclue-backend-production.up.railway.app"]

# External services
POSTHOG_API_KEY=<your-posthog-key>
SENTRY_DSN=<your-sentry-dsn>

# Production optimizations
GUNICORN_WORKERS=2
GUNICORN_MAX_REQUESTS=1000
FORCE_HTTPS=true
SECURE_COOKIES=true
"""

    def _generate_heroku_config(self, environment: str) -> str:
        """Generate Heroku-specific configuration."""
        return """
# Heroku Deployment Configuration
# Set these variables using: heroku config:set VAR=value

ENVIRONMENT=production
DEBUG=false
PORT=$PORT

# Database (Heroku will provide PostgreSQL URL)
DATABASE_URL=$DATABASE_URL

# Security
SECRET_KEY=<generate-64-char-secret>

# Add other required variables...
"""

    def _generate_docker_config(self, environment: str) -> str:
        """Generate Docker-specific configuration."""
        return """
# Docker Environment Configuration
# Use in docker-compose.yml or pass to docker run

environment:
  - ENVIRONMENT=production
  - DEBUG=false
  - DATABASE_URL=postgresql://user:pass@db:5432/aclue
  # Add other variables...

# Or use .env file with docker-compose
"""


def load_environment_with_fallback(
    environment: Optional[str] = None, verbose: bool = False
) -> Tuple[bool, Dict]:
    """
    Load environment with comprehensive fallback and validation.

    Args:
        environment: Target environment
        verbose: Enable verbose logging

    Returns:
        Tuple[bool, Dict]: (success, validation_results)
    """
    loader = EnvironmentLoader()
    success = loader.load_environment(environment, verbose=verbose)
    return success, loader.validation_results or {}


def setup_development_environment(force: bool = False) -> bool:
    """
    Set up development environment from template.

    Args:
        force: Force overwrite existing .env file

    Returns:
        bool: True if setup was successful
    """
    loader = EnvironmentLoader()
    env_file = loader.project_root / ".env"

    if env_file.exists() and not force:
        print(f"Environment file already exists: {env_file}")
        print("Use force=True to overwrite")
        return False

    try:
        loader.create_env_file("development")
        print("✅ Development environment setup complete")
        print("\n📋 Next steps:")
        print("1. Review the generated .env file")
        print("2. Update placeholder values with real configuration")
        print("3. Start your development database")
        print("4. Run environment validation: python -m app.core.config validate")
        return True
    except Exception as e:
        print(f"❌ Failed to setup development environment: {e}")
        return False


def validate_deployment_environment(platform: str) -> Dict:
    """
    Validate environment for specific deployment platform.

    Args:
        platform: Deployment platform

    Returns:
        Dict: Validation results specific to platform
    """
    general_validation = validate_environment()

    platform_requirements = {
        "railway": {
            "required_vars": ["DATABASE_URL", "SECRET_KEY"],
            "recommended_vars": ["SENTRY_DSN", "RESEND_API_KEY"],
        },
        "heroku": {
            "required_vars": ["DATABASE_URL", "SECRET_KEY", "PORT"],
            "recommended_vars": ["SENTRY_DSN", "RESEND_API_KEY"],
        },
        "docker": {
            "required_vars": ["DATABASE_URL", "SECRET_KEY"],
            "recommended_vars": ["REDIS_URL", "SENTRY_DSN"],
        },
    }

    if platform not in platform_requirements:
        return {**general_validation, "platform_error": f"Unknown platform: {platform}"}

    requirements = platform_requirements[platform]

    # Check platform-specific requirements
    missing_required = []
    missing_recommended = []

    for var in requirements["required_vars"]:
        if not os.getenv(var):
            missing_required.append(var)

    for var in requirements["recommended_vars"]:
        if not os.getenv(var):
            missing_recommended.append(var)

    return {
        **general_validation,
        "platform": platform,
        "platform_missing_required": missing_required,
        "platform_missing_recommended": missing_recommended,
        "platform_ready": len(missing_required) == 0,
    }


if __name__ == "__main__":
    """CLI interface for environment management."""
    import argparse

    parser = argparse.ArgumentParser(description="Environment management utilities")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Load command
    load_parser = subparsers.add_parser("load", help="Load environment variables")
    load_parser.add_argument("--environment", "-e", help="Target environment")
    load_parser.add_argument(
        "--verbose", "-v", action="store_true", help="Verbose output"
    )

    # Validate command
    validate_parser = subparsers.add_parser("validate", help="Validate environment")
    validate_parser.add_argument("--platform", "-p", help="Deployment platform")

    # Setup command
    setup_parser = subparsers.add_parser("setup", help="Setup development environment")
    setup_parser.add_argument(
        "--force", "-f", action="store_true", help="Force overwrite"
    )

    # Health command
    health_parser = subparsers.add_parser("health", help="Environment health check")

    # Generate command
    generate_parser = subparsers.add_parser(
        "generate", help="Generate deployment config"
    )
    generate_parser.add_argument("platform", help="Platform (railway/heroku/docker)")
    generate_parser.add_argument(
        "--environment", "-e", default="production", help="Environment"
    )

    args = parser.parse_args()

    if args.command == "load":
        success, results = load_environment_with_fallback(
            args.environment, args.verbose
        )
        sys.exit(0 if success else 1)

    elif args.command == "validate":
        if args.platform:
            results = validate_deployment_environment(args.platform)
        else:
            results = validate_environment()

        print("Environment Validation Results:")
        print(f"Valid: {results['valid']}")
        if "platform" in results:
            print(f"Platform: {results['platform']}")
            print(f"Platform Ready: {results['platform_ready']}")

        if results.get("errors"):
            print("\nErrors:")
            for error in results["errors"]:
                print(f"  - {error}")

        sys.exit(0 if results["valid"] else 1)

    elif args.command == "setup":
        success = setup_development_environment(args.force)
        sys.exit(0 if success else 1)

    elif args.command == "health":
        loader = EnvironmentLoader()
        loader.load_environment(verbose=True)
        health = loader.check_environment_health()

        print("Environment Health Check:")
        print(f"Status: {health['status']}")
        print(f"Environment: {health['environment']}")
        print(f"Loaded Files: {len(health['loaded_files'])}")

        if health.get("required_missing"):
            print(f"Missing Required: {health['required_missing']}")

        if health.get("security_issues"):
            print(f"Security Issues: {health['security_issues']}")

        sys.exit(0 if health["status"] == "healthy" else 1)

    elif args.command == "generate":
        loader = EnvironmentLoader()
        try:
            config = loader.generate_deployment_config(args.platform, args.environment)
            print(config)
        except ValueError as e:
            print(f"Error: {e}")
            sys.exit(1)

    else:
        parser.print_help()
        sys.exit(1)
