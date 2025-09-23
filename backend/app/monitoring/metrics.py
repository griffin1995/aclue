"""
Performance monitoring metrics for aclue backend
"""

from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Request, Response
from typing import Callable
import time
import psutil

# Define metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

active_requests = Gauge(
    'active_requests',
    'Number of active requests'
)

database_connections = Gauge(
    'database_connections',
    'Number of database connections',
    ['state']
)

newsletter_sends = Counter(
    'newsletter_sends_total',
    'Total newsletter sends',
    ['status']
)

authentication_attempts = Counter(
    'auth_attempts_total',
    'Total authentication attempts',
    ['type', 'status']
)

# System metrics
cpu_usage_percent = Gauge(
    'system_cpu_usage_percent',
    'CPU usage percentage'
)

memory_usage_percent = Gauge(
    'system_memory_usage_percent',
    'Memory usage percentage'
)

disk_usage_percent = Gauge(
    'system_disk_usage_percent',
    'Disk usage percentage'
)


class PrometheusMiddleware:
    """Middleware to track metrics for each request"""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            await self.app(scope, receive, send)
            return

        path = scope['path']
        method = scope['method']

        # Skip metrics endpoint
        if path == '/metrics':
            await self.app(scope, receive, send)
            return

        # Start timing
        start_time = time.time()
        active_requests.inc()

        # Process request
        status = 500  # Default to error
        async def send_wrapper(message):
            nonlocal status
            if message['type'] == 'http.response.start':
                status = message['status']
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            # Record metrics
            duration = time.time() - start_time
            active_requests.dec()
            http_requests_total.labels(
                method=method,
                endpoint=path,
                status=status
            ).inc()
            http_request_duration_seconds.labels(
                method=method,
                endpoint=path
            ).observe(duration)


def update_system_metrics():
    """Update system-level metrics"""
    cpu_usage_percent.set(psutil.cpu_percent(interval=1))
    memory_usage_percent.set(psutil.virtual_memory().percent)
    disk_usage_percent.set(psutil.disk_usage('/').percent)


async def metrics_endpoint(request: Request) -> Response:
    """Endpoint to expose metrics to Prometheus"""
    update_system_metrics()
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )


def track_authentication(auth_type: str, success: bool):
    """Track authentication attempts"""
    authentication_attempts.labels(
        type=auth_type,
        status='success' if success else 'failure'
    ).inc()


def track_newsletter_send(success: bool):
    """Track newsletter send attempts"""
    newsletter_sends.labels(
        status='success' if success else 'failure'
    ).inc()


def track_database_connections(active: int, idle: int, total: int):
    """Track database connection pool stats"""
    database_connections.labels(state='active').set(active)
    database_connections.labels(state='idle').set(idle)
    database_connections.labels(state='total').set(total)