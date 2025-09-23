"""
aclue Backend Test Configuration and Fixtures

Comprehensive test configuration providing fixtures for database testing,
API endpoint testing, authentication testing, and performance testing.

Testing Architecture:
- Database isolation with test-specific Supabase instances
- Mock services for external dependencies (email, analytics)
- Authentication fixtures for testing protected endpoints
- Factory patterns for generating realistic test data
- Performance testing infrastructure with benchmarking

Fixture Scope Strategy:
- Session: Database connections, app configuration
- Module: Expensive setup like test data seeding
- Function: Individual test isolation with fresh state

Reference Documentation:
Based on FastAPI testing patterns from docs/fastapi.txt and 
Supabase testing best practices from docs/supabase.txt
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

import pytest
import os
import asyncio
from typing import Generator, Dict, Any, Optional
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime, timedelta
import uuid
from decimal import Decimal

# FastAPI testing imports
from fastapi.testclient import TestClient
from httpx import AsyncClient

# Database and service imports
from supabase import Client, create_client
import factory
from factory import Faker, LazyAttribute

# Application imports
from app.main import app
from app.models import (
    User, Product, Category, SwipeInteraction,
    UserCreate, ProductCreate, CategoryBase
)
from app.services.database_service import DatabaseService
from app.core.config import get_settings

# ==============================================================================
# TEST ENVIRONMENT CONFIGURATION
# ==============================================================================

# Set test environment variables before any imports
# These override production settings for isolated testing
os.environ.update({
    "TESTING": "true",
    "LOG_LEVEL": "DEBUG",
    "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/aclue_test",
    "SUPABASE_URL": "https://test.supabase.co",
    "SUPABASE_ANON_KEY": "test_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "test_service_key",
    "REDIS_URL": "redis://localhost:6379/1",
    "DISABLE_AUTH": "false",
    "RATE_LIMITING_ENABLED": "false",
    "EMAIL_BACKEND": "mock",
    "ANALYTICS_BACKEND": "mock"
})

# ==============================================================================
# DATABASE FIXTURES
# ==============================================================================

@pytest.fixture(scope="session")
def test_settings():
    """
    Test application settings with overrides for testing environment.
    
    Provides isolated configuration for testing without affecting
    production settings. Disables rate limiting, enables debug mode,
    and configures test-specific database connections.
    
    Reference: FastAPI testing patterns from docs/fastapi.txt
    """
    settings = get_settings()
    settings.TESTING = True
    settings.LOG_LEVEL = "DEBUG"
    settings.RATE_LIMITING_ENABLED = False
    return settings

@pytest.fixture(scope="session")
def mock_supabase_service():
    """
    Mock Supabase service client for testing without external dependencies.
    
    Provides realistic mock responses for Supabase operations whilst
    maintaining test isolation. Includes mock data for users, products,
    categories, and interactions.
    
    Pattern: Database mocking following Supabase testing best practices
    from docs/supabase.txt for offline testing capabilities.
    """
    mock_client = Mock(spec=Client)
    
    # Mock table operations
    mock_client.table.return_value = Mock()
    mock_client.table.return_value.select.return_value = Mock()
    mock_client.table.return_value.insert.return_value = Mock()
    mock_client.table.return_value.update.return_value = Mock()
    mock_client.table.return_value.delete.return_value = Mock()
    
    # Mock auth operations
    mock_client.auth = Mock()
    mock_client.auth.admin = Mock()
    mock_client.auth.sign_in_with_password = AsyncMock()
    mock_client.auth.admin.create_user = AsyncMock()
    mock_client.auth.admin.get_user_by_id = AsyncMock()
    
    return mock_client

@pytest.fixture(scope="function")
async def test_database_service(mock_supabase_service):
    """
    Test-isolated database service with mocked Supabase client.
    
    Creates a fresh database service instance for each test with
    mocked external dependencies. Provides realistic test data
    and isolated state management.
    
    Usage:
        async def test_user_creation(test_database_service):
            user = await test_database_service.create_user(user_data)
            assert user.email == "test@example.com"
    """
    service = DatabaseService()
    # Inject mock client
    service._service_client = mock_supabase_service
    service._anon_client = mock_supabase_service
    return service

# ==============================================================================
# API CLIENT FIXTURES
# ==============================================================================

@pytest.fixture(scope="session")
def sync_client() -> Generator[TestClient, None, None]:
    """
    Synchronous test client for FastAPI application testing.
    
    Provides TestClient instance following FastAPI testing patterns
    from docs/fastapi.txt. Suitable for synchronous endpoint testing
    and integration tests that don't require async context.
    
    Usage:
        def test_health_check(sync_client):
            response = sync_client.get("/health")
            assert response.status_code == 200
    """
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="function")
async def async_client() -> Generator[AsyncClient, None, None]:
    """
    Asynchronous test client for FastAPI async endpoint testing.
    
    Provides AsyncClient for testing async endpoints and operations.
    Each test gets a fresh client instance for isolation.
    
    Reference: Async testing patterns from docs/fastapi.txt for
    testing async endpoints with proper context management.
    
    Usage:
        async def test_async_endpoint(async_client):
            response = await async_client.get("/api/v1/products")
            assert response.status_code == 200
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# ==============================================================================
# AUTHENTICATION FIXTURES
# ==============================================================================

@pytest.fixture(scope="function")
def mock_user_data():
    """
    Realistic mock user data for authentication testing.
    
    Provides consistent test user data across authentication tests.
    Includes all required fields for user creation and validation.
    
    Returns:
        Dict containing complete user data for testing
    """
    return {
        "id": str(uuid.uuid4()),
        "email": "test@aclue.app",
        "first_name": "Test",
        "last_name": "User",
        "password": "SecureTestPass123!",
        "subscription_tier": "free",
        "marketing_consent": False,
        "created_at": datetime.utcnow().isoformat(),
        "email_verified": True
    }

@pytest.fixture(scope="function")
def mock_auth_headers(mock_user_data):
    """
    Mock authentication headers for testing protected endpoints.
    
    Provides valid JWT token headers for bypassing authentication
    during testing. Uses dependency override pattern from FastAPI
    testing documentation.
    
    Returns:
        Dict containing Authorization header with mock JWT token
    """
    # Mock JWT token - in real implementation, this would be signed
    mock_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.test_payload.test_signature"
    return {
        "Authorization": f"Bearer {mock_token}",
        "Content-Type": "application/json"
    }

@pytest.fixture(scope="function")
def authenticated_client(sync_client, mock_auth_headers, mock_user_data):
    """
    Pre-authenticated test client for protected endpoint testing.
    
    Provides TestClient with authentication headers pre-configured.
    Bypasses login flow for testing protected endpoints directly.
    
    Usage:
        def test_protected_endpoint(authenticated_client):
            response = authenticated_client.get("/api/v1/profile")
            assert response.status_code == 200
    """
    # Override the get_current_user dependency for testing
    from app.api.v1.endpoints.auth import get_current_user_dependency
    
    def override_get_current_user():
        return mock_user_data
    
    app.dependency_overrides[get_current_user_dependency] = override_get_current_user
    
    # Configure client with auth headers
    sync_client.headers.update(mock_auth_headers)
    
    yield sync_client
    
    # Clean up dependency override
    app.dependency_overrides.clear()

# ==============================================================================
# DATA FACTORY FIXTURES
# ==============================================================================

class UserFactory(factory.Factory):
    """
    Factory for generating realistic user test data.
    
    Provides consistent user data generation for testing user-related
    functionality. Uses factory-boy patterns for realistic data generation
    with proper relationships and validation.
    
    Usage:
        user_data = UserFactory.build()  # Generate data dict
        user = UserFactory()  # Generate User instance
    """
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    subscription_tier = "free"
    marketing_consent = False
    created_at = factory.LazyFunction(datetime.utcnow)
    email_verified = True
    preferences_calculated = False

class CategoryFactory(factory.Factory):
    """
    Factory for generating product category test data.
    
    Creates realistic category hierarchies for testing product
    organisation and filtering functionality.
    """
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    name = factory.Faker('word')
    slug = factory.LazyAttribute(lambda obj: obj.name.lower().replace(' ', '-'))
    description = factory.Faker('text', max_nb_chars=200)
    parent_id = None
    sort_order = factory.Faker('random_int', min=0, max=100)
    is_active = True
    created_at = factory.LazyFunction(datetime.utcnow)

class ProductFactory(factory.Factory):
    """
    Factory for generating product test data.
    
    Creates realistic product data with proper pricing, categories,
    and affiliate information for testing recommendation algorithms
    and user interactions.
    """
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    title = factory.Faker('catch_phrase')
    description = factory.Faker('text', max_nb_chars=500)
    price_min = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True)
    price_max = factory.LazyAttribute(lambda obj: obj.price_min * Decimal('1.2'))
    currency = "GBP"
    brand = factory.Faker('company')
    image_url = factory.Faker('image_url')
    affiliate_url = factory.Faker('url')
    affiliate_network = "amazon"
    commission_rate = factory.Faker('pydecimal', left_digits=0, right_digits=3, positive=True, max_value=1)
    category_id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    rating = factory.Faker('pydecimal', left_digits=1, right_digits=1, positive=True, min_value=1, max_value=5)
    review_count = factory.Faker('random_int', min=0, max=1000)
    availability_status = "available"
    is_active = True
    created_at = factory.LazyFunction(datetime.utcnow)

class SwipeInteractionFactory(factory.Factory):
    """
    Factory for generating swipe interaction test data.
    
    Creates realistic user interaction data for testing preference
    calculation and recommendation algorithms.
    """
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    user_id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    session_id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    product_id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    swipe_direction = factory.Faker('random_element', elements=['left', 'right', 'up'])
    swipe_timestamp = factory.LazyFunction(datetime.utcnow)
    time_spent_seconds = factory.Faker('random_int', min=1, max=60)
    preference_strength = factory.Faker('pydecimal', left_digits=0, right_digits=2, positive=True, max_value=1)

# ==============================================================================
# FIXTURE PROVIDERS
# ==============================================================================

@pytest.fixture
def sample_user():
    """Generate sample user data for testing."""
    return UserFactory.build()

@pytest.fixture
def sample_category():
    """Generate sample category data for testing."""
    return CategoryFactory.build()

@pytest.fixture
def sample_product():
    """Generate sample product data for testing."""
    return ProductFactory.build()

@pytest.fixture
def sample_swipe_interaction():
    """Generate sample swipe interaction data for testing."""
    return SwipeInteractionFactory.build()

@pytest.fixture
def multiple_products():
    """Generate list of products for bulk testing operations."""
    return [ProductFactory.build() for _ in range(10)]

@pytest.fixture
def category_hierarchy():
    """
    Generate realistic category hierarchy for testing.
    
    Creates parent and child categories with proper relationships
    for testing hierarchical product organisation.
    """
    parent = CategoryFactory.build(name="Electronics", parent_id=None)
    children = [
        CategoryFactory.build(name="Smartphones", parent_id=parent['id']),
        CategoryFactory.build(name="Laptops", parent_id=parent['id']),
        CategoryFactory.build(name="Headphones", parent_id=parent['id'])
    ]
    return {'parent': parent, 'children': children}

# ==============================================================================
# PERFORMANCE TESTING FIXTURES
# ==============================================================================

@pytest.fixture
def benchmark_data():
    """
    Generate large dataset for performance testing.
    
    Provides realistic data volumes for testing database performance,
    query optimisation, and bulk operations under load.
    """
    return {
        'users': [UserFactory.build() for _ in range(1000)],
        'products': [ProductFactory.build() for _ in range(5000)],
        'categories': [CategoryFactory.build() for _ in range(100)],
        'interactions': [SwipeInteractionFactory.build() for _ in range(10000)]
    }

# ==============================================================================
# MOCK SERVICE FIXTURES
# ==============================================================================

@pytest.fixture
def mock_email_service():
    """
    Mock email service for testing email functionality.
    
    Prevents actual email sending during tests whilst maintaining
    interface compatibility for testing email workflows.
    """
    mock_service = Mock()
    mock_service.send_welcome_email = AsyncMock(return_value=True)
    mock_service.send_password_reset = AsyncMock(return_value=True)
    mock_service.send_notification = AsyncMock(return_value=True)
    return mock_service

@pytest.fixture
def mock_analytics_service():
    """
    Mock analytics service for testing tracking functionality.
    
    Prevents external analytics calls during tests whilst
    maintaining event tracking interface for testing.
    """
    mock_service = Mock()
    mock_service.track_event = Mock(return_value=True)
    mock_service.track_user_action = Mock(return_value=True)
    mock_service.increment_counter = Mock(return_value=True)
    return mock_service

# ==============================================================================
# TEST CLEANUP FIXTURES
# ==============================================================================

@pytest.fixture(autouse=True)
def cleanup_test_data():
    """
    Automatic test cleanup to ensure test isolation.
    
    Runs after each test to clean up any persistent state,
    reset mocks, and ensure proper test isolation.
    
    Pattern: Automatic cleanup following pytest best practices
    for maintaining test independence and preventing flaky tests.
    """
    yield
    
    # Clear any dependency overrides
    if hasattr(app, 'dependency_overrides'):
        app.dependency_overrides.clear()
    
    # Reset any global state
    # Add specific cleanup logic as needed

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def create_test_user_with_preferences(
    preferences: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create test user with pre-calculated preferences.
    
    Helper function for creating users with specific preference
    profiles for testing recommendation algorithms.
    
    Args:
        preferences: Optional custom preferences dict
        
    Returns:
        Dict containing user data with preferences
    """
    user = UserFactory.build()
    user['preferences_calculated'] = True
    user['preferences'] = preferences or {
        'category_preferences': {'electronics': 0.8, 'fashion': 0.3},
        'price_range': {'min': 50, 'max': 500, 'currency': 'GBP'},
        'liked_brands': ['apple', 'nike'],
        'engagement_rate': 0.65
    }
    return user

def assert_valid_uuid(uuid_string: str) -> None:
    """
    Assert that a string is a valid UUID format.
    
    Helper function for validating UUID fields in API responses
    and database operations.
    
    Args:
        uuid_string: String to validate as UUID
        
    Raises:
        AssertionError: If string is not valid UUID
    """
    try:
        uuid.UUID(uuid_string)
    except (ValueError, TypeError):
        raise AssertionError(f"'{uuid_string}' is not a valid UUID")

def assert_datetime_format(datetime_string: str) -> None:
    """
    Assert that a string is valid ISO datetime format.
    
    Helper function for validating timestamp fields in API responses.
    
    Args:
        datetime_string: String to validate as ISO datetime
        
    Raises:
        AssertionError: If string is not valid datetime
    """
    try:
        datetime.fromisoformat(datetime_string.replace('Z', '+00:00'))
    except (ValueError, TypeError):
        raise AssertionError(f"'{datetime_string}' is not valid ISO datetime format")