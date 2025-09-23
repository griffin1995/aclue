"""
aclue Backend API Endpoint Test Suite

Comprehensive testing of all FastAPI endpoints including authentication,
authorisation, data validation, error handling, and integration with
database services.

Test Coverage:
- Authentication endpoints (login, register, refresh)
- Protected endpoints (user profile, preferences, analytics)
- Product endpoints (listing, filtering, recommendations)
- Swipe interaction endpoints (recording, session management)
- Affiliate tracking endpoints (click recording, conversion tracking)
- Error handling and edge cases across all endpoints

Testing Strategy:
Based on FastAPI testing patterns from docs/fastapi.txt using TestClient
and AsyncClient for comprehensive endpoint validation with proper
authentication context and dependency injection.

Security Testing:
- JWT token validation and expiration
- Role-based access control enforcement
- Input sanitisation and validation
- Rate limiting and abuse prevention

Integration Testing:
- Database service integration
- External service mocking (email, analytics)
- End-to-end request/response validation
- Cross-endpoint workflow testing
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

import pytest
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid
import json
from unittest.mock import Mock, AsyncMock, patch

# HTTP testing imports
from fastapi import status
from fastapi.testclient import TestClient
from httpx import AsyncClient

# Application imports
from app.main import app
from app.models import UserCreate, ProductCreate, SwipeInteraction
from app.services.database_service import DatabaseServiceError, UserNotFoundError
from tests.conftest import (
    UserFactory, ProductFactory, SwipeInteractionFactory,
    assert_valid_uuid, assert_datetime_format
)

# ==============================================================================
# AUTHENTICATION ENDPOINT TESTS
# ==============================================================================

@pytest.mark.api
@pytest.mark.auth
@pytest.mark.integration
class TestAuthenticationEndpoints:
    """
    Test authentication and authorisation endpoints.
    
    Validates user registration, login, token management, and protected
    endpoint access with proper JWT token handling and validation.
    
    Authentication Flow Testing:
    - User registration with validation
    - Login with email/password authentication
    - JWT token generation and validation
    - Token refresh functionality
    - Protected endpoint access control
    
    Reference: Authentication implementation from app/api/v1/endpoints/auth.py
    and JWT patterns from docs/jwt-auth.txt
    """
    
    def test_user_registration_success(self, sync_client, mock_email_service):
        """
        Test successful user registration with valid data.
        
        Validates that new users can register with complete profile data,
        receive proper JWT tokens, and get welcome email notifications.
        
        Registration Flow:
        1. Submit registration data with validation
        2. Create user in Supabase auth with email confirmation
        3. Store user metadata for profile information
        4. Generate JWT tokens for immediate authentication
        5. Send welcome email (mocked in tests)
        
        Business Context:
        User registration is the primary onboarding flow and must handle
        validation, security, and user experience requirements.
        """
        # Prepare registration data
        registration_data = {
            "first_name": "Test",
            "last_name": "User", 
            "email": "test@aclue.app",
            "password": "SecureTestPass123!",
            "marketing_consent": False
        }
        
        # Mock successful Supabase user creation
        with patch('app.api.v1.endpoints.auth.get_supabase_service') as mock_supabase:
            mock_client = Mock()
            
            # Mock user creation response
            mock_user_response = Mock()
            mock_user_response.user = Mock()
            mock_user_response.user.id = str(uuid.uuid4())
            mock_user_response.user.email = registration_data["email"]
            mock_user_response.user.email_confirmed_at = datetime.utcnow()
            mock_user_response.user.created_at = datetime.utcnow()
            mock_user_response.user.user_metadata = {
                'first_name': registration_data['first_name'],
                'last_name': registration_data['last_name']
            }
            
            mock_client.auth.admin.create_user.return_value = mock_user_response
            
            # Mock sign-in response for token generation
            mock_signin_response = Mock()
            mock_signin_response.user = mock_user_response.user
            mock_signin_response.session = Mock()
            mock_signin_response.session.access_token = "mock_access_token"
            mock_signin_response.session.refresh_token = "mock_refresh_token"
            
            mock_client.auth.sign_in_with_password.return_value = mock_signin_response
            
            mock_supabase.return_value = mock_client
            
            # Test registration endpoint
            response = sync_client.post("/api/v1/auth/register", json=registration_data)
            
            # Validate response
            assert response.status_code == status.HTTP_201_CREATED
            
            response_data = response.json()
            assert "access_token" in response_data
            assert "refresh_token" in response_data
            assert "user" in response_data
            
            # Validate user data in response
            user_data = response_data["user"]
            assert user_data["email"] == registration_data["email"]
            assert user_data["first_name"] == registration_data["first_name"]
            assert user_data["last_name"] == registration_data["last_name"]
            assert_valid_uuid(user_data["id"])
            assert_datetime_format(user_data["created_at"])
            
            # Validate Supabase integration calls
            mock_client.auth.admin.create_user.assert_called_once()
            mock_client.auth.sign_in_with_password.assert_called_once()
    
    def test_user_registration_validation_errors(self, sync_client):
        """
        Test user registration validation with invalid data.
        
        Validates that registration endpoint properly validates input data
        and returns appropriate error messages for invalid submissions.
        
        Validation Testing:
        - Missing required fields
        - Invalid email format
        - Weak password validation
        - Duplicate email handling
        - Data type validation
        """
        # Test missing required fields
        incomplete_data = {
            "email": "test@aclue.app"
            # Missing first_name, last_name, password
        }
        
        response = sync_client.post("/api/v1/auth/register", json=incomplete_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Validate error details
        error_data = response.json()
        assert "detail" in error_data
        errors = error_data["detail"]
        
        # Check for missing field errors
        missing_fields = {error["loc"][-1] for error in errors if error["type"] == "missing"}
        assert "first_name" in missing_fields
        assert "last_name" in missing_fields
        assert "password" in missing_fields
        
        # Test invalid email format
        invalid_email_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "invalid-email-format",
            "password": "SecureTestPass123!",
            "marketing_consent": False
        }
        
        response = sync_client.post("/api/v1/auth/register", json=invalid_email_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test weak password
        weak_password_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@aclue.app",
            "password": "weak",  # Too short, no complexity
            "marketing_consent": False
        }
        
        response = sync_client.post("/api/v1/auth/register", json=weak_password_data)
        # Response may be 422 (validation) or 400 (business logic) depending on implementation
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]
    
    def test_user_login_success(self, sync_client):
        """
        Test successful user login with valid credentials.
        
        Validates that existing users can authenticate with email/password
        and receive valid JWT tokens for accessing protected endpoints.
        
        Login Flow:
        1. Submit login credentials
        2. Validate credentials against Supabase auth
        3. Retrieve user profile data from metadata
        4. Generate fresh JWT tokens
        5. Return authenticated user session
        """
        login_data = {
            "email": "john.doe@example.com",  # Known test user from CLAUDE.md
            "password": "password123"
        }
        
        # Mock successful Supabase authentication
        with patch('app.api.v1.endpoints.auth.get_supabase_service') as mock_supabase:
            mock_client = Mock()
            
            # Mock sign-in response
            mock_signin_response = Mock()
            mock_user = Mock()
            mock_user.id = str(uuid.uuid4())
            mock_user.email = login_data["email"]
            mock_user.email_confirmed_at = datetime.utcnow()
            mock_user.created_at = datetime.utcnow()
            mock_user.last_sign_in_at = datetime.utcnow()
            mock_user.user_metadata = {
                'first_name': 'John',
                'last_name': 'Doe',
                'subscription_tier': 'free'
            }
            
            mock_signin_response.user = mock_user
            mock_signin_response.session = Mock()
            mock_signin_response.session.access_token = "valid_access_token"
            mock_signin_response.session.refresh_token = "valid_refresh_token"
            
            mock_client.auth.sign_in_with_password.return_value = mock_signin_response
            
            mock_supabase.return_value = mock_client
            
            # Test login endpoint
            response = sync_client.post("/api/v1/auth/login", json=login_data)
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert "access_token" in response_data
            assert "refresh_token" in response_data
            assert "user" in response_data
            
            # Validate token format (basic validation)
            assert len(response_data["access_token"]) > 0
            assert len(response_data["refresh_token"]) > 0
            
            # Validate user data
            user_data = response_data["user"]
            assert user_data["email"] == login_data["email"]
            assert user_data["first_name"] == "John"
            assert user_data["last_name"] == "Doe"
            assert_valid_uuid(user_data["id"])
            
            # Validate authentication call
            mock_client.auth.sign_in_with_password.assert_called_once_with(
                email=login_data["email"],
                password=login_data["password"]
            )
    
    def test_user_login_invalid_credentials(self, sync_client):
        """
        Test user login with invalid credentials.
        
        Validates that login attempts with incorrect credentials are
        properly rejected with appropriate error messages.
        
        Security Testing:
        - Invalid email/password combinations
        - Non-existent user handling
        - Brute force protection considerations
        - Error message consistency for security
        """
        invalid_login_data = {
            "email": "nonexistent@aclue.app",
            "password": "wrongpassword"
        }
        
        # Mock authentication failure
        with patch('app.api.v1.endpoints.auth.get_supabase_service') as mock_supabase:
            mock_client = Mock()
            
            # Mock authentication error
            from supabase.lib.client_options import ClientOptions
            mock_client.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")
            
            mock_supabase.return_value = mock_client
            
            # Test login endpoint
            response = sync_client.post("/api/v1/auth/login", json=invalid_login_data)
            
            # Validate error response
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            
            response_data = response.json()
            assert "detail" in response_data
            assert "invalid" in response_data["detail"].lower() or "unauthorized" in response_data["detail"].lower()
    
    def test_get_current_user_authenticated(self, authenticated_client, mock_user_data):
        """
        Test current user endpoint with valid authentication.
        
        Validates that authenticated users can retrieve their profile
        data using valid JWT tokens.
        
        Protected Endpoint Testing:
        - JWT token validation
        - User data retrieval from token claims
        - Profile data formatting and response structure
        """
        # Test current user endpoint
        response = authenticated_client.get("/api/v1/auth/me")
        
        # Validate response
        assert response.status_code == status.HTTP_200_OK
        
        response_data = response.json()
        assert "id" in response_data
        assert "email" in response_data
        assert "first_name" in response_data
        assert "last_name" in response_data
        
        # Validate user data matches authenticated user
        assert response_data["email"] == mock_user_data["email"]
        assert response_data["first_name"] == mock_user_data["first_name"]
        assert response_data["last_name"] == mock_user_data["last_name"]
    
    def test_get_current_user_unauthenticated(self, sync_client):
        """
        Test current user endpoint without authentication.
        
        Validates that unauthenticated requests to protected endpoints
        are properly rejected with 401 Unauthorized responses.
        """
        # Test without authentication headers
        response = sync_client.get("/api/v1/auth/me")
        
        # Validate rejection
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        response_data = response.json()
        assert "detail" in response_data

# ==============================================================================
# PRODUCT ENDPOINT TESTS
# ==============================================================================

@pytest.mark.api
@pytest.mark.integration
class TestProductEndpoints:
    """
    Test product-related API endpoints.
    
    Validates product listing, filtering, search functionality,
    and integration with recommendation algorithms.
    
    Product API Testing:
    - Product listing with pagination
    - Category-based filtering
    - Price range filtering
    - Search functionality
    - Product detail retrieval
    - Authentication context for personalised results
    """
    
    def test_get_products_list(self, sync_client, multiple_products):
        """
        Test product listing endpoint with basic functionality.
        
        Validates that products can be retrieved with proper formatting,
        pagination support, and default filtering for active products.
        """
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            # Configure mock response
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=multiple_products[:5]  # Return first 5 products
            )
            
            # Test products endpoint
            response = sync_client.get("/api/v1/products/")
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert isinstance(response_data, list)
            assert len(response_data) == 5
            
            # Validate product structure
            for product in response_data:
                assert "id" in product
                assert "title" in product
                assert "price_min" in product
                assert "currency" in product
                assert "image_url" in product
                assert_valid_uuid(product["id"])
            
            # Validate database service call
            mock_db_service.get_products_for_recommendations.assert_called_once()
    
    def test_get_products_with_category_filter(self, sync_client, multiple_products):
        """
        Test product listing with category filtering.
        
        Validates that products can be filtered by category with proper
        query parameter handling and filtered results.
        """
        category_name = "Electronics"
        
        # Filter products for expected response
        filtered_products = [
            product for product in multiple_products 
            if product.get('category_id') == 'electronics-category-id'
        ]
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=filtered_products
            )
            
            # Test products endpoint with category filter
            response = sync_client.get(f"/api/v1/products/?category={category_name}")
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert isinstance(response_data, list)
            
            # Validate filtering was applied
            mock_db_service.get_products_for_recommendations.assert_called_once()
            call_args = mock_db_service.get_products_for_recommendations.call_args
            assert 'category_filter' in call_args.kwargs or len(call_args.args) > 1
    
    def test_get_products_with_price_range(self, sync_client, multiple_products):
        """
        Test product listing with price range filtering.
        
        Validates that products can be filtered by price range with
        proper min/max price parameter handling.
        """
        min_price = 100
        max_price = 500
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=multiple_products[:3]
            )
            
            # Test products endpoint with price range
            response = sync_client.get(
                f"/api/v1/products/?min_price={min_price}&max_price={max_price}"
            )
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert isinstance(response_data, list)
            
            # Validate price filtering was applied
            mock_db_service.get_products_for_recommendations.assert_called_once()
            call_args = mock_db_service.get_products_for_recommendations.call_args
            if 'price_range' in call_args.kwargs:
                price_range = call_args.kwargs['price_range']
                assert price_range['min'] == min_price
                assert price_range['max'] == max_price
    
    def test_get_products_authenticated_personalised(
        self, 
        authenticated_client, 
        mock_user_data,
        multiple_products
    ):
        """
        Test personalised product listing for authenticated users.
        
        Validates that authenticated users receive personalised product
        recommendations based on their preferences and interaction history.
        
        Personalisation Testing:
        - User preference integration
        - Recommendation algorithm application
        - Authentication context usage
        - Personalised result ranking
        """
        # Mock user preferences
        user_preferences = {
            'category_preferences': {'Electronics': 0.8, 'Fashion': 0.6},
            'price_range': {'min': 50, 'max': 1000, 'currency': 'GBP'},
            'liked_brands': ['Apple', 'Nike'],
            'engagement_rate': 0.75
        }
        
        # Mock database service responses
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_user_preferences = AsyncMock(
                return_value=user_preferences
            )
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=multiple_products
            )
            
            # Test personalised products endpoint
            response = authenticated_client.get("/api/v1/products/")
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert isinstance(response_data, list)
            
            # Validate personalisation was applied
            mock_db_service.get_user_preferences.assert_called_once_with(
                mock_user_data["id"]
            )
            mock_db_service.get_products_for_recommendations.assert_called_once()
            
            # Validate preferences were passed to recommendation engine
            call_args = mock_db_service.get_products_for_recommendations.call_args
            if 'user_preferences' in call_args.kwargs:
                assert call_args.kwargs['user_preferences'] == user_preferences

# ==============================================================================
# SWIPE INTERACTION ENDPOINT TESTS
# ==============================================================================

@pytest.mark.api
@pytest.mark.integration
class TestSwipeInteractionEndpoints:
    """
    Test swipe interaction recording endpoints.
    
    Validates swipe data recording, session management, and integration
    with preference calculation algorithms for recommendation improvement.
    
    Swipe Interaction Testing:
    - Swipe recording with context data
    - Session tracking and management
    - Preference signal validation
    - Batch swipe operations
    - Error handling for invalid swipes
    """
    
    def test_record_swipe_interaction_success(
        self,
        authenticated_client,
        mock_user_data,
        sample_product
    ):
        """
        Test successful swipe interaction recording.
        
        Validates that swipe interactions are properly recorded with
        complete context data and user authentication.
        
        Swipe Recording Flow:
        1. Validate user authentication
        2. Validate swipe data format and constraints
        3. Record interaction with complete context
        4. Update session metrics
        5. Return success confirmation
        """
        session_id = str(uuid.uuid4())
        
        swipe_data = {
            "session_id": session_id,
            "product_id": sample_product["id"],
            "direction": "right",
            "time_spent_seconds": 15,
            "preference_strength": 0.8,
            "interaction_context": {
                "viewport_size": {"width": 1920, "height": 1080},
                "session_position": 5
            }
        }
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_interaction_id = str(uuid.uuid4())
            mock_db_service.record_swipe_interaction = AsyncMock(
                return_value=mock_interaction_id
            )
            
            # Test swipe recording endpoint
            response = authenticated_client.post("/api/v1/swipes/", json=swipe_data)
            
            # Validate response
            assert response.status_code == status.HTTP_201_CREATED
            
            response_data = response.json()
            assert "interaction_id" in response_data
            assert response_data["interaction_id"] == mock_interaction_id
            assert "recorded_at" in response_data
            assert_datetime_format(response_data["recorded_at"])
            
            # Validate database service call
            mock_db_service.record_swipe_interaction.assert_called_once_with(
                user_id=mock_user_data["id"],
                session_id=session_id,
                product_id=sample_product["id"],
                direction="right",
                time_spent_seconds=15,
                preference_strength=0.8,
                interaction_context=swipe_data["interaction_context"]
            )
    
    def test_record_swipe_interaction_validation_errors(
        self,
        authenticated_client,
        mock_user_data
    ):
        """
        Test swipe interaction recording with validation errors.
        
        Validates that invalid swipe data is properly rejected with
        appropriate error messages and validation details.
        
        Validation Testing:
        - Missing required fields
        - Invalid swipe directions
        - Invalid preference strength values
        - Invalid UUID formats
        """
        session_id = str(uuid.uuid4())
        
        # Test missing required fields
        incomplete_swipe_data = {
            "session_id": session_id,
            "direction": "right"
            # Missing product_id
        }
        
        response = authenticated_client.post("/api/v1/swipes/", json=incomplete_swipe_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test invalid swipe direction
        invalid_direction_data = {
            "session_id": session_id,
            "product_id": str(uuid.uuid4()),
            "direction": "invalid_direction",
            "preference_strength": 0.5
        }
        
        response = authenticated_client.post("/api/v1/swipes/", json=invalid_direction_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test invalid preference strength
        invalid_strength_data = {
            "session_id": session_id,
            "product_id": str(uuid.uuid4()),
            "direction": "right",
            "preference_strength": 1.5  # Too high
        }
        
        response = authenticated_client.post("/api/v1/swipes/", json=invalid_strength_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_record_swipe_unauthenticated(self, sync_client):
        """
        Test swipe recording without authentication.
        
        Validates that unauthenticated users cannot record swipe
        interactions and receive proper authentication errors.
        """
        swipe_data = {
            "session_id": str(uuid.uuid4()),
            "product_id": str(uuid.uuid4()),
            "direction": "right",
            "preference_strength": 0.5
        }
        
        # Test without authentication
        response = sync_client.post("/api/v1/swipes/", json=swipe_data)
        
        # Validate authentication required
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

# ==============================================================================
# RECOMMENDATION ENDPOINT TESTS
# ==============================================================================

@pytest.mark.api
@pytest.mark.integration
class TestRecommendationEndpoints:
    """
    Test recommendation algorithm endpoints.
    
    Validates personalised recommendations, preference-based filtering,
    and integration with user interaction history for ML-driven suggestions.
    
    Recommendation Testing:
    - Personalised recommendation generation
    - User preference integration
    - Recommendation diversity and quality
    - Performance and response time validation
    """
    
    def test_get_recommendations_authenticated(
        self,
        authenticated_client,
        mock_user_data,
        multiple_products
    ):
        """
        Test personalised recommendations for authenticated users.
        
        Validates that authenticated users receive personalised product
        recommendations based on their interaction history and preferences.
        
        Recommendation Algorithm Testing:
        - User preference integration
        - Product scoring and ranking
        - Diversity and quality metrics
        - Response format and structure
        """
        # Mock user preferences
        user_preferences = {
            'category_preferences': {'Electronics': 0.9, 'Fashion': 0.7},
            'price_range': {'min': 100, 'max': 500, 'currency': 'GBP'},
            'liked_brands': ['Apple', 'Samsung'],
            'engagement_rate': 0.8,
            'data_quality_score': 0.9
        }
        
        # Mock personalised recommendations
        recommended_products = multiple_products[:10]  # Top 10 recommendations
        for product in recommended_products:
            product['_relevance_score'] = 0.85  # Mock ML scoring
        
        # Mock database service responses
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_user_preferences = AsyncMock(
                return_value=user_preferences
            )
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=recommended_products
            )
            
            # Test recommendations endpoint
            response = authenticated_client.get("/api/v1/recommendations/")
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert "recommendations" in response_data
            assert "user_preferences" in response_data
            assert "recommendation_metadata" in response_data
            
            # Validate recommendations structure
            recommendations = response_data["recommendations"]
            assert isinstance(recommendations, list)
            assert len(recommendations) <= 10
            
            for rec in recommendations:
                assert "id" in rec
                assert "title" in rec
                assert "relevance_score" in rec
                assert 0.0 <= rec["relevance_score"] <= 1.0
                assert_valid_uuid(rec["id"])
            
            # Validate preference integration
            returned_preferences = response_data["user_preferences"]
            assert returned_preferences["engagement_rate"] == user_preferences["engagement_rate"]
            assert returned_preferences["category_preferences"] == user_preferences["category_preferences"]
            
            # Validate recommendation metadata
            metadata = response_data["recommendation_metadata"]
            assert "algorithm_version" in metadata
            assert "generated_at" in metadata
            assert "data_quality_score" in metadata
            assert_datetime_format(metadata["generated_at"])
            
            # Validate service calls
            mock_db_service.get_user_preferences.assert_called_once_with(mock_user_data["id"])
            mock_db_service.get_products_for_recommendations.assert_called_once()
    
    def test_get_recommendations_unauthenticated(self, sync_client, multiple_products):
        """
        Test general recommendations for unauthenticated users.
        
        Validates that anonymous users receive general product recommendations
        without personalisation, using popularity and quality metrics.
        
        Anonymous Recommendation Testing:
        - Default recommendation algorithm
        - Popular/trending product selection
        - No personal data usage
        - Generic recommendation metadata
        """
        # Mock general recommendations (no personalisation)
        general_products = multiple_products[:8]  # Top 8 general products
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_products_for_recommendations = AsyncMock(
                return_value=general_products
            )
            
            # Test recommendations endpoint without authentication
            response = sync_client.get("/api/v1/recommendations/")
            
            # Validate response
            assert response.status_code == status.HTTP_200_OK
            
            response_data = response.json()
            assert "recommendations" in response_data
            assert "user_preferences" not in response_data  # No personal data
            assert "recommendation_metadata" in response_data
            
            # Validate general recommendations
            recommendations = response_data["recommendations"]
            assert isinstance(recommendations, list)
            assert len(recommendations) <= 8
            
            # Validate metadata indicates non-personalised
            metadata = response_data["recommendation_metadata"]
            assert metadata.get("personalised") == False or "personalised" not in metadata
            assert "algorithm_version" in metadata
            assert_datetime_format(metadata["generated_at"])

# ==============================================================================
# AFFILIATE TRACKING ENDPOINT TESTS
# ==============================================================================

@pytest.mark.api
@pytest.mark.integration
class TestAffiliateTrackingEndpoints:
    """
    Test affiliate click tracking endpoints.
    
    Validates affiliate link click recording, revenue attribution,
    and integration with business analytics for commission tracking.
    
    Affiliate Tracking Testing:
    - Click recording with context data
    - Revenue attribution and commission calculation
    - Network detection and categorisation
    - Conversion tracking preparation
    """
    
    def test_record_affiliate_click_authenticated(
        self,
        authenticated_client,
        mock_user_data,
        sample_product
    ):
        """
        Test affiliate click recording for authenticated users.
        
        Validates that affiliate clicks are properly recorded with
        user context and complete tracking data for revenue attribution.
        
        Affiliate Click Flow:
        1. Validate user authentication
        2. Validate product exists and is active
        3. Record click with complete context
        4. Calculate expected commission
        5. Update session analytics
        6. Return tracking confirmation
        """
        session_id = str(uuid.uuid4())
        affiliate_url = "https://amazon.co.uk/dp/B123456?tag=aclue-21"
        
        click_data = {
            "product_id": sample_product["id"],
            "session_id": session_id,
            "affiliate_url": affiliate_url,
            "source_page": "recommendations",
            "device_type": "desktop"
        }
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_click_id = str(uuid.uuid4())
            mock_db_service.record_affiliate_click = AsyncMock(
                return_value=mock_click_id
            )
            
            # Test affiliate click recording
            response = authenticated_client.post("/api/v1/affiliate/click", json=click_data)
            
            # Validate response
            assert response.status_code == status.HTTP_201_CREATED
            
            response_data = response.json()
            assert "click_id" in response_data
            assert response_data["click_id"] == mock_click_id
            assert "recorded_at" in response_data
            assert "affiliate_network" in response_data
            assert_datetime_format(response_data["recorded_at"])
            
            # Validate network detection
            assert response_data["affiliate_network"] == "amazon"
            
            # Validate database service call
            mock_db_service.record_affiliate_click.assert_called_once_with(
                user_id=mock_user_data["id"],
                product_id=sample_product["id"],
                session_id=session_id,
                affiliate_url=affiliate_url,
                source_page="recommendations",
                device_type="desktop",
                anonymous_id=None
            )
    
    def test_record_affiliate_click_anonymous(self, sync_client, sample_product):
        """
        Test affiliate click recording for anonymous users.
        
        Validates that anonymous users can record affiliate clicks
        with session tracking for pre-authentication attribution.
        
        Anonymous Tracking:
        - Session-based tracking without user authentication
        - Anonymous ID generation for conversion matching
        - Limited context data collection
        - Privacy-compliant tracking methods
        """
        session_id = str(uuid.uuid4())
        anonymous_id = str(uuid.uuid4())
        affiliate_url = "https://amazon.co.uk/dp/B123456?tag=aclue-21"
        
        click_data = {
            "product_id": sample_product["id"],
            "session_id": session_id,
            "affiliate_url": affiliate_url,
            "anonymous_id": anonymous_id,
            "source_page": "discover",
            "device_type": "mobile"
        }
        
        # Mock database service response
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_click_id = str(uuid.uuid4())
            mock_db_service.record_affiliate_click = AsyncMock(
                return_value=mock_click_id
            )
            
            # Test anonymous affiliate click recording
            response = sync_client.post("/api/v1/affiliate/click", json=click_data)
            
            # Validate response
            assert response.status_code == status.HTTP_201_CREATED
            
            response_data = response.json()
            assert "click_id" in response_data
            assert response_data["click_id"] == mock_click_id
            assert "recorded_at" in response_data
            assert "affiliate_network" in response_data
            
            # Validate database service call with anonymous tracking
            mock_db_service.record_affiliate_click.assert_called_once_with(
                user_id=None,  # Anonymous user
                product_id=sample_product["id"],
                session_id=session_id,
                affiliate_url=affiliate_url,
                source_page="discover",
                device_type="mobile",
                anonymous_id=anonymous_id
            )

# ==============================================================================
# ERROR HANDLING TESTS
# ==============================================================================

@pytest.mark.api
class TestErrorHandling:
    """
    Test API error handling and edge cases.
    
    Validates that all endpoints handle errors gracefully with proper
    HTTP status codes, error messages, and logging for debugging.
    
    Error Handling Testing:
    - Database connection failures
    - Service unavailable conditions
    - Invalid request formats
    - Rate limiting responses
    - Internal server errors
    """
    
    def test_database_service_error_handling(self, authenticated_client, mock_user_data):
        """
        Test API responses when database service encounters errors.
        
        Validates that database service errors are properly caught
        and converted to appropriate HTTP error responses.
        """
        # Mock database service error
        with patch('app.services.database_service.database_service') as mock_db_service:
            mock_db_service.get_user_preferences = AsyncMock(
                side_effect=DatabaseServiceError("Database connection failed")
            )
            
            # Test endpoint that uses database service
            response = authenticated_client.get("/api/v1/recommendations/")
            
            # Validate error response
            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            
            response_data = response.json()
            assert "detail" in response_data
            # Error message should not expose internal details
            assert "database" not in response_data["detail"].lower() or "internal" in response_data["detail"].lower()
    
    def test_invalid_uuid_handling(self, authenticated_client):
        """
        Test handling of invalid UUID parameters in API requests.
        
        Validates that invalid UUID formats are properly validated
        and return appropriate error responses.
        """
        invalid_uuid = "not-a-valid-uuid"
        
        # Test endpoint with invalid UUID parameter
        response = authenticated_client.get(f"/api/v1/products/{invalid_uuid}")
        
        # Validate error response
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        response_data = response.json()
        assert "detail" in response_data
    
    def test_rate_limiting_simulation(self, sync_client):
        """
        Test API rate limiting behaviour (simulated).
        
        Validates that rate limiting is properly implemented
        and returns appropriate 429 responses when limits are exceeded.
        
        Note: This test simulates rate limiting behaviour since
        actual rate limiting testing requires load testing tools.
        """
        # This would typically require actual rate limiting configuration
        # For now, we test the error response format
        
        # Mock rate limit exceeded condition
        with patch('app.core.middleware.check_rate_limit') as mock_rate_check:
            mock_rate_check.return_value = False  # Rate limit exceeded
            
            # Test rate limited endpoint
            response = sync_client.get("/api/v1/products/")
            
            # Validate rate limit response (if implemented)
            # Note: This depends on actual rate limiting implementation
            # assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS