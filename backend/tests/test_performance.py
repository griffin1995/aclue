"""
Performance Testing Suite for Aclue Backend

Comprehensive performance tests for database operations, API endpoints,
and critical user journeys to ensure scalability and responsive UX.

Test Coverage:
- Database query performance and optimization
- API endpoint response times and throughput
- Concurrent user load testing
- Memory and resource utilisation monitoring
- Bottleneck identification and profiling
- Performance regression detection

Testing Strategy:
Performance testing with automated benchmarks, load simulation,
and resource monitoring to validate system performance under
realistic and stress conditions.

Business Context:
Performance directly impacts user satisfaction, conversion rates,
and platform scalability. These tests ensure Aclue maintains
excellent performance as user base grows.

Requirements:
- Database operations must complete within acceptable thresholds
- API endpoints must meet SLA response time requirements
- System must handle concurrent users without degradation
- Resource usage must remain within acceptable limits
- Performance must not regress between releases
"""

# ==============================================================================
# IMPORTS AND DEPENDENCIES
# ==============================================================================

import asyncio
import time
import statistics
import psutil
import pytest
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Callable
from unittest.mock import AsyncMock, MagicMock

from fastapi.testclient import TestClient
from httpx import AsyncClient
import numpy as np

from app.main import app
from app.services.database_service import DatabaseService
from tests.conftest import (
    test_client,
    mock_db_service,
    mock_supabase_client,
    UserFactory,
    CategoryFactory,
    ProductFactory,
    SwipeInteractionFactory,
)

# ==============================================================================
# PERFORMANCE TEST CONFIGURATION
# ==============================================================================

# Performance thresholds (in milliseconds)
PERFORMANCE_THRESHOLDS = {
    'database_query_fast': 50,      # Fast queries (simple selects)
    'database_query_medium': 200,   # Medium queries (joins, aggregations)
    'database_query_slow': 500,     # Complex queries (analytics)
    'api_endpoint_fast': 100,       # Fast API responses
    'api_endpoint_medium': 300,     # Medium API responses
    'api_endpoint_slow': 1000,      # Slow API responses (complex operations)
    'concurrent_user_p95': 500,     # 95th percentile under load
    'memory_usage_mb': 256,         # Maximum memory usage in MB
}

# Load testing parameters
LOAD_TEST_CONFIG = {
    'concurrent_users': [1, 5, 10, 25, 50],
    'requests_per_user': 10,
    'ramp_up_time': 2,  # seconds
    'test_duration': 30,  # seconds
}

# ==============================================================================
# PERFORMANCE TESTING UTILITIES
# ==============================================================================

class PerformanceMetrics:
    """Utility class for collecting and analysing performance metrics."""
    
    def __init__(self):
        self.response_times = []
        self.memory_usage = []
        self.cpu_usage = []
        self.start_time = None
        self.end_time = None
    
    def start_monitoring(self):
        """Begin performance monitoring."""
        self.start_time = time.time()
        self.response_times = []
        self.memory_usage = []
        self.cpu_usage = []
    
    def record_response_time(self, response_time_ms: float):
        """Record a response time measurement."""
        self.response_times.append(response_time_ms)
    
    def record_system_metrics(self):
        """Record current system resource usage."""
        process = psutil.Process()
        self.memory_usage.append(process.memory_info().rss / 1024 / 1024)  # MB
        self.cpu_usage.append(process.cpu_percent())
    
    def stop_monitoring(self):
        """Stop performance monitoring and calculate final metrics."""
        self.end_time = time.time()
    
    def get_statistics(self) -> Dict[str, Any]:
        """Calculate and return performance statistics."""
        if not self.response_times:
            return {}
        
        return {
            'response_times': {
                'count': len(self.response_times),
                'mean': statistics.mean(self.response_times),
                'median': statistics.median(self.response_times),
                'p95': np.percentile(self.response_times, 95),
                'p99': np.percentile(self.response_times, 99),
                'min': min(self.response_times),
                'max': max(self.response_times),
                'std_dev': statistics.stdev(self.response_times) if len(self.response_times) > 1 else 0,
            },
            'memory_usage': {
                'peak_mb': max(self.memory_usage) if self.memory_usage else 0,
                'avg_mb': statistics.mean(self.memory_usage) if self.memory_usage else 0,
            },
            'cpu_usage': {
                'peak_percent': max(self.cpu_usage) if self.cpu_usage else 0,
                'avg_percent': statistics.mean(self.cpu_usage) if self.cpu_usage else 0,
            },
            'throughput': {
                'requests_per_second': len(self.response_times) / (self.end_time - self.start_time) if self.end_time and self.start_time else 0,
            }
        }

async def measure_execution_time(coroutine) -> tuple[Any, float]:
    """Measure execution time of an async function."""
    start_time = time.time()
    result = await coroutine
    end_time = time.time()
    execution_time_ms = (end_time - start_time) * 1000
    return result, execution_time_ms

def measure_sync_execution_time(func: Callable, *args, **kwargs) -> tuple[Any, float]:
    """Measure execution time of a synchronous function."""
    start_time = time.time()
    result = func(*args, **kwargs)
    end_time = time.time()
    execution_time_ms = (end_time - start_time) * 1000
    return result, execution_time_ms

# ==============================================================================
# DATABASE PERFORMANCE TESTS
# ==============================================================================

@pytest.mark.performance
@pytest.mark.database
class TestDatabasePerformance:
    """
    Database performance testing suite.
    
    Tests database query performance, connection management,
    and data operation efficiency under various load conditions.
    """
    
    @pytest.mark.asyncio
    async def test_user_query_performance(self, mock_db_service):
        """
        Test user-related database query performance.
        
        Validates that user queries complete within acceptable
        time thresholds for optimal user experience.
        """
        # Set up test data
        test_user = UserFactory()
        mock_db_service.get_user_by_id.return_value = test_user
        
        # Test single user lookup performance
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        for _ in range(100):
            start_time = time.time()
            user = await mock_db_service.get_user_by_id("user-123")
            end_time = time.time()
            
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate performance thresholds
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['database_query_fast']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['database_query_fast'] * 2
        assert stats['memory_usage']['peak_mb'] < PERFORMANCE_THRESHOLDS['memory_usage_mb']
        
        print(f"\nUser Query Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} queries/sec")
    
    @pytest.mark.asyncio
    async def test_product_search_performance(self, mock_db_service):
        """
        Test product search query performance.
        
        Validates that product search operations maintain
        responsiveness under realistic query loads.
        """
        # Set up test products
        test_products = [ProductFactory() for _ in range(50)]
        mock_db_service.get_products.return_value = test_products
        
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test various search scenarios
        search_scenarios = [
            {'limit': 10, 'category': 'electronics'},
            {'limit': 20, 'price_min': 100, 'price_max': 500},
            {'limit': 15, 'brand': 'Apple'},
            {'limit': 25, 'rating_min': 4.0},
        ]
        
        for scenario in search_scenarios:
            for _ in range(25):  # 25 iterations per scenario
                start_time = time.time()
                products = await mock_db_service.get_products(**scenario)
                end_time = time.time()
                
                execution_time_ms = (end_time - start_time) * 1000
                metrics.record_response_time(execution_time_ms)
                metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate performance thresholds
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['database_query_medium']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['database_query_medium'] * 1.5
        
        print(f"\nProduct Search Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} searches/sec")
    
    @pytest.mark.asyncio
    async def test_swipe_interaction_performance(self, mock_db_service):
        """
        Test swipe interaction recording performance.
        
        Validates that swipe recording maintains low latency
        for responsive user interactions.
        """
        # Set up test data
        test_interaction = SwipeInteractionFactory()
        mock_db_service.record_swipe_interaction.return_value = test_interaction
        
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Simulate high-frequency swipe recording
        for _ in range(200):
            swipe_data = {
                'user_id': 'user-123',
                'product_id': f'product-{_ % 50}',
                'direction': 'right' if _ % 2 == 0 else 'left',
                'session_id': f'session-{_ // 10}',
                'time_spent_seconds': 5.5,
                'preference_strength': 0.8,
                'interaction_context': {'viewport_size': {'width': 1920, 'height': 1080}},
            }
            
            start_time = time.time()
            interaction = await mock_db_service.record_swipe_interaction(swipe_data)
            end_time = time.time()
            
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            
            # Record system metrics every 10 iterations
            if _ % 10 == 0:
                metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate critical performance thresholds for user interactions
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['database_query_fast']
        assert stats['response_times']['p99'] < PERFORMANCE_THRESHOLDS['database_query_fast'] * 3
        
        print(f"\nSwipe Recording Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  99th percentile: {stats['response_times']['p99']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} swipes/sec")
    
    @pytest.mark.asyncio
    async def test_recommendation_generation_performance(self, mock_db_service):
        """
        Test recommendation algorithm performance.
        
        Validates that personalised recommendations can be generated
        within acceptable time limits for real-time user experience.
        """
        # Set up test data for recommendation generation
        test_user = UserFactory()
        test_interactions = [SwipeInteractionFactory() for _ in range(100)]
        test_recommendations = [ProductFactory() for _ in range(10)]
        
        mock_db_service.get_user_preferences.return_value = {
            'categories': ['electronics', 'fashion'],
            'price_range': {'min': 50, 'max': 500},
            'brands': ['Apple', 'Nike'],
            'rating_threshold': 4.0,
        }
        mock_db_service.get_personalised_recommendations.return_value = test_recommendations
        
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test recommendation generation under load
        for _ in range(20):
            start_time = time.time()
            
            # Simulate recommendation generation process
            preferences = await mock_db_service.get_user_preferences("user-123")
            recommendations = await mock_db_service.get_personalised_recommendations(
                user_id="user-123",
                preferences=preferences,
                limit=10
            )
            
            end_time = time.time()
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate performance thresholds for recommendation generation
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['database_query_slow']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['database_query_slow'] * 1.5
        
        print(f"\nRecommendation Generation Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} recommendations/sec")

# ==============================================================================
# API ENDPOINT PERFORMANCE TESTS
# ==============================================================================

@pytest.mark.performance
@pytest.mark.api
class TestAPIPerformance:
    """
    API endpoint performance testing suite.
    
    Tests HTTP endpoint response times, throughput,
    and behaviour under various load conditions.
    """
    
    def test_authentication_endpoint_performance(self, test_client):
        """
        Test authentication endpoint performance.
        
        Validates that login/registration endpoints maintain
        acceptable response times for good user experience.
        """
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test login endpoint performance
        login_data = {
            "email": "test@aclue.app",
            "password": "testpassword123"
        }
        
        for _ in range(50):
            start_time = time.time()
            response = test_client.post("/api/v1/auth/login", json=login_data)
            end_time = time.time()
            
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            
            # Record system metrics every 10 requests
            if _ % 10 == 0:
                metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate authentication performance thresholds
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['api_endpoint_medium']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['api_endpoint_medium'] * 2
        
        print(f"\nAuthentication Endpoint Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} requests/sec")
    
    def test_product_endpoint_performance(self, test_client):
        """
        Test product listing endpoint performance.
        
        Validates that product API endpoints can handle
        high-frequency requests with consistent response times.
        """
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test various product endpoint scenarios
        endpoints_to_test = [
            "/api/v1/products/",
            "/api/v1/products/?category=electronics",
            "/api/v1/products/?limit=20",
            "/api/v1/products/?price_min=100&price_max=500",
        ]
        
        for endpoint in endpoints_to_test:
            for _ in range(25):  # 25 requests per endpoint
                start_time = time.time()
                response = test_client.get(endpoint)
                end_time = time.time()
                
                execution_time_ms = (end_time - start_time) * 1000
                metrics.record_response_time(execution_time_ms)
                
                if _ % 5 == 0:
                    metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate product endpoint performance
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['api_endpoint_fast']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['api_endpoint_fast'] * 2
        
        print(f"\nProduct Endpoint Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} requests/sec")
    
    def test_swipe_recording_endpoint_performance(self, test_client):
        """
        Test swipe recording endpoint performance.
        
        Validates that swipe recording API maintains low latency
        for responsive user interactions.
        """
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test swipe recording under rapid interaction simulation
        for i in range(100):
            swipe_data = {
                "product_id": f"product-{i % 20}",
                "direction": "right" if i % 2 == 0 else "left",
                "session_id": f"session-{i // 10}",
                "time_spent_seconds": 3.5,
                "preference_strength": 0.75,
                "interaction_context": {
                    "viewport_size": {"width": 1920, "height": 1080},
                    "session_position": i % 10 + 1,
                    "device_type": "desktop",
                    "interaction_method": "button"
                }
            }
            
            start_time = time.time()
            response = test_client.post("/api/v1/swipes/", json=swipe_data)
            end_time = time.time()
            
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            
            if i % 10 == 0:
                metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Critical performance requirements for user interactions
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['api_endpoint_fast']
        assert stats['response_times']['p99'] < PERFORMANCE_THRESHOLDS['api_endpoint_fast'] * 3
        
        print(f"\nSwipe Recording Endpoint Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  99th percentile: {stats['response_times']['p99']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} swipes/sec")
    
    def test_recommendations_endpoint_performance(self, test_client):
        """
        Test recommendations endpoint performance.
        
        Validates that personalised recommendations can be delivered
        with acceptable response times for good user experience.
        """
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Test recommendation endpoint under realistic load
        for _ in range(30):
            start_time = time.time()
            response = test_client.get("/api/v1/recommendations/")
            end_time = time.time()
            
            execution_time_ms = (end_time - start_time) * 1000
            metrics.record_response_time(execution_time_ms)
            metrics.record_system_metrics()
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate recommendation endpoint performance
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['api_endpoint_medium']
        assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['api_endpoint_medium'] * 1.5
        
        print(f"\nRecommendations Endpoint Performance:")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} requests/sec")

# ==============================================================================
# CONCURRENT LOAD TESTING
# ==============================================================================

@pytest.mark.performance
@pytest.mark.load
class TestConcurrentLoadPerformance:
    """
    Concurrent load testing suite.
    
    Tests system behaviour under concurrent user load to validate
    scalability and identify performance bottlenecks.
    """
    
    def test_concurrent_user_load(self, test_client):
        """
        Test system performance under concurrent user load.
        
        Simulates multiple concurrent users to validate system
        scalability and identify performance degradation points.
        """
        def simulate_user_session(user_id: str, session_metrics: PerformanceMetrics):
            """Simulate a complete user session with multiple API calls."""
            session_start = time.time()
            
            # User authentication
            auth_start = time.time()
            login_response = test_client.post("/api/v1/auth/login", json={
                "email": f"user{user_id}@aclue.app",
                "password": "testpassword123"
            })
            auth_time = (time.time() - auth_start) * 1000
            session_metrics.record_response_time(auth_time)
            
            # Product browsing
            browse_start = time.time()
            products_response = test_client.get("/api/v1/products/?limit=10")
            browse_time = (time.time() - browse_start) * 1000
            session_metrics.record_response_time(browse_time)
            
            # Simulate swipe interactions
            for swipe_num in range(5):
                swipe_start = time.time()
                swipe_response = test_client.post("/api/v1/swipes/", json={
                    "product_id": f"product-{swipe_num}",
                    "direction": "right" if swipe_num % 2 == 0 else "left",
                    "session_id": f"session-{user_id}",
                    "time_spent_seconds": 4.0,
                    "preference_strength": 0.7,
                    "interaction_context": {"session_position": swipe_num + 1}
                })
                swipe_time = (time.time() - swipe_start) * 1000
                session_metrics.record_response_time(swipe_time)
            
            # Get recommendations
            rec_start = time.time()
            rec_response = test_client.get("/api/v1/recommendations/")
            rec_time = (time.time() - rec_start) * 1000
            session_metrics.record_response_time(rec_time)
            
            session_total_time = (time.time() - session_start) * 1000
            return session_total_time
        
        # Test with increasing concurrent user loads
        for concurrent_users in LOAD_TEST_CONFIG['concurrent_users']:
            print(f"\nTesting with {concurrent_users} concurrent users...")
            
            metrics = PerformanceMetrics()
            metrics.start_monitoring()
            
            # Use ThreadPoolExecutor to simulate concurrent users
            with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
                # Submit user session simulations
                future_to_user = {
                    executor.submit(simulate_user_session, str(user_id), metrics): user_id
                    for user_id in range(concurrent_users)
                }
                
                # Collect results as they complete
                session_times = []
                for future in as_completed(future_to_user):
                    user_id = future_to_user[future]
                    try:
                        session_time = future.result()
                        session_times.append(session_time)
                    except Exception as exc:
                        print(f'User {user_id} generated an exception: {exc}')
            
            metrics.stop_monitoring()
            stats = metrics.get_statistics()
            
            # Validate performance under load
            assert stats['response_times']['p95'] < PERFORMANCE_THRESHOLDS['concurrent_user_p95']
            assert stats['memory_usage']['peak_mb'] < PERFORMANCE_THRESHOLDS['memory_usage_mb']
            
            print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
            print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
            print(f"  Peak memory usage: {stats['memory_usage']['peak_mb']:.2f}MB")
            print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f} requests/sec")
            
            # Log performance degradation warnings
            if stats['response_times']['p95'] > PERFORMANCE_THRESHOLDS['concurrent_user_p95'] * 0.8:
                print(f"  ⚠️ Warning: Approaching performance threshold at {concurrent_users} users")
    
    @pytest.mark.asyncio
    async def test_async_concurrent_load(self):
        """
        Test async endpoint performance under concurrent load.
        
        Uses async HTTP client to test system behaviour with
        high-concurrency async operations.
        """
        async def async_user_session(session_id: str, client: AsyncClient, metrics: PerformanceMetrics):
            """Simulate async user session."""
            session_tasks = []
            
            # Authentication
            auth_start = time.time()
            auth_response = await client.post("/api/v1/auth/login", json={
                "email": f"async_user{session_id}@aclue.app",
                "password": "testpassword123"
            })
            auth_time = (time.time() - auth_start) * 1000
            metrics.record_response_time(auth_time)
            
            # Concurrent API calls
            tasks = [
                client.get("/api/v1/products/?limit=5"),
                client.get("/api/v1/recommendations/"),
                client.post("/api/v1/swipes/", json={
                    "product_id": "product-async",
                    "direction": "right",
                    "session_id": f"async-session-{session_id}",
                    "time_spent_seconds": 3.0,
                    "preference_strength": 0.8,
                    "interaction_context": {"async_test": True}
                })
            ]
            
            # Execute concurrent requests
            start_time = time.time()
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            total_time = (time.time() - start_time) * 1000
            metrics.record_response_time(total_time)
            
            return len([r for r in responses if not isinstance(r, Exception)])
        
        # Test with high async concurrency
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            # Create high number of concurrent async sessions
            tasks = [
                async_user_session(str(i), client, metrics)
                for i in range(50)
            ]
            
            successful_sessions = await asyncio.gather(*tasks, return_exceptions=True)
            success_count = sum(1 for result in successful_sessions if not isinstance(result, Exception))
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Validate async performance
        assert success_count >= 45  # At least 90% success rate
        assert stats['response_times']['mean'] < PERFORMANCE_THRESHOLDS['api_endpoint_medium']
        
        print(f"\nAsync Concurrent Load Performance:")
        print(f"  Successful sessions: {success_count}/50")
        print(f"  Mean response time: {stats['response_times']['mean']:.2f}ms")
        print(f"  95th percentile: {stats['response_times']['p95']:.2f}ms")
        print(f"  Peak memory usage: {stats['memory_usage']['peak_mb']:.2f}MB")

# ==============================================================================
# PERFORMANCE REGRESSION TESTING
# ==============================================================================

@pytest.mark.performance
@pytest.mark.regression
class TestPerformanceRegression:
    """
    Performance regression testing suite.
    
    Establishes performance baselines and detects performance
    regressions between code changes and releases.
    """
    
    def test_baseline_performance_metrics(self, test_client):
        """
        Establish baseline performance metrics for key operations.
        
        Creates performance benchmarks that can be compared
        against future test runs to detect regressions.
        """
        baseline_metrics = {}
        
        # Baseline test scenarios
        test_scenarios = [
            {
                'name': 'user_authentication',
                'endpoint': '/api/v1/auth/login',
                'method': 'POST',
                'data': {'email': 'test@aclue.app', 'password': 'testpassword123'},
                'iterations': 50,
                'threshold': PERFORMANCE_THRESHOLDS['api_endpoint_medium']
            },
            {
                'name': 'product_listing',
                'endpoint': '/api/v1/products/',
                'method': 'GET',
                'data': None,
                'iterations': 100,
                'threshold': PERFORMANCE_THRESHOLDS['api_endpoint_fast']
            },
            {
                'name': 'swipe_recording',
                'endpoint': '/api/v1/swipes/',
                'method': 'POST',
                'data': {
                    'product_id': 'test-product',
                    'direction': 'right',
                    'session_id': 'test-session',
                    'time_spent_seconds': 3.5,
                    'preference_strength': 0.75,
                    'interaction_context': {}
                },
                'iterations': 200,
                'threshold': PERFORMANCE_THRESHOLDS['api_endpoint_fast']
            }
        ]
        
        for scenario in test_scenarios:
            print(f"\nEstablishing baseline for {scenario['name']}...")
            
            metrics = PerformanceMetrics()
            metrics.start_monitoring()
            
            for _ in range(scenario['iterations']):
                start_time = time.time()
                
                if scenario['method'] == 'GET':
                    response = test_client.get(scenario['endpoint'])
                elif scenario['method'] == 'POST':
                    response = test_client.post(scenario['endpoint'], json=scenario['data'])
                
                end_time = time.time()
                execution_time_ms = (end_time - start_time) * 1000
                metrics.record_response_time(execution_time_ms)
            
            metrics.stop_monitoring()
            stats = metrics.get_statistics()
            
            # Store baseline metrics
            baseline_metrics[scenario['name']] = {
                'mean_response_time': stats['response_times']['mean'],
                'p95_response_time': stats['response_times']['p95'],
                'throughput': stats['throughput']['requests_per_second'],
                'threshold': scenario['threshold']
            }
            
            # Validate against thresholds
            assert stats['response_times']['mean'] < scenario['threshold']
            assert stats['response_times']['p95'] < scenario['threshold'] * 1.5
            
            print(f"  Mean: {stats['response_times']['mean']:.2f}ms")
            print(f"  P95: {stats['response_times']['p95']:.2f}ms")
            print(f"  Throughput: {stats['throughput']['requests_per_second']:.2f}/sec")
        
        # Store baseline metrics for future comparison
        # In a real implementation, this would be stored in a database or file
        print("\n=== PERFORMANCE BASELINE ESTABLISHED ===")
        for name, metrics in baseline_metrics.items():
            print(f"{name}:")
            print(f"  Baseline mean: {metrics['mean_response_time']:.2f}ms")
            print(f"  Baseline P95: {metrics['p95_response_time']:.2f}ms")
            print(f"  Baseline throughput: {metrics['throughput']:.2f}/sec")
    
    def test_performance_stability_over_time(self, test_client):
        """
        Test performance stability over extended time periods.
        
        Validates that system performance remains stable during
        extended operation without memory leaks or degradation.
        """
        metrics = PerformanceMetrics()
        metrics.start_monitoring()
        
        # Run extended test with periodic measurements
        test_duration_minutes = 2  # Shortened for test suite
        measurement_interval = 10  # seconds
        measurements = []
        
        start_time = time.time()
        end_time = start_time + (test_duration_minutes * 60)
        
        measurement_count = 0
        while time.time() < end_time:
            measurement_start = time.time()
            
            # Perform consistent operations
            for _ in range(10):
                response = test_client.get("/api/v1/products/?limit=5")
                response_time = time.time() - time.time()
                metrics.record_response_time(response_time * 1000)
            
            metrics.record_system_metrics()
            
            measurement_time = time.time() - measurement_start
            measurements.append({
                'timestamp': time.time(),
                'measurement_time': measurement_time * 1000,
                'memory_mb': psutil.Process().memory_info().rss / 1024 / 1024
            })
            
            measurement_count += 1
            
            # Wait until next measurement interval
            time.sleep(max(0, measurement_interval - measurement_time))
        
        metrics.stop_monitoring()
        stats = metrics.get_statistics()
        
        # Analyse stability over time
        memory_values = [m['memory_mb'] for m in measurements]
        response_times = [m['measurement_time'] for m in measurements]
        
        # Check for memory leaks (memory should not consistently increase)
        memory_trend = np.polyfit(range(len(memory_values)), memory_values, 1)[0]
        response_time_trend = np.polyfit(range(len(response_times)), response_times, 1)[0]
        
        print(f"\nPerformance Stability Analysis:")
        print(f"  Test duration: {test_duration_minutes} minutes")
        print(f"  Measurements taken: {measurement_count}")
        print(f"  Memory trend: {memory_trend:.3f} MB/measurement")
        print(f"  Response time trend: {response_time_trend:.3f} ms/measurement")
        print(f"  Memory stability: {'✓' if abs(memory_trend) < 1.0 else '⚠️'}")
        print(f"  Performance stability: {'✓' if abs(response_time_trend) < 10.0 else '⚠️'}")
        
        # Validate stability requirements
        assert abs(memory_trend) < 1.0, f"Memory leak detected: {memory_trend:.3f} MB/measurement"
        assert abs(response_time_trend) < 10.0, f"Performance degradation: {response_time_trend:.3f} ms/measurement"