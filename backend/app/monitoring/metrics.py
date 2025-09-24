"""
Prometheus metrics instrumentation for aclue backend
Provides comprehensive performance monitoring with minimal overhead
"""

from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    Info,
    generate_latest,
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
)
from fastapi import Request, Response
from typing import Callable
import time
import psutil
import os
from functools import wraps
import asyncio
from contextlib import asynccontextmanager

# Create a custom registry for application metrics
registry = CollectorRegistry()

# Request metrics
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status"],
    registry=registry,
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
    registry=registry,
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10),
)

http_request_size_bytes = Histogram(
    "http_request_size_bytes",
    "HTTP request size in bytes",
    ["method", "endpoint"],
    registry=registry,
)

http_response_size_bytes = Histogram(
    "http_response_size_bytes",
    "HTTP response size in bytes",
    ["method", "endpoint"],
    registry=registry,
)

# Business metrics
user_registrations_total = Counter(
    "user_registrations_total",
    "Total number of user registrations",
    ["status"],
    registry=registry,
)

user_logins_total = Counter(
    "user_logins_total",
    "Total number of user login attempts",
    ["status"],
    registry=registry,
)

newsletter_subscriptions_total = Counter(
    "newsletter_subscriptions_total",
    "Total number of newsletter subscriptions",
    ["status"],
    registry=registry,
)

product_recommendations_viewed_total = Counter(
    "product_recommendations_viewed_total",
    "Total number of product recommendations viewed",
    registry=registry,
)

product_recommendations_clicked_total = Counter(
    "product_recommendations_clicked_total",
    "Total number of product recommendations clicked",
    registry=registry,
)

# Database metrics
db_query_duration_seconds = Histogram(
    "db_query_duration_seconds",
    "Database query duration in seconds",
    ["query_type", "table"],
    registry=registry,
    buckets=(0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5),
)

db_connections_active = Gauge(
    "db_connections_active", "Number of active database connections", registry=registry
)

db_connections_idle = Gauge(
    "db_connections_idle", "Number of idle database connections", registry=registry
)

# Cache metrics
cache_hits_total = Counter(
    "cache_hits_total", "Total number of cache hits", ["cache_name"], registry=registry
)

cache_misses_total = Counter(
    "cache_misses_total",
    "Total number of cache misses",
    ["cache_name"],
    registry=registry,
)

cache_evictions_total = Counter(
    "cache_evictions_total",
    "Total number of cache evictions",
    ["cache_name"],
    registry=registry,
)

# System metrics
system_cpu_usage_percent = Gauge(
    "system_cpu_usage_percent", "System CPU usage percentage", registry=registry
)

system_memory_usage_bytes = Gauge(
    "system_memory_usage_bytes", "System memory usage in bytes", registry=registry
)

system_memory_available_bytes = Gauge(
    "system_memory_available_bytes",
    "System available memory in bytes",
    registry=registry,
)

# Application info
app_info = Info("app_info", "Application information", registry=registry)

# Set application info
app_info.info(
    {
        "version": "2.1.0",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "service": "aclue-backend",
    }
)

# Authentication metrics
auth_token_generations_total = Counter(
    "auth_token_generations_total",
    "Total number of authentication tokens generated",
    ["token_type"],
    registry=registry,
)

auth_token_validations_total = Counter(
    "auth_token_validations_total",
    "Total number of token validation attempts",
    ["status"],
    registry=registry,
)

# Error metrics
unhandled_exceptions_total = Counter(
    "unhandled_exceptions_total",
    "Total number of unhandled exceptions",
    ["exception_type"],
    registry=registry,
)

# Rate limiting metrics
rate_limit_hits_total = Counter(
    "rate_limit_hits_total",
    "Total number of rate limit hits",
    ["endpoint"],
    registry=registry,
)


# Middleware for automatic request metrics
async def prometheus_middleware(request: Request, call_next: Callable) -> Response:
    """
    Middleware to automatically collect request metrics
    """
    # Start timing
    start_time = time.time()

    # Get request size
    request_size = 0
    if request.headers.get("content-length"):
        request_size = int(request.headers.get("content-length", 0))

    # Process request
    try:
        response = await call_next(request)
    except Exception as e:
        # Track unhandled exceptions
        unhandled_exceptions_total.labels(exception_type=type(e).__name__).inc()
        raise

    # Calculate duration
    duration = time.time() - start_time

    # Get endpoint path
    endpoint = request.url.path
    method = request.method
    status = response.status_code

    # Update metrics
    http_requests_total.labels(
        method=method, endpoint=endpoint, status=str(status)
    ).inc()

    http_request_duration_seconds.labels(method=method, endpoint=endpoint).observe(
        duration
    )

    if request_size > 0:
        http_request_size_bytes.labels(method=method, endpoint=endpoint).observe(
            request_size
        )

    # Get response size
    response_size = 0
    if response.headers.get("content-length"):
        response_size = int(response.headers.get("content-length", 0))
        http_response_size_bytes.labels(method=method, endpoint=endpoint).observe(
            response_size
        )

    return response


def track_db_query(query_type: str, table: str):
    """
    Decorator to track database query performance
    """

    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                db_query_duration_seconds.labels(
                    query_type=query_type, table=table
                ).observe(duration)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                db_query_duration_seconds.labels(
                    query_type=query_type, table=table
                ).observe(duration)

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


def track_cache_operation(cache_name: str):
    """
    Context manager to track cache operations
    """

    @asynccontextmanager
    async def cache_tracker(hit: bool = False, eviction: bool = False):
        if hit:
            cache_hits_total.labels(cache_name=cache_name).inc()
        else:
            cache_misses_total.labels(cache_name=cache_name).inc()

        if eviction:
            cache_evictions_total.labels(cache_name=cache_name).inc()

        yield

    return cache_tracker


async def update_system_metrics():
    """
    Update system resource metrics
    Should be called periodically (e.g., every 10 seconds)
    """
    try:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        system_cpu_usage_percent.set(cpu_percent)

        # Memory usage
        memory = psutil.virtual_memory()
        system_memory_usage_bytes.set(memory.used)
        system_memory_available_bytes.set(memory.available)

    except Exception as e:
        print(f"Error updating system metrics: {e}")


def track_business_metric(metric_name: str, labels: dict = None):
    """
    Track custom business metrics
    """
    if metric_name == "user_registration":
        user_registrations_total.labels(status=labels.get("status", "success")).inc()
    elif metric_name == "user_login":
        user_logins_total.labels(status=labels.get("status", "success")).inc()
    elif metric_name == "newsletter_subscription":
        newsletter_subscriptions_total.labels(
            status=labels.get("status", "success")
        ).inc()
    elif metric_name == "product_recommendation_viewed":
        product_recommendations_viewed_total.inc()
    elif metric_name == "product_recommendation_clicked":
        product_recommendations_clicked_total.inc()
    elif metric_name == "auth_token_generation":
        auth_token_generations_total.labels(
            token_type=labels.get("token_type", "access")
        ).inc()
    elif metric_name == "auth_token_validation":
        auth_token_validations_total.labels(status=labels.get("status", "valid")).inc()
    elif metric_name == "rate_limit_hit":
        rate_limit_hits_total.labels(endpoint=labels.get("endpoint", "unknown")).inc()


def get_metrics():
    """
    Generate Prometheus metrics in text format
    """
    # Update system metrics before generating
    asyncio.create_task(update_system_metrics())

    # Generate metrics
    return generate_latest(registry)


async def metrics_endpoint():
    """
    FastAPI endpoint for Prometheus metrics
    """
    metrics_data = get_metrics()
    return Response(content=metrics_data, media_type=CONTENT_TYPE_LATEST)


# Export commonly used decorators and functions
__all__ = [
    "prometheus_middleware",
    "track_db_query",
    "track_cache_operation",
    "track_business_metric",
    "metrics_endpoint",
    "update_system_metrics",
    "db_connections_active",
    "db_connections_idle",
]
