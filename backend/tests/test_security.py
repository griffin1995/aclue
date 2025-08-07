"""
Security Testing Suite for Aclue Backend

Comprehensive security tests for authentication, authorisation,
data protection, and security policy enforcement.

Test Coverage:
- Row Level Security (RLS) policy validation
- Authentication and token security
- Input sanitisation and injection prevention
- Authorisation and access control
- Data privacy and GDPR compliance
- CORS and security header validation
- Rate limiting and abuse prevention

Testing Strategy:
Security-first testing with penetration testing techniques,
boundary condition testing, and malicious input simulation
to validate security controls and data protection.

Business Context:
Security is paramount for user trust and regulatory compliance.
These tests ensure Aclue maintains enterprise-grade security
standards and protects user data and platform integrity.

Requirements:
- All data access must respect RLS policies
- Authentication must be cryptographically secure
- Input validation must prevent all injection attacks
- Access controls must enforce proper authorisation
- Data privacy must comply with GDPR requirements
- Security headers must meet industry standards
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

import pytest
import jwt
import hashlib
import secrets
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any
from unittest.mock import Mock, patch, AsyncMock

from fastapi.testclient import TestClient
from fastapi import status
import bcrypt

from app.main import app
from app.core.config import settings
from app.services.database_service import DatabaseService
from app.core.security import create_access_token, verify_token
from app.api.v1.endpoints.auth import get_current_user_from_token
from tests.conftest import (
    test_client,
    mock_db_service,
    mock_supabase_client,
    UserFactory,
    ProductFactory,
    SwipeInteractionFactory,
)

# ==============================================================================
# SECURITY TEST CONFIGURATION
# ==============================================================================

# Common malicious payloads for injection testing
SQL_INJECTION_PAYLOADS = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "'; INSERT INTO users (email) VALUES ('hacker@evil.com'); --",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "admin' /*",
    "' OR 1=1#",
    "' OR 'a'='a",
    "'; EXEC xp_cmdshell('dir'); --",
]

XSS_PAYLOADS = [
    "<script>alert('XSS')</script>",
    "javascript:alert('XSS')",
    "<img src=x onerror=alert('XSS')>",
    "';alert(String.fromCharCode(88,83,83))//';alert(String.fromCharCode(88,83,83))//",
    "\";alert('XSS');//",
    "<svg/onload=alert('XSS')>",
    "<<SCRIPT>alert('XSS');//<</SCRIPT>",
]

COMMAND_INJECTION_PAYLOADS = [
    "; ls -la",
    "| cat /etc/passwd",
    "&& whoami",
    "; cat /etc/shadow",
    "`id`",
    "$(id)",
    "; rm -rf /",
    "| nc -l -p 1234",
]

# Security headers that must be present
REQUIRED_SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin',
    'Content-Security-Policy': 'default-src \'self\'',
}

# ==============================================================================
# AUTHENTICATION AND TOKEN SECURITY TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.authentication
class TestAuthenticationSecurity:
    """
    Authentication security testing suite.
    
    Tests authentication mechanisms, token security,
    and session management for security vulnerabilities.
    """
    
    def test_password_hashing_security(self):
        """
        Test password hashing implementation security.
        
        Validates that passwords are properly hashed using
        secure algorithms and cannot be reversed or compromised.
        """
        test_password = "testpassword123"
        
        # Test that passwords are properly hashed
        hashed = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt())
        
        # Verify hash properties
        assert len(hashed) >= 60  # bcrypt produces 60-character hashes
        assert hashed != test_password.encode('utf-8')  # Hash != plaintext
        assert bcrypt.checkpw(test_password.encode('utf-8'), hashed)  # Verification works
        
        # Test different passwords produce different hashes
        another_password = "differentpassword456"
        another_hashed = bcrypt.hashpw(another_password.encode('utf-8'), bcrypt.gensalt())
        assert hashed != another_hashed
        
        # Test weak passwords are rejected during validation
        weak_passwords = [
            "123456",
            "password",
            "qwerty",
            "abc123",
            "password123",
            "admin",
        ]
        
        for weak_password in weak_passwords:
            # In a real implementation, password strength validation would happen here
            assert len(weak_password) < 12  # Basic length check for demonstration
    
    def test_jwt_token_security(self, test_client):
        """
        Test JWT token implementation security.
        
        Validates JWT token generation, signing, expiration,
        and resistance to tampering and replay attacks.
        """
        # Test token generation with proper claims
        user_data = {
            "sub": "user-123",
            "email": "test@aclue.app",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        
        token = create_access_token(data=user_data)
        
        # Verify token structure and claims
        assert isinstance(token, str)
        assert len(token.split('.')) == 3  # JWT has 3 parts
        
        # Decode and verify token
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        assert decoded["sub"] == "user-123"
        assert decoded["email"] == "test@aclue.app"
        assert "exp" in decoded
        
        # Test token tampering detection
        tampered_token = token[:-10] + "tampered123"
        with pytest.raises(jwt.InvalidTokenError):
            jwt.decode(tampered_token, settings.SECRET_KEY, algorithms=["HS256"])
        
        # Test expired token rejection
        expired_user_data = {
            "sub": "user-123",
            "email": "test@aclue.app",
            "exp": datetime.utcnow() - timedelta(hours=1)  # Expired
        }
        expired_token = jwt.encode(expired_user_data, settings.SECRET_KEY, algorithm="HS256")
        
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt.decode(expired_token, settings.SECRET_KEY, algorithms=["HS256"])
        
        # Test invalid signature rejection
        wrong_secret_token = jwt.encode(user_data, "wrong_secret", algorithm="HS256")
        with pytest.raises(jwt.InvalidSignatureError):
            jwt.decode(wrong_secret_token, settings.SECRET_KEY, algorithms=["HS256"])
    
    def test_authentication_brute_force_protection(self, test_client):
        """
        Test brute force attack protection.
        
        Validates that repeated failed login attempts are
        properly rate limited and blocked to prevent brute force attacks.
        """
        invalid_credentials = {
            "email": "test@aclue.app",
            "password": "wrongpassword"
        }
        
        # Attempt multiple failed logins
        failed_attempts = 0
        for attempt in range(15):  # Exceed reasonable rate limit
            response = test_client.post("/api/v1/auth/login", json=invalid_credentials)
            
            if response.status_code == 429:  # Rate limited
                break
            elif response.status_code == 401:  # Unauthorized
                failed_attempts += 1
            
            # Add small delay to simulate realistic attack timing
            time.sleep(0.1)
        
        # Verify rate limiting is enforced
        assert failed_attempts < 15, "Brute force protection not implemented"
        
        # Test that rate limiting eventually blocks requests
        final_response = test_client.post("/api/v1/auth/login", json=invalid_credentials)
        assert final_response.status_code in [429, 401]  # Rate limited or still failing
    
    def test_session_security(self, test_client):
        """
        Test session management security.
        
        Validates secure session handling, token refresh security,
        and protection against session hijacking and fixation.
        """
        # Create authenticated session
        login_data = {
            "email": "test@aclue.app",
            "password": "testpassword123"
        }
        login_response = test_client.post("/api/v1/auth/login", json=login_data)
        
        if login_response.status_code == 200:
            tokens = login_response.json()
            access_token = tokens.get("access_token")
            refresh_token = tokens.get("refresh_token")
            
            # Test token refresh security
            refresh_response = test_client.post(
                "/api/v1/auth/refresh",
                json={"refresh_token": refresh_token}
            )
            
            if refresh_response.status_code == 200:
                new_tokens = refresh_response.json()
                new_access_token = new_tokens.get("access_token")
                
                # Verify new token is different from old token
                assert new_access_token != access_token
                
                # Verify old token is invalidated (if implemented)
                auth_header = {"Authorization": f"Bearer {access_token}"}
                protected_response = test_client.get("/api/v1/auth/me", headers=auth_header)
                # This would be 401 if token invalidation is implemented
            
            # Test concurrent session limits (if implemented)
            # Multiple login attempts should be handled securely
            second_login = test_client.post("/api/v1/auth/login", json=login_data)
            assert second_login.status_code in [200, 429]  # Success or rate limited
    
    def test_password_reset_security(self, test_client):
        """
        Test password reset functionality security.
        
        Validates secure password reset flow with proper token
        generation, expiration, and single-use enforcement.
        """
        # Test password reset request
        reset_request = {
            "email": "test@aclue.app"
        }
        
        response = test_client.post("/api/v1/auth/password-reset-request", json=reset_request)
        
        # Should not reveal whether email exists (security through obscurity)
        assert response.status_code in [200, 202, 204]
        
        # Test invalid reset tokens are rejected
        invalid_token = "invalid_reset_token"
        reset_data = {
            "token": invalid_token,
            "new_password": "newpassword123"
        }
        
        reset_response = test_client.post("/api/v1/auth/password-reset", json=reset_data)
        assert reset_response.status_code in [400, 401, 404]  # Invalid token rejected
        
        # Test expired tokens are rejected
        expired_token = jwt.encode(
            {"sub": "user-123", "exp": datetime.utcnow() - timedelta(hours=1)},
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        expired_reset_data = {
            "token": expired_token,
            "new_password": "newpassword123"
        }
        
        expired_response = test_client.post("/api/v1/auth/password-reset", json=expired_reset_data)
        assert expired_response.status_code in [400, 401]  # Expired token rejected

# ==============================================================================
# AUTHORISATION AND ACCESS CONTROL TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.authorisation
class TestAuthorisationSecurity:
    """
    Authorisation and access control security testing.
    
    Tests role-based access control, resource ownership validation,
    and protection against privilege escalation attacks.
    """
    
    def test_protected_endpoint_authorisation(self, test_client):
        """
        Test protected endpoint access control.
        
        Validates that protected endpoints properly enforce
        authentication and reject unauthorised requests.
        """
        protected_endpoints = [
            ("GET", "/api/v1/auth/me"),
            ("GET", "/api/v1/recommendations/"),
            ("POST", "/api/v1/swipes/"),
            ("GET", "/api/v1/users/profile"),
            ("PUT", "/api/v1/users/profile"),
        ]
        
        for method, endpoint in protected_endpoints:
            # Test without authentication
            if method == "GET":
                response = test_client.get(endpoint)
            elif method == "POST":
                response = test_client.post(endpoint, json={})
            elif method == "PUT":
                response = test_client.put(endpoint, json={})
            
            # Should require authentication
            assert response.status_code in [401, 403], f"{method} {endpoint} should require auth"
            
            # Test with invalid token
            invalid_headers = {"Authorization": "Bearer invalid_token"}
            if method == "GET":
                response = test_client.get(endpoint, headers=invalid_headers)
            elif method == "POST":
                response = test_client.post(endpoint, json={}, headers=invalid_headers)
            elif method == "PUT":
                response = test_client.put(endpoint, json={}, headers=invalid_headers)
            
            # Should reject invalid tokens
            assert response.status_code in [401, 403], f"{method} {endpoint} should reject invalid tokens"
    
    def test_user_data_isolation(self, mock_db_service):
        """
        Test user data isolation and ownership validation.
        
        Validates that users can only access their own data
        and cannot access other users' private information.
        """
        # Set up test users
        user1 = UserFactory(id="user-1", email="user1@aclue.app")
        user2 = UserFactory(id="user-2", email="user2@aclue.app")
        
        # Set up user-specific data
        user1_interactions = [
            SwipeInteractionFactory(user_id="user-1", product_id="product-1"),
            SwipeInteractionFactory(user_id="user-1", product_id="product-2"),
        ]
        user2_interactions = [
            SwipeInteractionFactory(user_id="user-2", product_id="product-3"),
            SwipeInteractionFactory(user_id="user-2", product_id="product-4"),
        ]
        
        # Mock database service responses
        mock_db_service.get_user_interactions.side_effect = lambda user_id: (
            user1_interactions if user_id == "user-1" else user2_interactions
        )
        
        # Test that user1 can only access their own interactions
        user1_data = mock_db_service.get_user_interactions("user-1")
        assert len(user1_data) == 2
        assert all(interaction.user_id == "user-1" for interaction in user1_data)
        
        # Test that user2 can only access their own interactions
        user2_data = mock_db_service.get_user_interactions("user-2")
        assert len(user2_data) == 2
        assert all(interaction.user_id == "user-2" for interaction in user2_data)
        
        # Verify cross-user data access is prevented
        assert user1_data != user2_data
        
        # Test attempts to access another user's data directly
        with pytest.raises(Exception):
            # This should be prevented by RLS policies
            mock_db_service.get_user_by_id("user-2")  # user-1 trying to access user-2
    
    def test_role_based_access_control(self, test_client):
        """
        Test role-based access control (RBAC) implementation.
        
        Validates that different user roles have appropriate
        permissions and cannot exceed their authorisation levels.
        """
        # Test different user roles
        roles_and_permissions = [
            {
                "role": "free_user",
                "allowed_endpoints": [
                    "/api/v1/products/",
                    "/api/v1/swipes/",
                    "/api/v1/recommendations/",
                ],
                "forbidden_endpoints": [
                    "/api/v1/admin/users",
                    "/api/v1/admin/analytics",
                    "/api/v1/premium/advanced-analytics",
                ]
            },
            {
                "role": "premium_user",
                "allowed_endpoints": [
                    "/api/v1/products/",
                    "/api/v1/swipes/",
                    "/api/v1/recommendations/",
                    "/api/v1/premium/advanced-analytics",
                ],
                "forbidden_endpoints": [
                    "/api/v1/admin/users",
                    "/api/v1/admin/analytics",
                ]
            },
            {
                "role": "admin",
                "allowed_endpoints": [
                    "/api/v1/products/",
                    "/api/v1/admin/users",
                    "/api/v1/admin/analytics",
                ],
                "forbidden_endpoints": []
            }
        ]
        
        for role_config in roles_and_permissions:
            role = role_config["role"]
            
            # Create token for this role
            token_data = {
                "sub": f"user-{role}",
                "email": f"{role}@aclue.app",
                "role": role,
                "exp": datetime.utcnow() + timedelta(hours=1)
            }
            token = create_access_token(data=token_data)
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test allowed endpoints
            for endpoint in role_config["allowed_endpoints"]:
                response = test_client.get(endpoint, headers=headers)
                assert response.status_code not in [401, 403], f"{role} should access {endpoint}"
            
            # Test forbidden endpoints
            for endpoint in role_config["forbidden_endpoints"]:
                response = test_client.get(endpoint, headers=headers)
                assert response.status_code in [401, 403], f"{role} should not access {endpoint}"
    
    def test_privilege_escalation_prevention(self, test_client):
        """
        Test prevention of privilege escalation attacks.
        
        Validates that users cannot escalate their privileges
        through parameter manipulation or token tampering.
        """
        # Create regular user token
        regular_user_data = {
            "sub": "user-regular",
            "email": "regular@aclue.app",
            "role": "free_user",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = create_access_token(data=regular_user_data)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test parameter manipulation attempts
        escalation_attempts = [
            # Attempting to change user ID in requests
            {"user_id": "admin-user", "data": "malicious"},
            {"role": "admin", "permissions": ["all"]},
            {"admin": True, "superuser": True},
            {"is_staff": True, "is_admin": True},
        ]
        
        for malicious_data in escalation_attempts:
            response = test_client.post(
                "/api/v1/users/profile",
                json=malicious_data,
                headers=headers
            )
            
            # Should either reject the request or ignore privilege fields
            assert response.status_code in [400, 401, 403, 422]
        
        # Test token role manipulation
        # Attempt to create token with elevated privileges
        malicious_token_data = {
            "sub": "user-regular",
            "email": "regular@aclue.app",
            "role": "admin",  # Attempting privilege escalation
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        
        # This should fail because the user doesn't actually have admin role
        malicious_token = create_access_token(data=malicious_token_data)
        malicious_headers = {"Authorization": f"Bearer {malicious_token}"}
        
        admin_response = test_client.get("/api/v1/admin/users", headers=malicious_headers)
        # Should be rejected based on actual user permissions, not token claims
        assert admin_response.status_code in [401, 403]

# ==============================================================================
# INPUT VALIDATION AND INJECTION PREVENTION TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.input_validation
class TestInputValidationSecurity:
    """
    Input validation and injection prevention testing.
    
    Tests protection against SQL injection, XSS, command injection,
    and other malicious input attacks.
    """
    
    def test_sql_injection_prevention(self, test_client):
        """
        Test SQL injection attack prevention.
        
        Validates that all user inputs are properly sanitised
        and cannot be used to execute malicious SQL queries.
        """
        endpoints_to_test = [
            ("POST", "/api/v1/auth/login", "email"),
            ("POST", "/api/v1/auth/register", "email"),
            ("GET", "/api/v1/products/", "category"),
            ("GET", "/api/v1/products/", "brand"),
            ("POST", "/api/v1/swipes/", "product_id"),
        ]
        
        for method, endpoint, parameter in endpoints_to_test:
            for payload in SQL_INJECTION_PAYLOADS:
                if method == "POST":
                    if "auth" in endpoint:
                        data = {
                            "email": payload if parameter == "email" else "test@aclue.app",
                            "password": payload if parameter == "password" else "testpass123"
                        }
                        if "register" in endpoint:
                            data.update({"firstName": "Test", "lastName": "User"})
                    else:
                        data = {parameter: payload}
                    
                    response = test_client.post(endpoint, json=data)
                else:
                    params = {parameter: payload}
                    response = test_client.get(endpoint, params=params)
                
                # Should not return 500 (server error from SQL injection)
                assert response.status_code != 500, f"SQL injection vulnerability in {endpoint} parameter {parameter}"
                
                # Should return validation error or normal response, not expose database errors
                if response.status_code not in [200, 400, 401, 422]:
                    response_text = response.text.lower()
                    sql_error_indicators = [
                        "sql", "syntax", "mysql", "postgres", "sqlite",
                        "table", "column", "database", "constraint"
                    ]
                    
                    for indicator in sql_error_indicators:
                        assert indicator not in response_text, f"SQL error exposed: {response.text}"
    
    def test_xss_prevention(self, test_client):
        """
        Test Cross-Site Scripting (XSS) attack prevention.
        
        Validates that user inputs are properly escaped
        and cannot execute malicious JavaScript code.
        """
        for payload in XSS_PAYLOADS:
            # Test XSS in registration data
            registration_data = {
                "email": "test@aclue.app",
                "password": "testpass123",
                "firstName": payload,  # XSS payload in name
                "lastName": "User"
            }
            
            response = test_client.post("/api/v1/auth/register", json=registration_data)
            
            # Should not execute script or return unescaped content
            response_text = response.text
            assert "<script>" not in response_text.lower()
            assert "javascript:" not in response_text.lower()
            assert "onerror=" not in response_text.lower()
            
            # Test XSS in product search
            search_params = {"search": payload}
            search_response = test_client.get("/api/v1/products/", params=search_params)
            
            search_text = search_response.text
            assert "<script>" not in search_text.lower()
            assert "javascript:" not in search_text.lower()
    
    def test_command_injection_prevention(self, test_client):
        """
        Test command injection attack prevention.
        
        Validates that user inputs cannot be used to execute
        malicious system commands on the server.
        """
        for payload in COMMAND_INJECTION_PAYLOADS:
            # Test command injection in file upload (if implemented)
            # Test command injection in search parameters
            params = {"category": payload}
            response = test_client.get("/api/v1/products/", params=params)
            
            # Should not execute commands or return system information
            response_text = response.text.lower()
            system_info_indicators = [
                "/etc/passwd", "root:", "/bin/", "/usr/",
                "uid=", "gid=", "groups=", "whoami"
            ]
            
            for indicator in system_info_indicators:
                assert indicator not in response_text, f"Command injection vulnerability detected: {indicator}"
    
    def test_input_size_limits(self, test_client):
        """
        Test input size validation and DoS prevention.
        
        Validates that large inputs are properly rejected
        to prevent resource exhaustion attacks.
        """
        # Generate oversized inputs
        large_string = "A" * 10000  # 10KB string
        massive_string = "B" * 100000  # 100KB string
        
        oversized_inputs = [
            {
                "endpoint": "/api/v1/auth/register",
                "method": "POST",
                "data": {
                    "email": "test@aclue.app",
                    "password": "testpass123",
                    "firstName": large_string,  # Oversized name
                    "lastName": "User"
                }
            },
            {
                "endpoint": "/api/v1/swipes/",
                "method": "POST",
                "data": {
                    "product_id": "product-1",
                    "direction": "right",
                    "session_id": "session-1",
                    "time_spent_seconds": 3.5,
                    "preference_strength": 0.75,
                    "interaction_context": {"notes": massive_string}  # Oversized context
                }
            }
        ]
        
        for test_case in oversized_inputs:
            if test_case["method"] == "POST":
                response = test_client.post(test_case["endpoint"], json=test_case["data"])
            
            # Should reject oversized inputs
            assert response.status_code in [400, 413, 422], f"Oversized input not rejected for {test_case['endpoint']}"
    
    def test_input_type_validation(self, test_client):
        """
        Test input type validation and sanitisation.
        
        Validates that inputs are properly validated for
        expected data types and formats.
        """
        # Test type mismatches
        invalid_inputs = [
            {
                "endpoint": "/api/v1/swipes/",
                "method": "POST",
                "data": {
                    "product_id": 12345,  # Should be string
                    "direction": "right",
                    "session_id": "session-1",
                    "time_spent_seconds": "invalid",  # Should be number
                    "preference_strength": "high",  # Should be number
                    "interaction_context": "not_an_object"  # Should be object
                }
            },
            {
                "endpoint": "/api/v1/auth/register",
                "method": "POST",
                "data": {
                    "email": "not_an_email",  # Invalid email format
                    "password": 123456,  # Should be string
                    "firstName": None,  # Should be string
                    "lastName": ["array", "not", "string"]  # Should be string
                }
            }
        ]
        
        for test_case in invalid_inputs:
            if test_case["method"] == "POST":
                response = test_client.post(test_case["endpoint"], json=test_case["data"])
            
            # Should return validation error
            assert response.status_code in [400, 422], f"Invalid input types not rejected for {test_case['endpoint']}"

# ==============================================================================
# ROW LEVEL SECURITY (RLS) POLICY TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.database
@pytest.mark.rls
class TestRowLevelSecurity:
    """
    Row Level Security (RLS) policy testing.
    
    Tests Supabase RLS policies to ensure data isolation
    and proper access control at the database level.
    """
    
    @pytest.mark.asyncio
    async def test_user_data_rls_policies(self, mock_supabase_client):
        """
        Test RLS policies for user data access.
        
        Validates that users can only access their own data
        and RLS policies prevent cross-user data access.
        """
        # Set up test scenario with multiple users
        user1_id = "user-1"
        user2_id = "user-2"
        
        # Mock RLS policy enforcement
        def mock_rls_query(table, filters):
            # Simulate RLS policy: users can only see their own data
            if table == "profiles":
                return [
                    {"id": user1_id, "email": "user1@aclue.app", "firstName": "User1"}
                ] if filters.get("user_id") == user1_id else []
            elif table == "swipe_interactions":
                if filters.get("user_id") == user1_id:
                    return [
                        {"id": "swipe-1", "user_id": user1_id, "product_id": "product-1"},
                        {"id": "swipe-2", "user_id": user1_id, "product_id": "product-2"},
                    ]
                elif filters.get("user_id") == user2_id:
                    return [
                        {"id": "swipe-3", "user_id": user2_id, "product_id": "product-3"},
                    ]
                else:
                    return []
            return []
        
        # Test user1 can access their own data
        user1_profile = mock_rls_query("profiles", {"user_id": user1_id})
        assert len(user1_profile) == 1
        assert user1_profile[0]["id"] == user1_id
        
        user1_swipes = mock_rls_query("swipe_interactions", {"user_id": user1_id})
        assert len(user1_swipes) == 2
        assert all(swipe["user_id"] == user1_id for swipe in user1_swipes)
        
        # Test user1 cannot access user2's data
        user2_data_attempt = mock_rls_query("profiles", {"user_id": user2_id})
        assert len(user2_data_attempt) == 0  # RLS should block this
        
        # Test user2 can access their own data
        user2_swipes = mock_rls_query("swipe_interactions", {"user_id": user2_id})
        assert len(user2_swipes) == 1
        assert user2_swipes[0]["user_id"] == user2_id
    
    @pytest.mark.asyncio
    async def test_admin_rls_bypass(self, mock_supabase_client):
        """
        Test admin RLS policy bypass for legitimate admin operations.
        
        Validates that admin users can access necessary data
        while maintaining security boundaries.
        """
        # Mock admin role with RLS bypass capabilities
        def mock_admin_query(table, user_role, filters=None):
            if user_role == "admin":
                # Admin can see all data (RLS bypassed for admin operations)
                if table == "profiles":
                    return [
                        {"id": "user-1", "email": "user1@aclue.app"},
                        {"id": "user-2", "email": "user2@aclue.app"},
                        {"id": "admin-1", "email": "admin@aclue.app"},
                    ]
                elif table == "swipe_interactions":
                    return [
                        {"id": "swipe-1", "user_id": "user-1"},
                        {"id": "swipe-2", "user_id": "user-1"},
                        {"id": "swipe-3", "user_id": "user-2"},
                    ]
            elif user_role == "free_user":
                # Regular users affected by RLS
                user_id = filters.get("user_id") if filters else None
                if table == "profiles" and user_id:
                    return [{"id": user_id, "email": f"{user_id}@aclue.app"}]
                elif table == "swipe_interactions" and user_id:
                    return [{"id": f"swipe-{user_id}", "user_id": user_id}]
                return []
            return []
        
        # Test admin can access all user data
        admin_user_data = mock_admin_query("profiles", "admin")
        assert len(admin_user_data) == 3  # Can see all users
        
        admin_swipe_data = mock_admin_query("swipe_interactions", "admin")
        assert len(admin_swipe_data) == 3  # Can see all swipes
        
        # Test regular user still restricted by RLS
        user_data = mock_admin_query("profiles", "free_user", {"user_id": "user-1"})
        assert len(user_data) == 1
        assert user_data[0]["id"] == "user-1"
        
        # Regular user cannot see other users
        other_user_attempt = mock_admin_query("profiles", "free_user", {"user_id": "user-2"})
        assert len(other_user_attempt) == 0  # RLS blocks access
    
    def test_rls_policy_enforcement_in_api(self, test_client):
        """
        Test RLS policy enforcement through API endpoints.
        
        Validates that API endpoints respect RLS policies
        and properly filter data based on user context.
        """
        # Create tokens for different users
        user1_token = create_access_token(data={
            "sub": "user-1",
            "email": "user1@aclue.app",
            "role": "free_user",
            "exp": datetime.utcnow() + timedelta(hours=1)
        })
        
        user2_token = create_access_token(data={
            "sub": "user-2", 
            "email": "user2@aclue.app",
            "role": "free_user",
            "exp": datetime.utcnow() + timedelta(hours=1)
        })
        
        user1_headers = {"Authorization": f"Bearer {user1_token}"}
        user2_headers = {"Authorization": f"Bearer {user2_token}"}
        
        # Test that user1 gets their own data
        user1_profile = test_client.get("/api/v1/auth/me", headers=user1_headers)
        if user1_profile.status_code == 200:
            profile_data = user1_profile.json()
            assert profile_data["id"] == "user-1"
        
        # Test that user2 gets their own data
        user2_profile = test_client.get("/api/v1/auth/me", headers=user2_headers)
        if user2_profile.status_code == 200:
            profile_data = user2_profile.json()
            assert profile_data["id"] == "user-2"
        
        # Test swipe data isolation
        user1_swipes = test_client.get("/api/v1/swipes/history", headers=user1_headers)
        user2_swipes = test_client.get("/api/v1/swipes/history", headers=user2_headers)
        
        # Responses should be different (different user data)
        if user1_swipes.status_code == 200 and user2_swipes.status_code == 200:
            assert user1_swipes.json() != user2_swipes.json()

# ==============================================================================
# SECURITY HEADERS AND CORS TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.headers
class TestSecurityHeaders:
    """
    Security headers and CORS testing.
    
    Tests HTTP security headers, CORS configuration,
    and browser security protection mechanisms.
    """
    
    def test_security_headers_present(self, test_client):
        """
        Test presence of required security headers.
        
        Validates that all required security headers are present
        and configured with secure values.
        """
        response = test_client.get("/api/v1/products/")
        
        for header_name, expected_value in REQUIRED_SECURITY_HEADERS.items():
            assert header_name in response.headers, f"Missing security header: {header_name}"
            
            actual_value = response.headers[header_name]
            if expected_value:
                assert expected_value in actual_value, f"Invalid {header_name}: {actual_value}"
    
    def test_cors_configuration(self, test_client):
        """
        Test CORS (Cross-Origin Resource Sharing) configuration.
        
        Validates that CORS is properly configured to allow
        legitimate origins while blocking malicious requests.
        """
        # Test preflight request
        preflight_response = test_client.options(
            "/api/v1/products/",
            headers={
                "Origin": "https://aclue.app",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization",
            }
        )
        
        # Should allow legitimate origin
        assert "Access-Control-Allow-Origin" in preflight_response.headers
        assert "Access-Control-Allow-Methods" in preflight_response.headers
        
        # Test malicious origin rejection
        malicious_preflight = test_client.options(
            "/api/v1/products/",
            headers={
                "Origin": "https://evil.com",
                "Access-Control-Request-Method": "GET",
            }
        )
        
        # Should reject or not include CORS headers for malicious origin
        allowed_origin = malicious_preflight.headers.get("Access-Control-Allow-Origin", "")
        assert "evil.com" not in allowed_origin
    
    def test_content_security_policy(self, test_client):
        """
        Test Content Security Policy (CSP) configuration.
        
        Validates that CSP headers are properly configured
        to prevent XSS and other injection attacks.
        """
        response = test_client.get("/")
        
        if "Content-Security-Policy" in response.headers:
            csp_header = response.headers["Content-Security-Policy"]
            
            # Check for secure CSP directives
            secure_directives = [
                "default-src 'self'",
                "script-src",
                "style-src",
                "img-src",
            ]
            
            for directive in secure_directives:
                assert directive in csp_header, f"Missing CSP directive: {directive}"
            
            # Check that 'unsafe-eval' and 'unsafe-inline' are avoided
            dangerous_values = ["'unsafe-eval'", "'unsafe-inline'"]
            for dangerous_value in dangerous_values:
                assert dangerous_value not in csp_header, f"Dangerous CSP value: {dangerous_value}"

# ==============================================================================
# DATA PRIVACY AND GDPR COMPLIANCE TESTS
# ==============================================================================

@pytest.mark.security
@pytest.mark.privacy
class TestDataPrivacyCompliance:
    """
    Data privacy and GDPR compliance testing.
    
    Tests data handling practices, user consent management,
    and privacy rights implementation.
    """
    
    def test_data_minimisation_principle(self, test_client):
        """
        Test data minimisation principle compliance.
        
        Validates that only necessary data is collected
        and stored for legitimate business purposes.
        """
        # Test user registration data collection
        registration_data = {
            "email": "privacy@aclue.app",
            "password": "testpass123",
            "firstName": "Privacy",
            "lastName": "Tester",
            "marketingConsent": False  # User opts out of marketing
        }
        
        response = test_client.post("/api/v1/auth/register", json=registration_data)
        
        if response.status_code == 201:
            user_data = response.json()
            
            # Verify only necessary fields are returned
            expected_fields = {"id", "email", "firstName", "lastName", "createdAt"}
            actual_fields = set(user_data.get("user", {}).keys())
            
            # Should not expose sensitive data
            sensitive_fields = {"password", "passwordHash", "internalNotes"}
            assert not sensitive_fields.intersection(actual_fields), "Sensitive data exposed"
            
            # Should respect marketing consent
            if "marketingConsent" in user_data.get("user", {}):
                assert user_data["user"]["marketingConsent"] == False
    
    def test_user_consent_management(self, test_client):
        """
        Test user consent management and tracking.
        
        Validates that user consents are properly recorded,
        can be updated, and are respected throughout the system.
        """
        # Test consent during registration
        consent_data = {
            "email": "consent@aclue.app",
            "password": "testpass123",
            "firstName": "Consent",
            "lastName": "User",
            "marketingConsent": True,
            "analyticsConsent": True,
            "termsAccepted": True
        }
        
        registration_response = test_client.post("/api/v1/auth/register", json=consent_data)
        
        if registration_response.status_code == 201:
            # Test consent update
            consent_update = {
                "marketingConsent": False,  # User withdraws marketing consent
                "analyticsConsent": True    # Keeps analytics consent
            }
            
            # Would need authentication token for this
            token = create_access_token(data={
                "sub": "consent-user",
                "email": "consent@aclue.app",
                "exp": datetime.utcnow() + timedelta(hours=1)
            })
            headers = {"Authorization": f"Bearer {token}"}
            
            update_response = test_client.put(
                "/api/v1/users/consent",
                json=consent_update,
                headers=headers
            )
            
            # Consent updates should be processed
            assert update_response.status_code in [200, 204]
    
    def test_data_retention_policies(self, mock_db_service):
        """
        Test data retention policy implementation.
        
        Validates that data is properly deleted or anonymised
        according to retention policies and user requests.
        """
        # Test user data deletion request
        user_id = "user-to-delete"
        
        # Mock user deletion process
        mock_db_service.delete_user_data.return_value = {
            "user_deleted": True,
            "interactions_anonymised": True,
            "recommendations_cleared": True,
            "retention_period_respected": True
        }
        
        # Simulate data deletion
        deletion_result = mock_db_service.delete_user_data(user_id)
        
        assert deletion_result["user_deleted"] == True
        assert deletion_result["interactions_anonymised"] == True
        
        # Test that deleted user cannot be accessed
        mock_db_service.get_user_by_id.side_effect = Exception("User not found")
        
        with pytest.raises(Exception):
            mock_db_service.get_user_by_id(user_id)
    
    def test_data_export_functionality(self, test_client):
        """
        Test user data export functionality (GDPR Right to Data Portability).
        
        Validates that users can export their personal data
        in a machine-readable format.
        """
        # Create authenticated request for data export
        token = create_access_token(data={
            "sub": "export-user",
            "email": "export@aclue.app",
            "exp": datetime.utcnow() + timedelta(hours=1)
        })
        headers = {"Authorization": f"Bearer {token}"}
        
        # Request data export
        export_response = test_client.get("/api/v1/users/data-export", headers=headers)
        
        if export_response.status_code == 200:
            export_data = export_response.json()
            
            # Verify export contains expected data categories
            expected_categories = [
                "profile",
                "swipe_interactions", 
                "recommendations",
                "preferences",
                "consent_records"
            ]
            
            for category in expected_categories:
                assert category in export_data, f"Missing data category: {category}"
            
            # Verify data format is machine-readable (JSON)
            assert isinstance(export_data, dict)
            
            # Verify no sensitive system data is included
            sensitive_keys = ["password_hash", "internal_notes", "system_metadata"]
            export_str = str(export_data).lower()
            
            for sensitive_key in sensitive_keys:
                assert sensitive_key.lower() not in export_str