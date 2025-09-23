"""
Comprehensive Locust load testing suite for aclue backend
"""

from locust import HttpUser, task, between, events
from locust.env import Environment
from locust.stats import stats_printer, stats_history
import json
import random
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class aclueUser(HttpUser):
    """Simulates a typical aclue platform user"""

    wait_time = between(1, 5)
    host = "https://aclue-backend-production.up.railway.app"

    def on_start(self):
        """Initialize user session with authentication"""
        self.email = "john.doe@example.com"
        self.password = "password123"
        self.token = None
        self.user_id = None

        # Attempt login
        self.login()

    def login(self):
        """Authenticate user and store token"""
        response = self.client.post("/api/v1/auth/login",
            json={"email": self.email, "password": self.password},
            catch_response=True
        )

        if response.status_code == 200:
            data = response.json()
            self.token = data.get("access_token")
            self.user_id = data.get("user_id")
            self.client.headers.update({"Authorization": f"Bearer {self.token}"})
            response.success()
            logger.info(f"User logged in successfully: {self.email}")
        else:
            response.failure(f"Login failed: {response.status_code}")

    @task(10)
    def view_homepage(self):
        """Load homepage"""
        with self.client.get("/", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Homepage failed: {response.status_code}")

    @task(8)
    def browse_products(self):
        """Browse product catalog"""
        with self.client.get("/api/v1/products/", catch_response=True) as response:
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    response.success()
                else:
                    response.failure("Invalid products response format")
            else:
                response.failure(f"Products fetch failed: {response.status_code}")

    @task(6)
    def get_recommendations(self):
        """Get personalized recommendations"""
        if not self.token:
            self.login()

        with self.client.get("/api/v1/recommendations/", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 401:
                # Token expired, re-login
                self.login()
                response.failure("Token expired")
            else:
                response.failure(f"Recommendations failed: {response.status_code}")

    @task(4)
    def view_product_details(self):
        """View individual product details"""
        product_id = random.randint(1, 100)
        with self.client.get(f"/api/v1/products/{product_id}", catch_response=True) as response:
            if response.status_code in [200, 404]:
                response.success()
            else:
                response.failure(f"Product details failed: {response.status_code}")

    @task(3)
    def check_profile(self):
        """Check user profile"""
        if not self.token:
            self.login()

        with self.client.get("/api/v1/auth/me", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 401:
                self.login()
                response.failure("Authentication required")
            else:
                response.failure(f"Profile fetch failed: {response.status_code}")

    @task(2)
    def subscribe_newsletter(self):
        """Subscribe to newsletter"""
        email = f"test_{random.randint(1000, 9999)}@example.com"

        with self.client.post("/api/v1/newsletter/subscribe",
            json={"email": email},
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            else:
                response.failure(f"Newsletter subscription failed: {response.status_code}")

    @task(1)
    def health_check(self):
        """Perform health check"""
        with self.client.get("/health", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Health check failed: {response.status_code}")

    def on_stop(self):
        """Cleanup on user stop"""
        logger.info(f"User stopping: {self.email}")


class PowerUser(aclueUser):
    """Simulates a power user with more intensive usage patterns"""

    wait_time = between(0.5, 2)

    @task(15)
    def intensive_browsing(self):
        """Rapid product browsing"""
        for _ in range(5):
            self.browse_products()
            time.sleep(0.2)

    @task(10)
    def bulk_recommendations(self):
        """Get multiple recommendation sets"""
        for _ in range(3):
            self.get_recommendations()
            time.sleep(0.5)


class AdminUser(HttpUser):
    """Simulates admin user activities"""

    wait_time = between(2, 5)
    host = "https://aclue-backend-production.up.railway.app"

    def on_start(self):
        """Admin authentication"""
        # Admin credentials would be different in production
        self.email = "admin@aclue.app"
        self.password = "admin_secure_password"
        self.token = None
        # Note: Admin login might use a different endpoint

    @task(5)
    def view_analytics(self):
        """Check analytics dashboard"""
        self.client.get("/api/v1/admin/analytics")

    @task(3)
    def manage_users(self):
        """User management operations"""
        self.client.get("/api/v1/admin/users")

    @task(2)
    def system_monitoring(self):
        """System monitoring checks"""
        endpoints = ["/health", "/metrics", "/api/v1/admin/system"]
        for endpoint in endpoints:
            self.client.get(endpoint)
            time.sleep(0.5)


class MobileUser(aclueUser):
    """Simulates mobile app user behavior"""

    wait_time = between(2, 8)

    def on_start(self):
        """Mobile user initialization"""
        super().on_start()
        # Mobile-specific headers
        self.client.headers.update({
            "User-Agent": "aclue-Mobile/1.0.0 (iOS)",
            "X-Device-Type": "mobile",
        })

    @task(12)
    def mobile_homepage(self):
        """Optimized mobile homepage"""
        self.client.get("/api/v1/mobile/home")

    @task(8)
    def swipe_products(self):
        """Swipe through products (mobile gesture)"""
        for _ in range(3):
            product_id = random.randint(1, 50)
            self.client.get(f"/api/v1/products/{product_id}")
            time.sleep(1)


# Custom event handlers for detailed reporting
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Initialize test reporting"""
    logger.info("="*50)
    logger.info("ACLUE PLATFORM LOAD TEST STARTING")
    logger.info(f"Target Host: {environment.host}")
    logger.info(f"Total Users: {environment.parsed_options.users}")
    logger.info(f"Spawn Rate: {environment.parsed_options.spawn_rate}")
    logger.info("="*50)


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Generate test summary report"""
    logger.info("="*50)
    logger.info("ACLUE PLATFORM LOAD TEST COMPLETED")
    logger.info("="*50)

    # Calculate and log statistics
    stats = environment.stats

    logger.info(f"Total Requests: {stats.total.num_requests}")
    logger.info(f"Total Failures: {stats.total.num_failures}")
    logger.info(f"Average Response Time: {stats.total.avg_response_time:.2f}ms")
    logger.info(f"Min Response Time: {stats.total.min_response_time:.2f}ms")
    logger.info(f"Max Response Time: {stats.total.max_response_time:.2f}ms")

    if stats.total.num_requests > 0:
        failure_rate = (stats.total.num_failures / stats.total.num_requests) * 100
        logger.info(f"Failure Rate: {failure_rate:.2f}%")

    # Save detailed report
    with open("/home/jack/Documents/aclue-preprod/tests-22-sept/locust-report.json", "w") as f:
        report_data = {
            "total_requests": stats.total.num_requests,
            "total_failures": stats.total.num_failures,
            "avg_response_time": stats.total.avg_response_time,
            "min_response_time": stats.total.min_response_time,
            "max_response_time": stats.total.max_response_time,
            "requests_per_second": stats.total.current_rps,
            "timestamp": time.time()
        }
        json.dump(report_data, f, indent=2)


@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    """Log individual request metrics"""
    if exception:
        logger.warning(f"Request failed: {request_type} {name} - {exception}")
    elif response_time > 1000:
        logger.warning(f"Slow request: {request_type} {name} - {response_time}ms")