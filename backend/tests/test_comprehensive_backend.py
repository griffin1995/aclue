"""
Comprehensive backend testing suite for Aclue platform
Using pytest with all extensions
"""

import pytest
import hypothesis
from hypothesis import given, strategies as st, settings, Verbosity
from hypothesis.stateful import RuleBasedStateMachine, rule, initialize, invariant
import asyncio
import httpx
from datetime import datetime, timedelta
import json
import time
from typing import Dict, List, Optional
import jwt
from faker import Faker

# Initialize Faker for test data generation
fake = Faker('en_GB')  # British English locale

# Test configuration
API_BASE_URL = "https://aclue-backend-production.up.railway.app"
TEST_TIMEOUT = 30


class TestAuthenticationFlow:
    """Comprehensive authentication testing"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test environment"""
        self.client = httpx.AsyncClient(base_url=API_BASE_URL, timeout=TEST_TIMEOUT)
        self.test_email = f"test_{fake.uuid4()}@example.com"
        self.test_password = fake.password(length=12, special_chars=True)

    async def teardown(self):
        """Cleanup after tests"""
        await self.client.aclose()

    @pytest.mark.asyncio
    @pytest.mark.benchmark
    async def test_registration_performance(self, benchmark):
        """Benchmark registration endpoint performance"""
        async def register():
            response = await self.client.post("/api/v1/auth/register", json={
                "email": f"perf_{fake.uuid4()}@example.com",
                "password": fake.password(),
                "full_name": fake.name()
            })
            return response

        result = await benchmark.pedantic(register, rounds=10, iterations=5)
        assert result.status_code in [200, 201]

    @pytest.mark.asyncio
    @given(
        email=st.emails(),
        password=st.text(min_size=8, max_size=128),
        full_name=st.text(min_size=1, max_size=100)
    )
    @settings(max_examples=50, verbosity=Verbosity.verbose)
    async def test_registration_property_based(self, email, password, full_name):
        """Property-based testing for registration"""
        response = await self.client.post("/api/v1/auth/register", json={
            "email": email,
            "password": password,
            "full_name": full_name
        })

        # Should either succeed or fail with appropriate error
        assert response.status_code in [200, 201, 400, 422]

        if response.status_code in [200, 201]:
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data

    @pytest.mark.asyncio
    @pytest.mark.parametrize("invalid_email", [
        "",
        "not-an-email",
        "@example.com",
        "user@",
        "user@.com",
        "user@domain",
        None
    ])
    async def test_registration_invalid_emails(self, invalid_email):
        """Test registration with invalid email formats"""
        response = await self.client.post("/api/v1/auth/register", json={
            "email": invalid_email,
            "password": "ValidPassword123!",
            "full_name": "Test User"
        })
        assert response.status_code in [400, 422]

    @pytest.mark.asyncio
    @pytest.mark.timeout(60)
    async def test_concurrent_registrations(self):
        """Test system behavior under concurrent registrations"""
        async def register_user(index):
            response = await self.client.post("/api/v1/auth/register", json={
                "email": f"concurrent_{index}_{fake.uuid4()}@example.com",
                "password": fake.password(),
                "full_name": f"User {index}"
            })
            return response

        # Create 50 concurrent registration attempts
        tasks = [register_user(i) for i in range(50)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        successful = sum(1 for r in results if not isinstance(r, Exception) and r.status_code in [200, 201])
        assert successful > 40  # At least 80% should succeed

    @pytest.mark.asyncio
    @pytest.mark.flaky(reruns=3)
    async def test_token_refresh_flow(self):
        """Test complete token refresh flow"""
        # Register user
        register_response = await self.client.post("/api/v1/auth/register", json={
            "email": f"refresh_{fake.uuid4()}@example.com",
            "password": fake.password(),
            "full_name": fake.name()
        })
        assert register_response.status_code in [200, 201]

        tokens = register_response.json()
        refresh_token = tokens["refresh_token"]

        # Refresh token
        refresh_response = await self.client.post("/api/v1/auth/refresh",
            headers={"Authorization": f"Bearer {refresh_token}"}
        )
        assert refresh_response.status_code == 200

        new_tokens = refresh_response.json()
        assert "access_token" in new_tokens
        assert new_tokens["access_token"] != tokens["access_token"]


class TestProductEndpoints:
    """Comprehensive product API testing"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test environment"""
        self.client = httpx.AsyncClient(base_url=API_BASE_URL, timeout=TEST_TIMEOUT)

    async def teardown(self):
        """Cleanup after tests"""
        await self.client.aclose()

    @pytest.mark.asyncio
    @pytest.mark.benchmark
    async def test_products_list_performance(self, benchmark):
        """Benchmark products listing performance"""
        async def get_products():
            response = await self.client.get("/api/v1/products/")
            return response

        result = await benchmark.pedantic(get_products, rounds=20, iterations=10)
        assert result.status_code == 200

    @pytest.mark.asyncio
    @given(
        page=st.integers(min_value=1, max_value=100),
        limit=st.integers(min_value=1, max_value=100)
    )
    async def test_products_pagination(self, page, limit):
        """Property-based testing for pagination"""
        response = await self.client.get("/api/v1/products/", params={
            "page": page,
            "limit": limit
        })

        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) <= limit

    @pytest.mark.asyncio
    @pytest.mark.parametrize("category", [
        "electronics",
        "books",
        "clothing",
        "home",
        "sports",
        "invalid_category"
    ])
    async def test_products_by_category(self, category):
        """Test product filtering by category"""
        response = await self.client.get("/api/v1/products/", params={
            "category": category
        })

        assert response.status_code in [200, 404]
        if response.status_code == 200:
            products = response.json()
            assert isinstance(products, list)


class TestRecommendationEngine:
    """Test AI-powered recommendation system"""

    @pytest.fixture(autouse=True)
    async def setup(self):
        """Setup with authenticated user"""
        self.client = httpx.AsyncClient(base_url=API_BASE_URL, timeout=TEST_TIMEOUT)

        # Create and authenticate test user
        register_response = await self.client.post("/api/v1/auth/register", json={
            "email": f"rec_{fake.uuid4()}@example.com",
            "password": fake.password(),
            "full_name": fake.name()
        })

        if register_response.status_code in [200, 201]:
            tokens = register_response.json()
            self.auth_headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        else:
            self.auth_headers = {}

    async def teardown(self):
        """Cleanup after tests"""
        await self.client.aclose()

    @pytest.mark.asyncio
    async def test_personalized_recommendations(self):
        """Test personalized recommendation generation"""
        response = await self.client.get("/api/v1/recommendations/",
            headers=self.auth_headers
        )

        assert response.status_code in [200, 401]
        if response.status_code == 200:
            recommendations = response.json()
            assert isinstance(recommendations, (list, dict))

    @pytest.mark.asyncio
    @pytest.mark.benchmark
    async def test_recommendation_performance(self, benchmark):
        """Benchmark recommendation engine performance"""
        async def get_recommendations():
            return await self.client.get("/api/v1/recommendations/",
                headers=self.auth_headers
            )

        result = await benchmark.pedantic(get_recommendations, rounds=10, iterations=5)
        assert result.status_code in [200, 401]


class APIStateMachine(RuleBasedStateMachine):
    """State-based testing for API consistency"""

    def __init__(self):
        super().__init__()
        self.client = httpx.Client(base_url=API_BASE_URL, timeout=TEST_TIMEOUT)
        self.users = {}
        self.tokens = {}

    @initialize()
    def setup(self):
        """Initialize state machine"""
        self.authenticated = False
        self.current_user = None

    @rule(
        email=st.emails(),
        password=st.text(min_size=8, max_size=50)
    )
    def register_user(self, email, password):
        """Rule: Register new user"""
        response = self.client.post("/api/v1/auth/register", json={
            "email": email,
            "password": password,
            "full_name": fake.name()
        })

        if response.status_code in [200, 201]:
            self.users[email] = password
            self.tokens[email] = response.json()["access_token"]

    @rule()
    def login_existing_user(self):
        """Rule: Login with existing user"""
        if self.users:
            email = fake.random_element(list(self.users.keys()))
            password = self.users[email]

            response = self.client.post("/api/v1/auth/login", json={
                "email": email,
                "password": password
            })

            assert response.status_code == 200
            self.current_user = email
            self.authenticated = True

    @rule()
    def access_protected_route(self):
        """Rule: Access protected route"""
        if self.authenticated and self.current_user and self.current_user in self.tokens:
            response = self.client.get("/api/v1/auth/me",
                headers={"Authorization": f"Bearer {self.tokens[self.current_user]}"}
            )
            assert response.status_code in [200, 401]

    @invariant()
    def users_consistency(self):
        """Invariant: User data remains consistent"""
        assert len(self.users) == len(self.tokens)

    def teardown(self):
        """Cleanup state machine"""
        self.client.close()


# Mutation testing configurations
class TestMutations:
    """Mutation testing for critical functions"""

    @pytest.mark.mutate
    def test_jwt_token_validation(self):
        """Test JWT token validation logic"""
        secret = "test_secret"
        payload = {"user_id": "123", "exp": datetime.utcnow() + timedelta(hours=1)}

        token = jwt.encode(payload, secret, algorithm="HS256")
        decoded = jwt.decode(token, secret, algorithms=["HS256"])

        assert decoded["user_id"] == "123"

    @pytest.mark.mutate
    def test_password_hashing(self):
        """Test password hashing implementation"""
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = "SecurePassword123!"

        hashed = pwd_context.hash(password)
        assert pwd_context.verify(password, hashed)
        assert not pwd_context.verify("WrongPassword", hashed)


# BDD-style tests
@pytest.mark.bdd
class TestUserStories:
    """Behavior-driven development tests"""

    def test_user_registration_story(self):
        """
        Given: A new user wants to register
        When: They provide valid credentials
        Then: They should receive authentication tokens
        """
        client = httpx.Client(base_url=API_BASE_URL)

        # Given
        user_data = {
            "email": f"story_{fake.uuid4()}@example.com",
            "password": fake.password(),
            "full_name": fake.name()
        }

        # When
        response = client.post("/api/v1/auth/register", json=user_data)

        # Then
        assert response.status_code in [200, 201]
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

        client.close()


if __name__ == "__main__":
    # Run comprehensive test suite with detailed reporting
    pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "--cov=app",
        "--cov-report=html:../tests-22-sept/pytest-coverage",
        "--cov-report=json:../tests-22-sept/pytest-coverage.json",
        "--html=../tests-22-sept/pytest-report.html",
        "--json-report",
        "--json-report-file=../tests-22-sept/pytest-results.json",
        "--benchmark-json=../tests-22-sept/pytest-benchmark.json",
        "-n", "auto",  # Run tests in parallel
        "--maxfail=5",  # Stop after 5 failures
        "--timeout=300",  # Global timeout of 5 minutes
    ])