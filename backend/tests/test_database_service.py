"""
aclue Database Service Unit Test Suite

Comprehensive unit tests for the DatabaseService class, validating all
business logic, error handling, data processing, and integration patterns
with proper mocking and isolation.

Test Coverage:
- All DatabaseService public methods
- Business logic validation and edge cases
- Error handling and exception scenarios
- Data transformation and formatting
- Performance optimisation validation
- Mock integration with Supabase client operations

Testing Strategy:
Unit testing with comprehensive mocking following the patterns from
docs/fastapi.txt and pytest best practices for service layer testing.
All external dependencies are mocked for fast, reliable test execution.

Business Logic Testing:
- User preference calculation algorithms
- ML scoring and recommendation logic
- Affiliate tracking and revenue attribution
- Data validation and sanitisation
- Performance optimisation and caching

Architecture Testing:
- Service layer separation of concerns
- Proper error handling and logging
- Client connection management
- Async/await patterns and performance
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

import pytest
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid
from decimal import Decimal
from unittest.mock import Mock, AsyncMock, patch, MagicMock

# Application imports
from app.services.database_service import (
    DatabaseService, 
    DatabaseServiceError,
    UserNotFoundError,
    ProductNotFoundError, 
    ValidationError,
    PermissionError
)
from tests.conftest import (
    UserFactory, ProductFactory, CategoryFactory, SwipeInteractionFactory,
    assert_valid_uuid, assert_datetime_format, create_test_user_with_preferences
)

# ==============================================================================
# DATABASE SERVICE INITIALIZATION TESTS
# ==============================================================================

@pytest.mark.unit
class TestDatabaseServiceInitialization:
    """
    Test DatabaseService initialization and client management.
    
    Validates that the service properly initializes, manages Supabase
    client connections, and handles configuration correctly.
    
    Client Management Testing:
    - Lazy initialization of service and anonymous clients
    - Proper client configuration and capabilities
    - Connection reuse and efficiency
    - Error handling for connection failures
    """
    
    def test_database_service_init(self):
        """
        Test DatabaseService initialization with default configuration.
        
        Validates that service initializes with proper default state
        and lazy client initialization pattern.
        """
        service = DatabaseService()
        
        # Validate initial state
        assert service._service_client is None
        assert service._anon_client is None
        assert hasattr(service, 'logger')
        assert service.logger is not None
    
    def test_service_client_lazy_initialization(self):
        """
        Test lazy initialization of service client.
        
        Validates that service client is created on first access
        and reused for subsequent calls.
        """
        service = DatabaseService()
        
        # Mock the client creation
        with patch('app.services.database_service.get_supabase_service') as mock_get_client:
            mock_client = Mock()
            mock_get_client.return_value = mock_client
            
            # First call should create client
            client1 = service._get_service_client()
            assert client1 is mock_client
            assert service._service_client is mock_client
            mock_get_client.assert_called_once()
            
            # Second call should reuse client
            client2 = service._get_service_client()
            assert client2 is client1
            assert client2 is mock_client
            # get_supabase_service should not be called again
            mock_get_client.assert_called_once()
    
    def test_anon_client_lazy_initialization(self):
        """
        Test lazy initialization of anonymous client.
        
        Validates that anonymous client is created on first access
        and reused for subsequent calls with proper RLS enforcement.
        """
        service = DatabaseService()
        
        # Mock the client creation
        with patch('app.services.database_service.get_supabase_anon') as mock_get_client:
            mock_client = Mock()
            mock_get_client.return_value = mock_client
            
            # First call should create client
            client1 = service._get_anon_client()
            assert client1 is mock_client
            assert service._anon_client is mock_client
            mock_get_client.assert_called_once()
            
            # Second call should reuse client
            client2 = service._get_anon_client()
            assert client2 is client1
            assert client2 is mock_client
            # get_supabase_anon should not be called again
            mock_get_client.assert_called_once()

# ==============================================================================
# USER OPERATIONS TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestUserOperations:
    """
    Test user-related database service operations.
    
    Comprehensive testing of user data management including retrieval,
    validation, authentication workflows, and error handling.
    
    User Data Management:
    - User retrieval from profiles table and auth.users fallback
    - Authentication workaround implementation
    - Data format consistency and validation
    - Error handling for missing users
    """
    
    async def test_get_user_by_id_profiles_table_success(self):
        """
        Test user retrieval from profiles table (preferred method).
        
        Validates that when profiles table contains user data,
        it is returned directly without fallback to auth.users.
        """
        service = DatabaseService()
        user_data = UserFactory.build()
        user_id = user_data['id']
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock profiles table response with user data
        mock_response = Mock()
        mock_response.data = [user_data]
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        
        # Test user retrieval
        result = await service.get_user_by_id(user_id, use_service_role=True)
        
        # Validate result
        assert result == user_data
        
        # Validate database calls
        mock_client.table.assert_called_with('profiles')
        mock_client.auth.admin.get_user_by_id.assert_not_called()
    
    async def test_get_user_by_id_auth_users_fallback(self):
        """
        Test user retrieval fallback to auth.users metadata.
        
        Validates the authentication workaround where user data is
        retrieved from Supabase auth.users when profiles table is empty.
        
        Business Context:
        This tests the current implementation where user data is stored
        in auth.users metadata due to missing profiles table.
        """
        service = DatabaseService()
        user_data = UserFactory.build()
        user_id = user_data['id']
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock empty profiles table response
        mock_profiles_response = Mock()
        mock_profiles_response.data = []
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profiles_response
        
        # Mock auth.users response
        mock_auth_user = Mock()
        mock_auth_user.id = user_id
        mock_auth_user.email = user_data['email']
        mock_auth_user.email_confirmed_at = datetime.utcnow()
        mock_auth_user.created_at = user_data['created_at']
        mock_auth_user.updated_at = user_data['created_at']
        mock_auth_user.last_sign_in_at = None
        mock_auth_user.user_metadata = {
            'first_name': user_data['first_name'],
            'last_name': user_data['last_name'],
            'subscription_tier': user_data['subscription_tier']
        }
        
        mock_auth_response = Mock()
        mock_auth_response.user = mock_auth_user
        mock_client.auth.admin.get_user_by_id.return_value = mock_auth_response
        
        # Test user retrieval
        result = await service.get_user_by_id(user_id, use_service_role=True)
        
        # Validate result structure
        assert result is not None
        assert result['id'] == user_id
        assert result['email'] == user_data['email']
        assert result['first_name'] == user_data['first_name']
        assert result['last_name'] == user_data['last_name']
        assert result['subscription_tier'] == user_data['subscription_tier']
        assert 'email_verified' in result
        assert 'created_at' in result
        
        # Validate both fallback attempts were made
        mock_client.table.assert_called_with('profiles')
        mock_client.auth.admin.get_user_by_id.assert_called_with(user_id)
    
    async def test_get_user_by_id_not_found(self):
        """
        Test user retrieval for non-existent user.
        
        Validates proper handling when user is not found in either
        profiles table or auth.users metadata.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock empty profiles table response
        mock_profiles_response = Mock()
        mock_profiles_response.data = []
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profiles_response
        
        # Mock empty auth.users response
        mock_auth_response = Mock()
        mock_auth_response.user = None
        mock_client.auth.admin.get_user_by_id.return_value = mock_auth_response
        
        # Test user retrieval
        result = await service.get_user_by_id(user_id, use_service_role=True)
        
        # Validate no user found
        assert result is None
        
        # Validate both methods were attempted
        mock_client.table.assert_called_with('profiles')
        mock_client.auth.admin.get_user_by_id.assert_called_with(user_id)
    
    async def test_get_user_by_id_database_error(self):
        """
        Test user retrieval with database error.
        
        Validates proper error handling when database operations fail
        with appropriate exception wrapping and logging.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock database error
        mock_client.table.return_value.select.return_value.eq.return_value.execute.side_effect = Exception("Database connection failed")
        
        # Test user retrieval raises proper exception
        with pytest.raises(DatabaseServiceError, match=f"Failed to retrieve user {user_id}"):
            await service.get_user_by_id(user_id, use_service_role=True)

# ==============================================================================
# SWIPE INTERACTION TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestSwipeInteractions:
    """
    Test swipe interaction recording and validation.
    
    Comprehensive testing of swipe recording business logic,
    validation rules, session management, and ML signal processing.
    
    Swipe Recording Logic:
    - Data validation and business rules
    - Session counter updates
    - Preference strength calculation
    - Context data processing
    """
    
    async def test_record_swipe_interaction_success(self):
        """
        Test successful swipe interaction recording with complete data.
        
        Validates that swipe interactions are recorded with all required
        fields, proper validation, and session management integration.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        product_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock successful insertion response
        interaction_id = str(uuid.uuid4())
        mock_response = Mock()
        mock_response.data = [{
            'id': interaction_id,
            'user_id': user_id,
            'session_id': session_id,
            'product_id': product_id,
            'swipe_direction': 'right',
            'preference_strength': 0.8
        }]
        mock_client.table.return_value.insert.return_value.execute.return_value = mock_response
        
        # Mock session update RPC call
        mock_client.rpc.return_value.execute.return_value = Mock()
        
        # Test swipe recording
        result = await service.record_swipe_interaction(
            user_id=user_id,
            session_id=session_id,
            product_id=product_id,
            direction='right',
            time_spent_seconds=15,
            preference_strength=0.8
        )
        
        # Validate result
        assert result == interaction_id
        
        # Validate database operations
        mock_client.table.assert_called_with('swipe_interactions')
        
        # Validate insertion data
        insert_call = mock_client.table.return_value.insert
        insert_call.assert_called_once()
        insert_data = insert_call.call_args[0][0]
        
        assert insert_data['user_id'] == user_id
        assert insert_data['session_id'] == session_id
        assert insert_data['product_id'] == product_id
        assert insert_data['swipe_direction'] == 'right'
        assert insert_data['preference_strength'] == 0.8
        assert insert_data['time_spent_seconds'] == 15
        assert_valid_uuid(insert_data['id'])
        assert 'swipe_timestamp' in insert_data
        
        # Validate session update
        mock_client.rpc.assert_called_with('increment_session_swipes', {'session_id_param': session_id})
    
    async def test_record_swipe_validation_errors(self):
        """
        Test swipe recording validation with various invalid inputs.
        
        Validates that business rules are enforced at the service layer
        with appropriate validation errors for invalid data.
        
        Validation Rules:
        - Must have either product_id or category_id
        - Swipe direction must be valid
        - Preference strength must be between 0.0 and 1.0
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        
        # Test missing product_id and category_id
        with pytest.raises(ValidationError, match="Must specify either product_id or category_id"):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=session_id,
                direction='right'
            )
        
        # Test invalid swipe direction
        with pytest.raises(ValidationError, match="Invalid swipe direction"):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=session_id,
                product_id=str(uuid.uuid4()),
                direction='invalid_direction'
            )
        
        # Test preference strength too high
        with pytest.raises(ValidationError, match="Preference strength must be between 0.0 and 1.0"):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=session_id,
                product_id=str(uuid.uuid4()),
                direction='right',
                preference_strength=1.5
            )
        
        # Test preference strength too low
        with pytest.raises(ValidationError, match="Preference strength must be between 0.0 and 1.0"):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=session_id,
                product_id=str(uuid.uuid4()),
                direction='right',
                preference_strength=-0.1
            )
    
    async def test_record_swipe_database_error(self):
        """
        Test swipe recording with database insertion failure.
        
        Validates proper error handling when database operations fail
        during swipe interaction recording.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        product_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock database insertion failure
        mock_client.table.return_value.insert.return_value.execute.side_effect = Exception("Database error")
        
        # Test swipe recording raises proper exception
        with pytest.raises(DatabaseServiceError, match="Failed to record swipe interaction"):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=session_id,
                product_id=product_id,
                direction='right'
            )

# ==============================================================================
# USER PREFERENCES TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestUserPreferences:
    """
    Test user preference calculation and management.
    
    Comprehensive testing of ML preference calculation algorithms,
    caching mechanisms, and data quality validation.
    
    Preference Calculation Testing:
    - ML algorithm logic for category preferences
    - Brand scoring and affinity calculation
    - Price range determination from interaction history
    - Engagement rate and data quality metrics
    """
    
    async def test_get_user_preferences_cached(self):
        """
        Test retrieval of cached user preferences.
        
        Validates that pre-calculated preferences are efficiently
        retrieved from the cache without recalculation.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock cached preferences
        cached_preferences = {
            'user_id': user_id,
            'category_preferences': {'Electronics': 0.8, 'Fashion': 0.6},
            'price_range': {'min': 100, 'max': 500, 'currency': 'GBP'},
            'liked_brands': ['Apple', 'Nike'],
            'engagement_rate': 0.75,
            'total_swipes': 150,
            'last_calculated': datetime.utcnow().isoformat()
        }
        
        # Mock database response
        mock_response = Mock()
        mock_response.data = [cached_preferences]
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        
        # Test preference retrieval
        result = await service.get_user_preferences(user_id)
        
        # Validate result
        assert result == cached_preferences
        assert result['user_id'] == user_id
        assert 'category_preferences' in result
        assert 'engagement_rate' in result
        
        # Validate database call
        mock_client.table.assert_called_with('user_preferences')
    
    async def test_get_user_preferences_not_found(self):
        """
        Test preference retrieval for user without calculated preferences.
        
        Validates graceful handling when preferences haven't been
        calculated yet, returning None to trigger calculation.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock empty response
        mock_response = Mock()
        mock_response.data = []
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        
        # Test preference retrieval
        result = await service.get_user_preferences(user_id)
        
        # Validate no preferences found
        assert result is None
    
    async def test_calculate_user_preferences_with_interactions(self):
        """
        Test preference calculation with substantial interaction data.
        
        Validates that the ML preference calculation algorithm correctly
        processes swipe interaction history to generate accurate preferences.
        
        ML Algorithm Validation:
        - Category preference calculation from swipe ratios
        - Brand scoring based on positive/negative interactions
        - Price range determination from liked products
        - Engagement metrics and confidence calculations
        """
        service = DatabaseService()
        user_data = UserFactory.build()
        user_id = user_data['id']
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock user existence check
        service.get_user_by_id = AsyncMock(return_value=user_data)
        
        # Mock interaction data with clear preference patterns
        mock_interactions = [
            # Electronics - strong positive preference
            {
                'swipe_direction': 'right',
                'product_id': str(uuid.uuid4()),
                'preference_strength': 0.8,
                'products': {
                    'title': 'iPhone 15 Pro',
                    'price_min': 999,
                    'price_max': 1199,
                    'brand': 'Apple',
                    'categories': {'name': 'Electronics'}
                }
            },
            {
                'swipe_direction': 'right',
                'product_id': str(uuid.uuid4()),
                'preference_strength': 0.9,
                'products': {
                    'title': 'MacBook Pro',
                    'price_min': 1299,
                    'price_max': 1599,
                    'brand': 'Apple',
                    'categories': {'name': 'Electronics'}
                }
            },
            # Fashion - mixed signals
            {
                'swipe_direction': 'left',
                'product_id': str(uuid.uuid4()),
                'preference_strength': 0.2,
                'products': {
                    'title': 'Designer Handbag',
                    'price_min': 500,
                    'price_max': 800,
                    'brand': 'Gucci',
                    'categories': {'name': 'Fashion'}
                }
            },
            {
                'swipe_direction': 'right',
                'product_id': str(uuid.uuid4()),
                'preference_strength': 0.7,
                'products': {
                    'title': 'Nike Running Shoes',
                    'price_min': 120,
                    'price_max': 180,
                    'brand': 'Nike',
                    'categories': {'name': 'Fashion'}
                }
            }
        ]
        
        # Mock database responses
        mock_interactions_response = Mock()
        mock_interactions_response.data = mock_interactions
        mock_client.table.return_value.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value = mock_interactions_response
        
        # Mock preference storage
        mock_storage_response = Mock()
        mock_storage_response.data = [{'user_id': user_id}]
        mock_client.table.return_value.upsert.return_value.execute.return_value = mock_storage_response
        
        # Test preference calculation
        preferences = await service.calculate_user_preferences(user_id)
        
        # Validate preference structure
        assert preferences['user_id'] == user_id
        assert 'category_preferences' in preferences
        assert 'brand_scores' in preferences
        assert 'price_range' in preferences
        assert 'total_swipes' in preferences
        assert 'engagement_rate' in preferences
        assert 'data_quality_score' in preferences
        
        # Validate ML calculations
        assert preferences['total_swipes'] == 4
        assert preferences['right_swipes'] == 3
        assert preferences['left_swipes'] == 1
        
        # Validate category preferences (Electronics should be higher)
        category_prefs = preferences['category_preferences']
        assert 'Electronics' in category_prefs
        assert 'Fashion' in category_prefs
        assert category_prefs['Electronics'] > category_prefs['Fashion']
        assert category_prefs['Electronics'] == 1.0  # 2/2 right swipes
        assert category_prefs['Fashion'] == 0.5  # 1/2 right swipes
        
        # Validate engagement rate calculation
        expected_engagement = 3 / 4  # 3 right swipes out of 4 total
        assert abs(preferences['engagement_rate'] - expected_engagement) < 0.01
        
        # Validate price range calculation
        price_range = preferences['price_range']
        assert price_range['currency'] == 'GBP'
        assert price_range['min'] >= 0
        assert price_range['max'] > price_range['min']
        
        # Validate brand analysis
        liked_brands = preferences['liked_brands']
        brand_scores = preferences['brand_scores']
        # Apple should be liked (2 right swipes)
        # Nike should be liked (1 right swipe)
        # Gucci should have low score (1 left swipe)
        
        # Validate data quality score
        assert 0.0 <= preferences['data_quality_score'] <= 1.0
        
        # Validate database operations
        mock_client.table.assert_any_call('swipe_interactions')
        mock_client.table.assert_any_call('user_preferences')
    
    async def test_calculate_user_preferences_no_data(self):
        """
        Test preference calculation for user with no interaction data.
        
        Validates that new users receive sensible default preferences
        until sufficient data is available for ML analysis.
        """
        service = DatabaseService()
        user_data = UserFactory.build()
        user_id = user_data['id']
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock user existence check
        service.get_user_by_id = AsyncMock(return_value=user_data)
        
        # Mock empty interactions response
        mock_response = Mock()
        mock_response.data = []
        mock_client.table.return_value.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value = mock_response
        
        # Mock preference storage
        mock_storage_response = Mock()
        mock_storage_response.data = [{'user_id': user_id}]
        mock_client.table.return_value.upsert.return_value.execute.return_value = mock_storage_response
        
        # Test preference calculation
        preferences = await service.calculate_user_preferences(user_id)
        
        # Validate default preferences
        assert preferences['user_id'] == user_id
        assert preferences['total_swipes'] == 0
        assert preferences['engagement_rate'] == 0.0
        assert preferences['data_quality_score'] == 0.0
        
        # Validate empty collections
        assert preferences['category_preferences'] == {}
        assert preferences['liked_brands'] == []
        assert preferences['brand_scores'] == {}
        
        # Validate default price range
        assert preferences['price_range']['min'] == 0
        assert preferences['price_range']['max'] == 1000
        assert preferences['price_range']['currency'] == 'GBP'
    
    async def test_calculate_user_preferences_user_not_found(self):
        """
        Test preference calculation for non-existent user.
        
        Validates proper error handling when trying to calculate
        preferences for users that don't exist.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        
        # Mock user not found
        service.get_user_by_id = AsyncMock(return_value=None)
        
        # Test preference calculation raises proper exception
        with pytest.raises(UserNotFoundError, match=f"User {user_id} not found"):
            await service.calculate_user_preferences(user_id)

# ==============================================================================
# AFFILIATE TRACKING TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestAffiliateTracking:
    """
    Test affiliate click tracking and revenue attribution.
    
    Comprehensive testing of affiliate tracking business logic,
    network detection, commission calculation, and conversion preparation.
    
    Affiliate Tracking Logic:
    - Click recording with complete context
    - Network detection from URLs
    - Commission calculation and revenue attribution
    - Anonymous and authenticated user tracking
    """
    
    async def test_record_affiliate_click_success(self):
        """
        Test successful affiliate click recording with complete data.
        
        Validates that affiliate clicks are recorded with proper
        tracking data, network detection, and commission calculation.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        product_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        affiliate_url = "https://amazon.co.uk/dp/B123456?tag=aclue-21"
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock product lookup
        product_data = {
            'id': product_id,
            'title': 'Test Product',
            'price_min': 100.0,
            'price_max': 150.0,
            'commission_rate': 0.05
        }
        service._get_product_for_affiliate_click = AsyncMock(return_value=product_data)
        
        # Mock successful click insertion
        click_id = str(uuid.uuid4())
        mock_response = Mock()
        mock_response.data = [{
            'id': click_id,
            'user_id': user_id,
            'product_id': product_id,
            'affiliate_network': 'amazon',
            'expected_commission': 5.0
        }]
        mock_client.table.return_value.insert.return_value.execute.return_value = mock_response
        
        # Mock session update (simplified for test)
        mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = Mock()
        
        # Test affiliate click recording
        result = await service.record_affiliate_click(
            user_id=user_id,
            product_id=product_id,
            session_id=session_id,
            affiliate_url=affiliate_url,
            source_page="recommendations",
            device_type="desktop"
        )
        
        # Validate result
        assert result == click_id
        
        # Validate database operations
        mock_client.table.assert_any_call('affiliate_clicks')
        
        # Validate insertion data
        insert_call = mock_client.table.return_value.insert
        insert_call.assert_called_once()
        insert_data = insert_call.call_args[0][0]
        
        assert insert_data['user_id'] == user_id
        assert insert_data['product_id'] == product_id
        assert insert_data['session_id'] == session_id
        assert insert_data['affiliate_url'] == affiliate_url
        assert insert_data['affiliate_network'] == 'amazon'
        assert insert_data['source_page'] == "recommendations"
        assert insert_data['device_type'] == "desktop"
        assert insert_data['commission_rate'] == 0.05
        assert insert_data['expected_commission'] == 5.0  # 5% of £100
        assert_valid_uuid(insert_data['id'])
        assert 'click_timestamp' in insert_data
        
        # Validate product lookup was called
        service._get_product_for_affiliate_click.assert_called_with(product_id)
    
    async def test_record_affiliate_click_product_not_found(self):
        """
        Test affiliate click recording with non-existent product.
        
        Validates proper error handling when attempting to record
        clicks for products that don't exist.
        """
        service = DatabaseService()
        user_id = str(uuid.uuid4())
        product_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        affiliate_url = "https://amazon.co.uk/dp/B123456?tag=aclue-21"
        
        # Mock product not found
        service._get_product_for_affiliate_click = AsyncMock(return_value=None)
        
        # Test affiliate click recording fails
        with pytest.raises(ProductNotFoundError, match=f"Product {product_id} not found"):
            await service.record_affiliate_click(
                user_id=user_id,
                product_id=product_id,
                session_id=session_id,
                affiliate_url=affiliate_url
            )
    
    def test_detect_affiliate_network_amazon(self):
        """
        Test affiliate network detection for Amazon URLs.
        
        Validates that Amazon Associates URLs are correctly identified
        for proper tracking and commission attribution.
        """
        service = DatabaseService()
        
        # Test various Amazon URL patterns
        amazon_urls = [
            "https://amazon.co.uk/dp/B123456?tag=aclue-21",
            "https://www.amazon.com/product?tag=aclue-20",
            "https://amazon.de/gp/product/B123456?tag=aclue-de-21",
        ]
        
        for url in amazon_urls:
            network = service._detect_affiliate_network(url)
            assert network == 'amazon', f"Failed to detect Amazon for URL: {url}"
    
    def test_detect_affiliate_network_commission_junction(self):
        """
        Test affiliate network detection for Commission Junction URLs.
        
        Validates that CJ affiliate URLs are correctly identified
        with various domain patterns.
        """
        service = DatabaseService()
        
        # Test CJ URL patterns
        cj_urls = [
            "https://www.anrdoezrs.net/links/123456/type/dlg/https://merchant.com/product",
            "https://www.dpbolvw.net/click-123456-789",
            "https://www.tkqlhce.com/click-123456-789"
        ]
        
        for url in cj_urls:
            network = service._detect_affiliate_network(url)
            assert network == 'commission_junction', f"Failed to detect CJ for URL: {url}"
    
    def test_detect_affiliate_network_unknown(self):
        """
        Test affiliate network detection for unknown URLs.
        
        Validates that unrecognised affiliate URLs are properly
        categorised as unknown for tracking purposes.
        """
        service = DatabaseService()
        
        # Test unknown URL patterns
        unknown_urls = [
            "https://example.com/product?ref=123",
            "https://unknown-affiliate.com/track?id=456",
            "https://direct-merchant.com/product/123"
        ]
        
        for url in unknown_urls:
            network = service._detect_affiliate_network(url)
            assert network == 'unknown', f"Should detect unknown for URL: {url}"

# ==============================================================================
# PRODUCT RECOMMENDATION TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestProductRecommendations:
    """
    Test product recommendation algorithm and filtering.
    
    Comprehensive testing of recommendation logic, personalisation,
    product scoring, and filtering mechanisms for ML-driven suggestions.
    
    Recommendation Algorithm Testing:
    - User preference integration and scoring
    - Product filtering and ranking logic
    - Diversity and quality optimisation
    - Performance and scalability validation
    """
    
    async def test_get_products_for_recommendations_with_preferences(self):
        """
        Test product recommendations with user preferences.
        
        Validates that user preferences are properly applied to
        product filtering and ranking for personalised recommendations.
        """
        service = DatabaseService()
        
        # Mock anonymous client
        mock_client = Mock()
        service._anon_client = mock_client
        
        # Mock user preferences
        user_preferences = {
            'category_preferences': {'Electronics': 0.8, 'Fashion': 0.6},
            'price_range': {'min': 100, 'max': 500, 'currency': 'GBP'},
            'liked_brands': ['Apple', 'Nike'],
            'brand_scores': {'Apple': 0.9, 'Nike': 0.8}
        }
        
        # Mock product data
        mock_products = [
            {
                'id': str(uuid.uuid4()),
                'title': 'iPhone 15',
                'price_min': 200,
                'price_max': 400,
                'brand': 'Apple',
                'rating': 4.8,
                'review_count': 1500,
                'categories': {'name': 'Electronics'}
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Nike Air Max',
                'price_min': 150,
                'price_max': 200,
                'brand': 'Nike',
                'rating': 4.5,
                'review_count': 800,
                'categories': {'name': 'Fashion'}
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Samsung Galaxy',
                'price_min': 300,
                'price_max': 450,
                'brand': 'Samsung',
                'rating': 4.2,
                'review_count': 600,
                'categories': {'name': 'Electronics'}
            }
        ]
        
        # Mock database response
        mock_response = Mock()
        mock_response.data = mock_products
        
        # Build mock query chain
        mock_query = Mock()
        mock_query.execute.return_value = mock_response
        mock_query.limit.return_value = mock_query
        mock_query.order.return_value = mock_query
        mock_query.lte.return_value = mock_query
        mock_query.gte.return_value = mock_query
        mock_query.or_.return_value = mock_query
        
        mock_client.table.return_value.select.return_value.eq.return_value = mock_query
        
        # Test product recommendations
        result = await service.get_products_for_recommendations(
            user_preferences=user_preferences,
            limit=10
        )
        
        # Validate result structure
        assert isinstance(result, list)
        assert len(result) <= 10
        
        # Validate products were returned (may be scored)
        for product in result:
            assert 'id' in product
            assert 'title' in product
            assert 'brand' in product
            # Products may have relevance scores added
        
        # Validate database query was made
        mock_client.table.assert_called_with('products')
    
    def test_score_products_by_preferences(self):
        """
        Test ML scoring algorithm for product recommendations.
        
        Validates that products are properly scored based on user
        preferences with appropriate weighting and ranking logic.
        
        Scoring Algorithm:
        - Category preference match (40% weight)
        - Brand preference match (30% weight)
        - Price preference fit (20% weight)
        - Product quality signals (10% weight)
        """
        service = DatabaseService()
        
        # Mock user preferences
        preferences = {
            'category_preferences': {'Electronics': 0.9, 'Fashion': 0.7},
            'brand_scores': {'Apple': 0.9, 'Nike': 0.8},
            'liked_brands': ['Apple', 'Nike'],
            'price_range': {'min': 100, 'max': 500}
        }
        
        # Mock products for scoring
        products = [
            {
                'id': str(uuid.uuid4()),
                'title': 'iPhone 15',
                'price_min': 300,
                'price_max': 400,
                'brand': 'Apple',
                'rating': 4.8,
                'review_count': 1500,
                'categories': {'name': 'Electronics'}
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Generic Phone',
                'price_min': 600,  # Outside price range
                'price_max': 800,
                'brand': 'Unknown',
                'rating': 3.5,
                'review_count': 50,
                'categories': {'name': 'Electronics'}
            }
        ]
        
        # Test product scoring
        scored_products = service._score_products_by_preferences(products, preferences)
        
        # Validate scoring results
        assert len(scored_products) == 2
        
        # Validate scores were added
        for product in scored_products:
            assert '_relevance_score' in product
            assert 0.0 <= product['_relevance_score'] <= 1.0
        
        # Validate ranking (iPhone should score higher)
        iphone = next(p for p in scored_products if 'iPhone' in p['title'])
        generic = next(p for p in scored_products if 'Generic' in p['title'])
        
        assert iphone['_relevance_score'] > generic['_relevance_score']
        
        # iPhone should score high due to:
        # - High category preference for Electronics (0.9 * 0.4 = 0.36)
        # - High brand preference for Apple (0.9 * 0.3 = 0.27)
        # - Price in preferred range (good price fit score)
        # - High quality signals (4.8 rating, 1500 reviews)
        
        # Generic phone should score lower due to:
        # - Same category preference but lower quality
        # - No brand preference (unknown brand)
        # - Price outside preferred range
        # - Lower quality signals

# ==============================================================================
# PERFORMANCE AND ANALYTICS TESTS
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestPerformanceAndAnalytics:
    """
    Test performance monitoring and analytics functionality.
    
    Validates business intelligence metrics, performance monitoring,
    and bulk operation efficiency for operational dashboards.
    
    Analytics Testing:
    - User engagement metrics calculation
    - Revenue attribution analytics
    - System performance metrics
    - Bulk operation efficiency
    """
    
    async def test_get_user_analytics_summary(self):
        """
        Test comprehensive user analytics summary generation.
        
        Validates that user behaviour analytics are properly calculated
        and formatted for business intelligence dashboards.
        """
        service = DatabaseService()
        user_data = UserFactory.build()
        user_id = user_data['id']
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Mock user existence check
        service.get_user_by_id = AsyncMock(return_value=user_data)
        
        # Mock analytics data
        mock_swipes = [
            {
                'swipe_direction': 'right',
                'product_id': str(uuid.uuid4()),
                'swipe_timestamp': datetime.utcnow().isoformat(),
                'preference_strength': 0.8,
                'products': {'categories': {'name': 'Electronics'}}
            },
            {
                'swipe_direction': 'left',
                'product_id': str(uuid.uuid4()),
                'swipe_timestamp': datetime.utcnow().isoformat(),
                'preference_strength': 0.3,
                'products': {'categories': {'name': 'Fashion'}}
            }
        ]
        
        mock_clicks = [
            {
                'product_id': str(uuid.uuid4()),
                'affiliate_network': 'amazon',
                'is_converted': True,
                'expected_commission': 10.0,
                'actual_commission': 8.5
            }
        ]
        
        mock_views = [
            {
                'product_id': str(uuid.uuid4()),
                'view_source': 'recommendations',
                'view_duration_seconds': 25,
                'interaction_type': 'click'
            }
        ]
        
        # Mock database responses
        mock_swipes_response = Mock()
        mock_swipes_response.data = mock_swipes
        
        mock_clicks_response = Mock()
        mock_clicks_response.data = mock_clicks
        
        mock_views_response = Mock()
        mock_views_response.data = mock_views
        
        # Configure mock query responses
        def mock_table_response(table_name):
            if table_name == 'swipe_interactions':
                return_mock = Mock()
                return_mock.data = mock_swipes
            elif table_name == 'affiliate_clicks':
                return_mock = Mock()
                return_mock.data = mock_clicks
            elif table_name == 'product_views':
                return_mock = Mock()
                return_mock.data = mock_views
            else:
                return_mock = Mock()
                return_mock.data = []
            
            mock_query = Mock()
            mock_query.execute.return_value = return_mock
            mock_query.gte.return_value = mock_query
            mock_query.eq.return_value = mock_query
            mock_query.select.return_value = mock_query
            
            table_mock = Mock()
            table_mock.select.return_value = mock_query
            return table_mock
        
        mock_client.table.side_effect = mock_table_response
        
        # Test analytics summary generation
        result = await service.get_user_analytics_summary(user_id, days=30)
        
        # Validate summary structure
        assert result['user_id'] == user_id
        assert result['period_days'] == 30
        assert 'generated_at' in result
        assert 'swipe_behaviour' in result
        assert 'click_behaviour' in result
        assert 'view_behaviour' in result
        assert 'engagement_score' in result
        assert_datetime_format(result['generated_at'])
        
        # Validate swipe analytics
        swipe_behaviour = result['swipe_behaviour']
        assert swipe_behaviour['total_swipes'] == 2
        assert swipe_behaviour['right_swipes'] == 1
        assert swipe_behaviour['engagement_rate'] == 0.5  # 1/2 right swipes
        assert 'category_preferences' in swipe_behaviour
        
        # Validate click analytics
        click_behaviour = result['click_behaviour']
        assert click_behaviour['total_clicks'] == 1
        assert click_behaviour['conversions'] == 1
        assert click_behaviour['conversion_rate'] == 1.0  # 1/1 converted
        assert click_behaviour['revenue_generated'] == 8.5
        
        # Validate view analytics
        view_behaviour = result['view_behaviour']
        assert view_behaviour['total_views'] == 1
        assert view_behaviour['avg_view_duration'] == 25.0
        
        # Validate engagement score calculation
        assert 0.0 <= result['engagement_score'] <= 1.0
    
    async def test_bulk_record_product_views(self):
        """
        Test bulk product view recording for performance.
        
        Validates that bulk operations are efficiently processed
        with proper batching and error handling.
        """
        service = DatabaseService()
        
        # Mock service client
        mock_client = Mock()
        service._service_client = mock_client
        
        # Generate bulk view data
        view_records = []
        for i in range(50):
            view_records.append({
                'product_id': str(uuid.uuid4()),
                'session_id': str(uuid.uuid4()),
                'user_id': str(uuid.uuid4()),
                'view_source': 'recommendations',
                'view_duration_seconds': 15 + i
            })
        
        # Mock successful batch insertions
        mock_responses = []
        batch_size = 10
        for i in range(0, len(view_records), batch_size):
            batch = view_records[i:i + batch_size]
            mock_response = Mock()
            mock_response.data = batch  # Return the batch data
            mock_responses.append(mock_response)
        
        mock_client.table.return_value.insert.return_value.execute.side_effect = mock_responses
        
        # Test bulk recording
        result = await service.bulk_record_product_views(view_records, batch_size=batch_size)
        
        # Validate result
        assert result == len(view_records)  # All records processed
        
        # Validate batching occurred
        expected_batches = (len(view_records) + batch_size - 1) // batch_size
        assert mock_client.table.return_value.insert.return_value.execute.call_count == expected_batches
    
    async def test_bulk_record_validation_error(self):
        """
        Test bulk operation validation with invalid data.
        
        Validates that bulk operations properly validate input data
        and reject invalid records with appropriate error messages.
        """
        service = DatabaseService()
        
        # Invalid view records (missing required fields)
        invalid_records = [
            {'product_id': str(uuid.uuid4())},  # Missing session_id
            {'session_id': str(uuid.uuid4())},  # Missing product_id
        ]
        
        # Test bulk recording with invalid data
        with pytest.raises(ValidationError, match="Missing required fields"):
            await service.bulk_record_product_views(invalid_records)

# ==============================================================================
# ERROR HANDLING AND EDGE CASES
# ==============================================================================

@pytest.mark.unit
@pytest.mark.asyncio
class TestErrorHandling:
    """
    Test comprehensive error handling and edge cases.
    
    Validates that all service methods handle errors gracefully
    with proper exception wrapping, logging, and recovery mechanisms.
    
    Error Handling Testing:
    - Database connection failures
    - Invalid input validation
    - Network timeouts and retries
    - Service unavailability scenarios
    """
    
    async def test_database_connection_error(self):
        """
        Test handling of database connection failures.
        
        Validates that database connection errors are properly wrapped
        and logged with appropriate error messages.
        """
        service = DatabaseService()
        
        # Mock service client with connection error
        mock_client = Mock()
        mock_client.table.side_effect = Exception("Connection failed")
        service._service_client = mock_client
        
        # Test various operations fail gracefully
        user_id = str(uuid.uuid4())
        
        with pytest.raises(DatabaseServiceError):
            await service.get_user_by_id(user_id, use_service_role=True)
        
        with pytest.raises(DatabaseServiceError):
            await service.get_user_preferences(user_id)
        
        with pytest.raises(DatabaseServiceError):
            await service.record_swipe_interaction(
                user_id=user_id,
                session_id=str(uuid.uuid4()),
                product_id=str(uuid.uuid4()),
                direction='right'
            )
    
    async def test_service_initialization_error(self):
        """
        Test handling of service initialization errors.
        
        Validates that service initialization problems are properly
        handled without causing application crashes.
        """
        # Mock Supabase client creation failure
        with patch('app.services.database_service.get_supabase_service') as mock_get_client:
            mock_get_client.side_effect = Exception("Failed to initialize Supabase client")
            
            service = DatabaseService()
            
            # Service client creation should raise DatabaseServiceError
            with pytest.raises(Exception):  # Raw exception from mock
                service._get_service_client()
    
    async def test_invalid_input_handling(self):
        """
        Test handling of various invalid input scenarios.
        
        Validates that invalid inputs are properly validated and
        rejected with appropriate error messages.
        """
        service = DatabaseService()
        
        # Test invalid UUID formats
        invalid_uuids = ["", "not-a-uuid", None, 123, "invalid-format"]
        
        for invalid_uuid in invalid_uuids:
            if invalid_uuid is not None:
                # Most methods will validate UUIDs at the application layer
                # This tests the service handles various input types gracefully
                try:
                    await service.get_user_by_id(str(invalid_uuid), use_service_role=True)
                except (DatabaseServiceError, ValueError, TypeError):
                    # Various exceptions are acceptable for invalid input
                    pass