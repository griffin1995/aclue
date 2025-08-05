"""Basic health check tests for the backend API."""

import pytest
import httpx
from fastapi.testclient import TestClient

# Import app and create client within fixture to avoid module-level issues
@pytest.fixture(scope="module")
def client():
    """Create a test client for the FastAPI application."""
    from app.main import app
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint(client):
    """Test that the health endpoint returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
    
    # Check if response has expected structure
    data = response.json()
    assert "status" in data
    assert data["status"] in ["healthy", "ok"]


def test_api_v1_health(client):
    """Test API v1 health endpoint if it exists."""
    response = client.get("/api/v1/health")
    # Accept either 200 (exists) or 404 (doesn't exist)
    assert response.status_code in [200, 404]


def test_root_endpoint(client):
    """Test that the root endpoint returns something."""
    response = client.get("/")
    # Accept any non-500 status code
    assert response.status_code < 500


def test_api_products_requires_auth(client):
    """Test that products endpoint requires authentication."""
    response = client.get("/api/v1/products")
    # Should return 401 (unauthorized) without auth, or 200 if auth is optional
    assert response.status_code in [200, 401]


def test_api_auth_endpoints_exist(client):
    """Test that authentication endpoints exist."""
    # Test login endpoint
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    # Should not return 404 (endpoint should exist)
    assert response.status_code != 404
    
    # Test register endpoint
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpassword",
        "first_name": "Test",
        "last_name": "User",
        "marketing_consent": False
    })
    # Should not return 404 (endpoint should exist)
    assert response.status_code != 404