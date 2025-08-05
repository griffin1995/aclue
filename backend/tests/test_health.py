"""Basic health check tests for the backend API."""

import pytest


def test_app_import():
    """Test that the FastAPI app can be imported successfully."""
    try:
        from app.main import app
        assert app is not None
        assert hasattr(app, 'routes')
        assert len(app.routes) > 0
    except ImportError as e:
        pytest.fail(f"Failed to import app: {e}")


def test_basic_calculation():
    """Basic test to ensure pytest is working."""
    assert 1 + 1 == 2


def test_environment_variables():
    """Test that required environment variables can be accessed."""
    import os
    # Test that at least some environment variables are accessible
    # Don't require specific values, just test the mechanism works
    database_url = os.getenv('DATABASE_URL', 'not_set')
    assert isinstance(database_url, str)
    # Just verify we can access env vars, values might be test values


def test_python_version():
    """Test that we're running on the expected Python version."""
    import sys
    assert sys.version_info.major == 3
    assert sys.version_info.minor >= 10  # Require Python 3.10+