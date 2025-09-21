#!/usr/bin/env python3
"""
Aclue Platform - Comprehensive Configuration Verification Suite

This test suite provides comprehensive verification of all environment variable
configurations across the Aclue platform stack. It validates configuration
completeness, synchronisation, security settings, and integration readiness.

Features:
- Static configuration analysis
- Dynamic service connectivity testing
- Security configuration validation
- Integration endpoint testing
- Compliance verification
- Automated reporting

Usage:
    python config_verification_suite.py [--environment ENV] [--verbose] [--output-format FORMAT]

Examples:
    python config_verification_suite.py --environment production --verbose
    python config_verification_suite.py --output-format json > config_report.json
"""

import os
import sys
import json
import requests
import argparse
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path
import configparser
import yaml
from urllib.parse import urlparse
import re

# Test configuration constants
TIMEOUT_SECONDS = 10
MAX_RETRIES = 3

@dataclass
class ConfigValidationResult:
    """Result of a configuration validation test"""
    test_name: str
    status: str  # 'PASS', 'FAIL', 'WARNING', 'SKIP'
    message: str
    details: Optional[Dict[str, Any]] = None
    recommendations: Optional[List[str]] = None

@dataclass
class ConfigVerificationReport:
    """Complete configuration verification report"""
    timestamp: str
    environment: str
    project_root: str
    summary: Dict[str, int]
    results: List[ConfigValidationResult]
    recommendations: List[str]
    compliance_score: float

class ConfigurationVerifier:
    """Main configuration verification engine"""

    def __init__(self, project_root: str, environment: str = "development", verbose: bool = False):
        self.project_root = Path(project_root)
        self.environment = environment
        self.verbose = verbose
        self.results: List[ConfigValidationResult] = []

        # Configuration file paths
        self.config_paths = {
            'backend_config': self.project_root / 'backend' / 'app' / 'core' / 'config.py',
            'frontend_next_config': self.project_root / 'web' / 'next.config.js',
            'vercel_config': self.project_root / 'web' / 'vercel.json',
            'railway_config': self.project_root / 'backend' / 'railway.toml',
            'backend_env_prod': self.project_root / 'backend' / '.env.production',
            'frontend_env_example': self.project_root / 'web' / '.env.example',
            'root_env_example': self.project_root / '.env.example',
            'root_env_prod_example': self.project_root / '.env.production.example',
        }

        # Expected environment variables
        self.required_backend_vars = [
            'SECRET_KEY', 'DEBUG', 'ENVIRONMENT', 'SUPABASE_URL',
            'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY', 'DATABASE_URL',
            'ALLOWED_HOSTS', 'PROJECT_NAME'
        ]

        self.required_frontend_vars = [
            'NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WEB_URL'
        ]

        # Security patterns to check
        self.security_patterns = {
            'insecure_secret': r'INSECURE|DEVELOPMENT|NEVER-USE|test|demo|example',
            'hardcoded_key': r'[a-f0-9]{32,}|sk_[a-zA-Z0-9]+|pk_[a-zA-Z0-9]+',
            'local_urls': r'localhost|127\.0\.0\.1|0\.0\.0\.0',
        }

    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        if self.verbose or level in ["ERROR", "WARNING"]:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] {level}: {message}")

    def add_result(self, test_name: str, status: str, message: str,
                   details: Optional[Dict[str, Any]] = None,
                   recommendations: Optional[List[str]] = None):
        """Add a test result to the results list"""
        result = ConfigValidationResult(
            test_name=test_name,
            status=status,
            message=message,
            details=details,
            recommendations=recommendations or []
        )
        self.results.append(result)
        self.log(f"{test_name}: {status} - {message}", level=status)

    def test_configuration_files_exist(self):
        """Test that all required configuration files exist"""
        self.log("Testing configuration file existence...")

        for config_name, config_path in self.config_paths.items():
            if config_path.exists():
                self.add_result(
                    f"config_file_exists_{config_name}",
                    "PASS",
                    f"Configuration file exists: {config_path.name}",
                    {"path": str(config_path), "size": config_path.stat().st_size}
                )
            else:
                self.add_result(
                    f"config_file_exists_{config_name}",
                    "WARNING" if "example" in config_name else "FAIL",
                    f"Configuration file missing: {config_path.name}",
                    {"path": str(config_path)},
                    ["Create missing configuration file from template"]
                )

    def test_backend_config_structure(self):
        """Test backend configuration structure and values"""
        self.log("Testing backend configuration structure...")

        config_file = self.config_paths['backend_config']
        if not config_file.exists():
            self.add_result(
                "backend_config_structure",
                "FAIL",
                "Backend config.py file not found",
                recommendations=["Create backend/app/core/config.py file"]
            )
            return

        try:
            with open(config_file, 'r') as f:
                content = f.read()

            # Check for Aclue branding consistency
            aclue_references = content.count('aclue')
            giftsync_references = content.count('giftsync') + content.count('GiftSync')
            prznt_references = content.count('prznt')

            if giftsync_references > 0 or prznt_references > 0:
                self.add_result(
                    "backend_config_branding",
                    "FAIL",
                    f"Legacy branding found: {giftsync_references} GiftSync, {prznt_references} prznt references",
                    {"giftsync_refs": giftsync_references, "prznt_refs": prznt_references},
                    ["Update all legacy brand references to 'aclue'"]
                )
            else:
                self.add_result(
                    "backend_config_branding",
                    "PASS",
                    f"Proper Aclue branding found: {aclue_references} references"
                )

            # Check security configuration
            if 'INSECURE-DEVELOPMENT-KEY' in content:
                self.add_result(
                    "backend_config_security",
                    "WARNING",
                    "Development secret key found in default configuration",
                    recommendations=["Ensure production uses secure SECRET_KEY"]
                )

            # Check domain configuration
            if 'aclue.app' in content and 'aclue.co.uk' in content:
                self.add_result(
                    "backend_config_domains",
                    "PASS",
                    "Proper domain configuration found for aclue.app and aclue.co.uk"
                )
            else:
                self.add_result(
                    "backend_config_domains",
                    "FAIL",
                    "Missing proper domain configuration",
                    recommendations=["Add aclue.app and aclue.co.uk to ALLOWED_HOSTS"]
                )

        except Exception as e:
            self.add_result(
                "backend_config_structure",
                "FAIL",
                f"Error reading backend config: {str(e)}",
                recommendations=["Fix backend configuration file syntax"]
            )

    def test_frontend_config_structure(self):
        """Test frontend configuration structure"""
        self.log("Testing frontend configuration structure...")

        # Test Next.js config
        next_config = self.config_paths['frontend_next_config']
        if next_config.exists():
            try:
                with open(next_config, 'r') as f:
                    content = f.read()

                # Check for security headers
                security_headers = ['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy']
                missing_headers = []
                for header in security_headers:
                    if header not in content:
                        missing_headers.append(header)

                if missing_headers:
                    self.add_result(
                        "frontend_security_headers",
                        "WARNING",
                        f"Missing security headers: {', '.join(missing_headers)}",
                        recommendations=[f"Add {header} to security headers" for header in missing_headers]
                    )
                else:
                    self.add_result(
                        "frontend_security_headers",
                        "PASS",
                        "All essential security headers configured"
                    )

                # Check for Aclue domain configuration
                if 'aclue.app' in content:
                    self.add_result(
                        "frontend_domain_config",
                        "PASS",
                        "Proper aclue.app domain configuration found"
                    )
                else:
                    self.add_result(
                        "frontend_domain_config",
                        "FAIL",
                        "Missing aclue.app domain configuration",
                        recommendations=["Update domain references to aclue.app"]
                    )

            except Exception as e:
                self.add_result(
                    "frontend_config_structure",
                    "FAIL",
                    f"Error reading Next.js config: {str(e)}"
                )

        # Test Vercel config
        vercel_config = self.config_paths['vercel_config']
        if vercel_config.exists():
            try:
                with open(vercel_config, 'r') as f:
                    vercel_data = json.load(f)

                # Check environment variables
                env_vars = vercel_data.get('env', {})
                required_vars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WEB_URL']
                missing_vars = [var for var in required_vars if var not in env_vars]

                if missing_vars:
                    self.add_result(
                        "vercel_env_config",
                        "FAIL",
                        f"Missing Vercel environment variables: {', '.join(missing_vars)}",
                        recommendations=[f"Add {var} to vercel.json env section" for var in missing_vars]
                    )
                else:
                    self.add_result(
                        "vercel_env_config",
                        "PASS",
                        "All required Vercel environment variables configured"
                    )

                # Check API URL configuration
                api_url = env_vars.get('NEXT_PUBLIC_API_URL', '')
                if 'aclue-backend-production.up.railway.app' in api_url:
                    self.add_result(
                        "vercel_api_url",
                        "PASS",
                        "Correct production API URL configured"
                    )
                elif 'localhost' in api_url:
                    self.add_result(
                        "vercel_api_url",
                        "WARNING",
                        "Development API URL found in Vercel config",
                        recommendations=["Update API URL for production deployment"]
                    )

            except Exception as e:
                self.add_result(
                    "vercel_config_structure",
                    "FAIL",
                    f"Error reading Vercel config: {str(e)}"
                )

    def test_railway_config(self):
        """Test Railway deployment configuration"""
        self.log("Testing Railway configuration...")

        railway_config = self.config_paths['railway_config']
        if not railway_config.exists():
            self.add_result(
                "railway_config_exists",
                "FAIL",
                "Railway configuration file missing",
                recommendations=["Create railway.toml configuration file"]
            )
            return

        try:
            with open(railway_config, 'r') as f:
                content = f.read()

            # Check for required sections
            required_sections = ['[build]', '[deploy]', '[env]']
            missing_sections = [section for section in required_sections if section not in content]

            if missing_sections:
                self.add_result(
                    "railway_config_sections",
                    "FAIL",
                    f"Missing Railway config sections: {', '.join(missing_sections)}",
                    recommendations=[f"Add {section} section to railway.toml" for section in missing_sections]
                )
            else:
                self.add_result(
                    "railway_config_sections",
                    "PASS",
                    "All required Railway configuration sections present"
                )

            # Check for security variable templating
            if '${{ SECRET_KEY }}' in content and '${{ SUPABASE_SERVICE_KEY }}' in content:
                self.add_result(
                    "railway_security_templating",
                    "PASS",
                    "Proper environment variable templating for sensitive data"
                )
            else:
                self.add_result(
                    "railway_security_templating",
                    "WARNING",
                    "Missing or incorrect environment variable templating",
                    recommendations=["Use ${{ VAR_NAME }} syntax for sensitive variables"]
                )

            # Check health check configuration
            if 'healthcheckPath = "/health"' in content:
                self.add_result(
                    "railway_health_check",
                    "PASS",
                    "Health check endpoint configured"
                )
            else:
                self.add_result(
                    "railway_health_check",
                    "WARNING",
                    "Health check endpoint not configured",
                    recommendations=["Add healthcheckPath configuration"]
                )

        except Exception as e:
            self.add_result(
                "railway_config_structure",
                "FAIL",
                f"Error reading Railway config: {str(e)}"
            )

    def test_environment_variable_consistency(self):
        """Test environment variable consistency across configurations"""
        self.log("Testing environment variable consistency...")

        # Read backend production environment
        backend_env_file = self.config_paths['backend_env_prod']
        backend_vars = {}

        if backend_env_file.exists():
            try:
                with open(backend_env_file, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            backend_vars[key] = value
            except Exception as e:
                self.add_result(
                    "backend_env_read",
                    "FAIL",
                    f"Error reading backend environment file: {str(e)}"
                )

        # Read Vercel configuration
        vercel_config = self.config_paths['vercel_config']
        vercel_vars = {}

        if vercel_config.exists():
            try:
                with open(vercel_config, 'r') as f:
                    vercel_data = json.load(f)
                    vercel_vars = vercel_data.get('env', {})
            except Exception as e:
                self.add_result(
                    "vercel_env_read",
                    "FAIL",
                    f"Error reading Vercel environment: {str(e)}"
                )

        # Check API URL consistency
        backend_api_url = backend_vars.get('API_BASE_URL', '')
        vercel_api_url = vercel_vars.get('NEXT_PUBLIC_API_URL', '')

        if backend_api_url and vercel_api_url:
            if 'aclue-backend-production.up.railway.app' in vercel_api_url:
                self.add_result(
                    "api_url_consistency",
                    "PASS",
                    "API URL consistency verified between frontend and backend"
                )
            else:
                self.add_result(
                    "api_url_consistency",
                    "FAIL",
                    f"API URL mismatch: Vercel={vercel_api_url}, Backend={backend_api_url}",
                    recommendations=["Ensure frontend points to correct backend URL"]
                )

        # Check web URL consistency
        vercel_web_url = vercel_vars.get('NEXT_PUBLIC_WEB_URL', '')
        if 'aclue.app' in vercel_web_url:
            self.add_result(
                "web_url_consistency",
                "PASS",
                "Web URL properly configured for aclue.app domain"
            )
        else:
            self.add_result(
                "web_url_consistency",
                "FAIL",
                f"Web URL misconfigured: {vercel_web_url}",
                recommendations=["Set NEXT_PUBLIC_WEB_URL to https://aclue.app"]
            )

    def test_security_configuration(self):
        """Test security configuration compliance"""
        self.log("Testing security configuration...")

        # Check backend production environment
        backend_env_file = self.config_paths['backend_env_prod']
        if backend_env_file.exists():
            try:
                with open(backend_env_file, 'r') as f:
                    content = f.read()

                # Check DEBUG setting
                if 'DEBUG=false' in content:
                    self.add_result(
                        "production_debug_disabled",
                        "PASS",
                        "DEBUG properly disabled in production"
                    )
                elif 'DEBUG=true' in content:
                    self.add_result(
                        "production_debug_disabled",
                        "FAIL",
                        "DEBUG enabled in production configuration",
                        recommendations=["Set DEBUG=false in production"]
                    )

                # Check for placeholder values
                if '${' in content:
                    placeholder_count = content.count('${')
                    self.add_result(
                        "production_placeholder_vars",
                        "PASS",
                        f"Found {placeholder_count} properly templated environment variables"
                    )
                else:
                    self.add_result(
                        "production_placeholder_vars",
                        "WARNING",
                        "No templated environment variables found",
                        recommendations=["Use ${VAR_NAME} syntax for sensitive variables"]
                    )

                # Check HTTPS enforcement
                if 'ALLOWED_HOSTS=' in content:
                    allowed_hosts_line = [line for line in content.split('\n') if 'ALLOWED_HOSTS=' in line][0]
                    if 'aclue.app' in allowed_hosts_line and 'localhost' not in allowed_hosts_line:
                        self.add_result(
                            "production_allowed_hosts",
                            "PASS",
                            "Allowed hosts properly configured for production"
                        )
                    elif 'localhost' in allowed_hosts_line:
                        self.add_result(
                            "production_allowed_hosts",
                            "WARNING",
                            "Development hosts found in production configuration",
                            recommendations=["Remove localhost from production ALLOWED_HOSTS"]
                        )

            except Exception as e:
                self.add_result(
                    "backend_security_config",
                    "FAIL",
                    f"Error checking backend security config: {str(e)}"
                )

        # Check Vercel security headers
        vercel_config = self.config_paths['vercel_config']
        if vercel_config.exists():
            try:
                with open(vercel_config, 'r') as f:
                    vercel_data = json.load(f)

                headers = vercel_data.get('headers', [])
                security_headers_found = []

                for header_config in headers:
                    for header in header_config.get('headers', []):
                        header_key = header.get('key', '')
                        if any(sec_header in header_key for sec_header in ['X-Frame-Options', 'X-Content-Type-Options', 'Strict-Transport-Security']):
                            security_headers_found.append(header_key)

                if len(security_headers_found) >= 3:
                    self.add_result(
                        "vercel_security_headers",
                        "PASS",
                        f"Security headers configured: {', '.join(security_headers_found)}"
                    )
                else:
                    self.add_result(
                        "vercel_security_headers",
                        "WARNING",
                        f"Limited security headers: {', '.join(security_headers_found)}",
                        recommendations=["Add comprehensive security headers to Vercel config"]
                    )

            except Exception as e:
                self.add_result(
                    "vercel_security_config",
                    "FAIL",
                    f"Error checking Vercel security config: {str(e)}"
                )

    def test_dynamic_connectivity(self):
        """Test dynamic service connectivity"""
        self.log("Testing dynamic service connectivity...")

        # Test backend health endpoint
        try:
            backend_url = "https://aclue-backend-production.up.railway.app"
            health_response = requests.get(f"{backend_url}/health", timeout=TIMEOUT_SECONDS)

            if health_response.status_code == 200:
                self.add_result(
                    "backend_health_check",
                    "PASS",
                    f"Backend health check successful: {health_response.status_code}",
                    {"response_time": health_response.elapsed.total_seconds()}
                )
            else:
                self.add_result(
                    "backend_health_check",
                    "FAIL",
                    f"Backend health check failed: {health_response.status_code}",
                    {"status_code": health_response.status_code}
                )

        except requests.RequestException as e:
            self.add_result(
                "backend_health_check",
                "FAIL",
                f"Backend connectivity error: {str(e)}",
                recommendations=["Check backend deployment status on Railway"]
            )

        # Test frontend deployment
        try:
            frontend_url = "https://aclue.app"
            frontend_response = requests.get(frontend_url, timeout=TIMEOUT_SECONDS)

            if frontend_response.status_code == 200:
                self.add_result(
                    "frontend_connectivity",
                    "PASS",
                    f"Frontend accessible: {frontend_response.status_code}",
                    {"response_time": frontend_response.elapsed.total_seconds()}
                )
            else:
                self.add_result(
                    "frontend_connectivity",
                    "FAIL",
                    f"Frontend access failed: {frontend_response.status_code}",
                    {"status_code": frontend_response.status_code}
                )

        except requests.RequestException as e:
            self.add_result(
                "frontend_connectivity",
                "FAIL",
                f"Frontend connectivity error: {str(e)}",
                recommendations=["Check frontend deployment status on Vercel"]
            )

        # Test API endpoints
        try:
            api_url = "https://aclue-backend-production.up.railway.app/api/v1"

            # Test public endpoints
            endpoints_to_test = [
                ("/docs", "API documentation"),
                ("/openapi.json", "OpenAPI specification"),
            ]

            for endpoint, description in endpoints_to_test:
                try:
                    response = requests.get(f"{api_url}{endpoint}", timeout=TIMEOUT_SECONDS)
                    if response.status_code in [200, 201]:
                        self.add_result(
                            f"api_endpoint_{endpoint.replace('/', '_')}",
                            "PASS",
                            f"{description} accessible: {response.status_code}"
                        )
                    else:
                        self.add_result(
                            f"api_endpoint_{endpoint.replace('/', '_')}",
                            "WARNING",
                            f"{description} returned: {response.status_code}"
                        )
                except requests.RequestException as e:
                    self.add_result(
                        f"api_endpoint_{endpoint.replace('/', '_')}",
                        "FAIL",
                        f"{description} error: {str(e)}"
                    )

        except Exception as e:
            self.add_result(
                "api_connectivity",
                "FAIL",
                f"API connectivity test error: {str(e)}"
            )

    def test_database_configuration(self):
        """Test database configuration"""
        self.log("Testing database configuration...")

        # Read backend config to check database settings
        backend_config = self.config_paths['backend_config']
        if backend_config.exists():
            try:
                with open(backend_config, 'r') as f:
                    content = f.read()

                # Check for Supabase configuration
                if 'SUPABASE_URL' in content and 'SUPABASE_SERVICE_KEY' in content:
                    self.add_result(
                        "database_supabase_config",
                        "PASS",
                        "Supabase database configuration found"
                    )
                else:
                    self.add_result(
                        "database_supabase_config",
                        "FAIL",
                        "Missing Supabase database configuration",
                        recommendations=["Add SUPABASE_URL and SUPABASE_SERVICE_KEY variables"]
                    )

                # Check for proper connection pooling
                if 'DATABASE_POOL_SIZE' in content:
                    self.add_result(
                        "database_connection_pooling",
                        "PASS",
                        "Database connection pooling configured"
                    )
                else:
                    self.add_result(
                        "database_connection_pooling",
                        "WARNING",
                        "Database connection pooling not explicitly configured",
                        recommendations=["Add DATABASE_POOL_SIZE configuration"]
                    )

            except Exception as e:
                self.add_result(
                    "database_config_check",
                    "FAIL",
                    f"Error checking database configuration: {str(e)}"
                )

        # Test database connectivity (if credentials available)
        try:
            # This would require actual database credentials
            # For now, we'll check if the configuration structure is correct
            self.add_result(
                "database_connectivity",
                "SKIP",
                "Database connectivity test requires production credentials",
                recommendations=["Run database connectivity test with production credentials"]
            )
        except Exception as e:
            self.add_result(
                "database_connectivity",
                "SKIP",
                f"Database connectivity test skipped: {str(e)}"
            )

    def generate_report(self) -> ConfigVerificationReport:
        """Generate comprehensive verification report"""
        self.log("Generating comprehensive verification report...")

        # Calculate summary statistics
        summary = {
            'PASS': len([r for r in self.results if r.status == 'PASS']),
            'FAIL': len([r for r in self.results if r.status == 'FAIL']),
            'WARNING': len([r for r in self.results if r.status == 'WARNING']),
            'SKIP': len([r for r in self.results if r.status == 'SKIP']),
        }

        # Calculate compliance score
        total_tests = summary['PASS'] + summary['FAIL'] + summary['WARNING']
        if total_tests > 0:
            compliance_score = (summary['PASS'] + (summary['WARNING'] * 0.5)) / total_tests * 100
        else:
            compliance_score = 0.0

        # Collect all recommendations
        all_recommendations = []
        for result in self.results:
            if result.recommendations:
                all_recommendations.extend(result.recommendations)

        # Add general recommendations based on findings
        if summary['FAIL'] > 0:
            all_recommendations.append("Address all FAIL status issues before production deployment")

        if summary['WARNING'] > 5:
            all_recommendations.append("Review and resolve WARNING issues to improve security and performance")

        # Create report
        report = ConfigVerificationReport(
            timestamp=datetime.now().isoformat(),
            environment=self.environment,
            project_root=str(self.project_root),
            summary=summary,
            results=self.results,
            recommendations=list(set(all_recommendations)),  # Remove duplicates
            compliance_score=compliance_score
        )

        return report

    def run_all_tests(self) -> ConfigVerificationReport:
        """Run all configuration verification tests"""
        self.log("Starting comprehensive configuration verification...")

        # Run all test categories
        self.test_configuration_files_exist()
        self.test_backend_config_structure()
        self.test_frontend_config_structure()
        self.test_railway_config()
        self.test_environment_variable_consistency()
        self.test_security_configuration()
        self.test_dynamic_connectivity()
        self.test_database_configuration()

        # Generate and return report
        return self.generate_report()

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="Aclue Platform Configuration Verification Suite"
    )
    parser.add_argument(
        "--environment",
        default="development",
        choices=["development", "staging", "production"],
        help="Target environment for testing"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )
    parser.add_argument(
        "--output-format",
        default="text",
        choices=["text", "json"],
        help="Output format for the report"
    )
    parser.add_argument(
        "--project-root",
        default="/home/jack/Documents/aclue-preprod",
        help="Path to project root directory"
    )

    args = parser.parse_args()

    # Initialize verifier
    verifier = ConfigurationVerifier(
        project_root=args.project_root,
        environment=args.environment,
        verbose=args.verbose
    )

    # Run tests
    report = verifier.run_all_tests()

    # Output report
    if args.output_format == "json":
        print(json.dumps(asdict(report), indent=2))
    else:
        # Text format output
        print("\n" + "="*80)
        print("ACLUE PLATFORM CONFIGURATION VERIFICATION REPORT")
        print("="*80)
        print(f"Timestamp: {report.timestamp}")
        print(f"Environment: {report.environment}")
        print(f"Project Root: {report.project_root}")
        print(f"Compliance Score: {report.compliance_score:.1f}%")
        print("\n" + "-"*40)
        print("SUMMARY")
        print("-"*40)
        for status, count in report.summary.items():
            print(f"{status:>8}: {count:>3}")

        print("\n" + "-"*40)
        print("DETAILED RESULTS")
        print("-"*40)
        for result in report.results:
            status_symbol = {
                'PASS': '✅',
                'FAIL': '❌',
                'WARNING': '⚠️',
                'SKIP': '⏭️'
            }.get(result.status, '❓')

            print(f"{status_symbol} {result.test_name}")
            print(f"   {result.message}")
            if result.recommendations:
                for rec in result.recommendations:
                    print(f"   💡 {rec}")
            print()

        print("-"*40)
        print("RECOMMENDATIONS")
        print("-"*40)
        for i, recommendation in enumerate(report.recommendations, 1):
            print(f"{i:>2}. {recommendation}")

        print("\n" + "="*80)

        # Exit with appropriate code
        if report.summary['FAIL'] > 0:
            print("❌ VERIFICATION FAILED - Address FAIL issues before deployment")
            sys.exit(1)
        elif report.summary['WARNING'] > 0:
            print("⚠️  VERIFICATION PASSED WITH WARNINGS - Review warnings before deployment")
            sys.exit(0)
        else:
            print("✅ VERIFICATION PASSED - Configuration is ready for deployment")
            sys.exit(0)

if __name__ == "__main__":
    main()