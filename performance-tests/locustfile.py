"""
Aclue Locust Performance Testing Configuration

Python-based load testing using Locust for comprehensive performance validation.
Provides real-time web UI for monitoring and dynamic load adjustment.

Performance Targets:
    - API response time < 200ms (p95)
    - Error rate < 0.1%
    - Throughput > 1000 req/s
    - Concurrent users: 100-500

Usage:
    locust -f locustfile.py --host=https://aclue-backend-production.up.railway.app
    locust -f locustfile.py --host=http://localhost:8000 --users=100 --spawn-rate=10
    locust -f locustfile.py --headless --users=500 --spawn-rate=50 --run-time=10m

Web UI:
    http://localhost:8089
"""

import json
import random
import time
from typing import Dict, Any
from locust import HttpUser, task, between, events, TaskSet
from locust.contrib.fasthttp import FastHttpUser
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test data
TEST_USERS = [
    {"email": "john.doe@example.com", "password": "password123"},
    {"email": "test1@aclue.app", "password": "TestPass123!"},
    {"email": "test2@aclue.app", "password": "TestPass123!"},
]

PRODUCT_IDS = ["prod_1", "prod_2", "prod_3", "prod_4", "prod_5"]
CATEGORIES = ["electronics", "books", "clothing", "home", "sports"]
SEARCH_TERMS = ["gift", "birthday", "christmas", "anniversary", "electronics", "gadget"]

# Performance metrics tracking
performance_metrics = {
    "api_response_times": [],
    "cache_hits": 0,
    "cache_misses": 0,
    "slow_requests": [],
    "errors": []
}


class UserBehavior(TaskSet):
    """
    User behavior patterns for realistic load testing
    """

    token: str = None
    user_id: str = None

    def on_start(self):
        """
        Called when a simulated user starts executing this TaskSet
        """
        self.login()

    def login(self):
        """
        Authenticate user and store token
        """
        user = random.choice(TEST_USERS)

        with self.client.post(
            "/api/v1/auth/login",
            json=user,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.user_id = data.get("user", {}).get("id")
                response.success()
                logger.info(f"User logged in successfully: {user['email']}")
            else:
                response.failure(f"Login failed: {response.status_code}")

    @task(10)
    def browse_products(self):
        """
        Browse product listings - High frequency task
        """
        if not self.token:
            self.login()
            return

        limit = random.choice([10, 20, 50])
        offset = random.randint(0, 100)

        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            f"/api/v1/products?limit={limit}&offset={offset}",
            headers=headers,
            catch_response=True,
            name="/api/v1/products"
        ) as response:
            if response.status_code == 200:
                products = response.json()

                # Track cache performance
                cache_status = response.headers.get("X-Cache-Status", "MISS")
                if cache_status == "HIT":
                    performance_metrics["cache_hits"] += 1
                else:
                    performance_metrics["cache_misses"] += 1

                # Check response time
                if response.elapsed.total_seconds() > 0.5:
                    performance_metrics["slow_requests"].append({
                        "endpoint": "/api/v1/products",
                        "duration": response.elapsed.total_seconds(),
                        "timestamp": time.time()
                    })

                response.success()
            else:
                response.failure(f"Failed to fetch products: {response.status_code}")

    @task(8)
    def view_product_detail(self):
        """
        View individual product details - High frequency task
        """
        if not self.token:
            self.login()
            return

        product_id = random.choice(PRODUCT_IDS)
        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            f"/api/v1/products/{product_id}",
            headers=headers,
            catch_response=True,
            name="/api/v1/products/[id]"
        ) as response:
            if response.status_code in [200, 404]:
                response.success()
            else:
                response.failure(f"Failed to fetch product: {response.status_code}")

    @task(6)
    def get_recommendations(self):
        """
        Get personalized recommendations - Medium frequency task
        """
        if not self.token:
            self.login()
            return

        category = random.choice(CATEGORIES)
        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            f"/api/v1/recommendations?category={category}&limit=10",
            headers=headers,
            catch_response=True,
            name="/api/v1/recommendations"
        ) as response:
            if response.status_code == 200:
                recommendations = response.json()

                # Validate recommendation quality
                if not recommendations or len(recommendations) == 0:
                    response.failure("No recommendations returned")
                else:
                    response.success()

                # Track response time for ML endpoints
                performance_metrics["api_response_times"].append({
                    "endpoint": "recommendations",
                    "duration": response.elapsed.total_seconds()
                })
            else:
                response.failure(f"Failed to get recommendations: {response.status_code}")

    @task(5)
    def search_products(self):
        """
        Search for products - Medium frequency task
        """
        if not self.token:
            self.login()
            return

        search_term = random.choice(SEARCH_TERMS)
        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            f"/api/v1/search?q={search_term}&limit=20",
            headers=headers,
            catch_response=True,
            name="/api/v1/search"
        ) as response:
            if response.status_code == 200:
                results = response.json()
                response.success()
            else:
                response.failure(f"Search failed: {response.status_code}")

    @task(4)
    def record_swipe(self):
        """
        Record user swipe interaction - Medium frequency task
        """
        if not self.token:
            self.login()
            return

        swipe_data = {
            "product_id": random.choice(PRODUCT_IDS),
            "direction": random.choice(["left", "right"]),
            "interaction_time": random.randint(500, 5000),
            "timestamp": time.time()
        }

        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.post(
            "/api/v1/swipes",
            json=swipe_data,
            headers=headers,
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            else:
                response.failure(f"Failed to record swipe: {response.status_code}")

    @task(3)
    def view_wishlist(self):
        """
        View user wishlist - Lower frequency task
        """
        if not self.token:
            self.login()
            return

        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            "/api/v1/wishlist",
            headers=headers,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch wishlist: {response.status_code}")

    @task(2)
    def add_to_wishlist(self):
        """
        Add item to wishlist - Lower frequency task
        """
        if not self.token:
            self.login()
            return

        product_id = random.choice(PRODUCT_IDS)
        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.post(
            f"/api/v1/wishlist/{product_id}",
            headers=headers,
            catch_response=True,
            name="/api/v1/wishlist/[id]"
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            else:
                response.failure(f"Failed to add to wishlist: {response.status_code}")

    @task(1)
    def view_profile(self):
        """
        View user profile - Lowest frequency task
        """
        if not self.token:
            self.login()
            return

        headers = {"Authorization": f"Bearer {self.token}"}

        with self.client.get(
            "/api/v1/auth/me",
            headers=headers,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch profile: {response.status_code}")


class AclueUser(FastHttpUser):
    """
    Simulated Aclue user with realistic behavior patterns
    """
    tasks = [UserBehavior]
    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks

    # Connection pooling configuration
    connection_timeout = 10.0
    connection_pool_size = 100
    network_timeout = 60.0


class AdminUser(HttpUser):
    """
    Simulated admin user for testing admin endpoints
    """
    wait_time = between(5, 10)

    def on_start(self):
        """
        Admin authentication
        """
        # Admin login would go here
        pass

    @task
    def view_metrics(self):
        """
        View performance metrics
        """
        with self.client.get(
            "/performance/summary",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch metrics: {response.status_code}")

    @task
    def view_health(self):
        """
        Check system health
        """
        with self.client.get(
            "/performance/health",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Health check failed: {response.status_code}")


# Event hooks for custom reporting
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """
    Called when test starts
    """
    logger.info(f"Load test starting against {environment.host}")
    logger.info(f"Target users: {environment.parsed_options.num_users}")
    logger.info(f"Spawn rate: {environment.parsed_options.spawn_rate}")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """
    Called when test stops
    """
    logger.info("Load test completed")

    # Log performance summary
    if performance_metrics["api_response_times"]:
        avg_response_time = sum(
            m["duration"] for m in performance_metrics["api_response_times"]
        ) / len(performance_metrics["api_response_times"])
        logger.info(f"Average API response time: {avg_response_time:.3f}s")

    if performance_metrics["cache_hits"] + performance_metrics["cache_misses"] > 0:
        cache_hit_rate = performance_metrics["cache_hits"] / (
            performance_metrics["cache_hits"] + performance_metrics["cache_misses"]
        )
        logger.info(f"Cache hit rate: {cache_hit_rate:.2%}")

    if performance_metrics["slow_requests"]:
        logger.warning(f"Slow requests detected: {len(performance_metrics['slow_requests'])}")
        for req in performance_metrics["slow_requests"][-5:]:
            logger.warning(f"  - {req['endpoint']}: {req['duration']:.3f}s")


@events.request.add_listener
def on_request(request_type, name, response_time, response_length, response,
               context, exception, **kwargs):
    """
    Called for each request
    """
    if exception:
        performance_metrics["errors"].append({
            "endpoint": name,
            "exception": str(exception),
            "timestamp": time.time()
        })

    # Track response times for analysis
    if response_time > 1000:  # Log requests taking more than 1 second
        logger.warning(f"Slow request: {name} took {response_time}ms")


# Custom load shape for complex scenarios
class StagesShape(LoadTestShape):
    """
    Custom load shape with multiple stages
    """

    stages = [
        {"duration": 60, "users": 10, "spawn_rate": 1},     # Warm-up
        {"duration": 180, "users": 50, "spawn_rate": 2},    # Ramp-up
        {"duration": 300, "users": 100, "spawn_rate": 5},   # Steady state
        {"duration": 180, "users": 200, "spawn_rate": 10},  # Peak load
        {"duration": 120, "users": 50, "spawn_rate": 5},    # Cool down
    ]

    def tick(self):
        run_time = self.get_run_time()

        for stage in self.stages:
            if run_time < stage["duration"]:
                tick_data = (stage["users"], stage["spawn_rate"])
                return tick_data

        return None


# Import for custom load shapes
from locust import LoadTestShape