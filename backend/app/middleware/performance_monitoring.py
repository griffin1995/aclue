"""
Aclue Backend Performance Monitoring Middleware

Enterprise-grade performance monitoring for FastAPI applications with comprehensive
metrics tracking, database query monitoring, and resource utilization analysis.

Key Features:
    - Request/response time tracking
    - Database query performance monitoring
    - Memory and CPU usage tracking
    - Endpoint-specific metrics
    - Slow query detection and alerting
    - Resource exhaustion prevention

Performance Targets:
    - API response time < 200ms (p95)
    - Database queries < 50ms (p95)
    - Memory usage < 512MB
    - CPU usage < 70%
    - Error rate < 0.1%

Monitoring Capabilities:
    - Real-time metrics collection
    - Prometheus metrics export
    - Performance degradation detection
    - Automatic alerting for anomalies
    - Historical trend analysis
"""

import time
import asyncio
import psutil
import resource
import tracemalloc
from typing import Dict, Any, Optional, List, Callable
from datetime import datetime, timedelta
from collections import defaultdict, deque
from contextlib import contextmanager
import json
import logging

from fastapi import FastAPI, Request, Response
from fastapi.routing import APIRoute
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Scope, Receive, Send
from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry, generate_latest
from sqlalchemy import event
from sqlalchemy.engine import Engine

# Configure logging
logger = logging.getLogger(__name__)

# Prometheus metrics registry
registry = CollectorRegistry()

# Request metrics
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status'],
    registry=registry
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint'],
    registry=registry,
    buckets=(0.01, 0.025, 0.05, 0.1, 0.2, 0.5, 1.0, 2.5, 5.0, 10.0)
)

response_size = Histogram(
    'http_response_size_bytes',
    'HTTP response size in bytes',
    ['method', 'endpoint'],
    registry=registry
)

# Database metrics
db_query_duration = Histogram(
    'db_query_duration_seconds',
    'Database query duration in seconds',
    ['operation', 'table'],
    registry=registry,
    buckets=(0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0)
)

db_query_count = Counter(
    'db_queries_total',
    'Total database queries',
    ['operation', 'table'],
    registry=registry
)

# System metrics
memory_usage_gauge = Gauge(
    'process_memory_usage_bytes',
    'Process memory usage in bytes',
    registry=registry
)

cpu_usage_gauge = Gauge(
    'process_cpu_usage_percent',
    'Process CPU usage percentage',
    registry=registry
)

active_connections = Gauge(
    'active_connections',
    'Number of active connections',
    registry=registry
)

# Error metrics
error_count = Counter(
    'errors_total',
    'Total errors',
    ['type', 'endpoint'],
    registry=registry
)


class PerformanceMetrics:
    """
    Performance metrics aggregator for real-time monitoring and analysis
    """

    def __init__(self, window_size: int = 100):
        """
        Initialize performance metrics tracker

        Args:
            window_size: Size of rolling window for metrics
        """
        self.window_size = window_size
        self.request_times: Dict[str, deque] = defaultdict(lambda: deque(maxlen=window_size))
        self.query_times: Dict[str, deque] = defaultdict(lambda: deque(maxlen=window_size))
        self.error_rates: Dict[str, deque] = defaultdict(lambda: deque(maxlen=window_size))
        self.memory_snapshots: deque = deque(maxlen=window_size)
        self.cpu_snapshots: deque = deque(maxlen=window_size)
        self.slow_queries: List[Dict[str, Any]] = []
        self.slow_endpoints: List[Dict[str, Any]] = []

    def add_request_time(self, endpoint: str, duration: float):
        """Record request execution time"""
        self.request_times[endpoint].append(duration)

        # Check for slow endpoint
        if duration > 1.0:  # > 1 second
            self.slow_endpoints.append({
                'endpoint': endpoint,
                'duration': duration,
                'timestamp': datetime.utcnow().isoformat()
            })

    def add_query_time(self, query: str, duration: float):
        """Record database query execution time"""
        self.query_times[query].append(duration)

        # Check for slow query
        if duration > 0.1:  # > 100ms
            self.slow_queries.append({
                'query': query,
                'duration': duration,
                'timestamp': datetime.utcnow().isoformat()
            })

    def add_error(self, endpoint: str, error_type: str):
        """Record error occurrence"""
        self.error_rates[endpoint].append({
            'type': error_type,
            'timestamp': datetime.utcnow().isoformat()
        })

    def get_percentile(self, endpoint: str, percentile: float = 0.95) -> Optional[float]:
        """Get percentile response time for endpoint"""
        times = self.request_times.get(endpoint, [])
        if not times:
            return None

        sorted_times = sorted(times)
        index = int(len(sorted_times) * percentile)
        return sorted_times[min(index, len(sorted_times) - 1)]

    def get_summary(self) -> Dict[str, Any]:
        """Get performance summary"""
        summary = {
            'endpoints': {},
            'database': {},
            'system': {},
            'errors': {}
        }

        # Endpoint metrics
        for endpoint, times in self.request_times.items():
            if times:
                summary['endpoints'][endpoint] = {
                    'count': len(times),
                    'mean': sum(times) / len(times),
                    'p50': self.get_percentile(endpoint, 0.50),
                    'p95': self.get_percentile(endpoint, 0.95),
                    'p99': self.get_percentile(endpoint, 0.99),
                    'min': min(times),
                    'max': max(times)
                }

        # Database metrics
        total_queries = sum(len(times) for times in self.query_times.values())
        if total_queries > 0:
            all_query_times = []
            for times in self.query_times.values():
                all_query_times.extend(times)

            summary['database'] = {
                'total_queries': total_queries,
                'mean_time': sum(all_query_times) / len(all_query_times),
                'slow_queries': len(self.slow_queries),
                'slow_query_samples': self.slow_queries[-10:]  # Last 10 slow queries
            }

        # System metrics
        if self.memory_snapshots:
            summary['system']['memory'] = {
                'current_mb': self.memory_snapshots[-1] / (1024 * 1024),
                'mean_mb': sum(self.memory_snapshots) / len(self.memory_snapshots) / (1024 * 1024),
                'max_mb': max(self.memory_snapshots) / (1024 * 1024)
            }

        if self.cpu_snapshots:
            summary['system']['cpu'] = {
                'current_percent': self.cpu_snapshots[-1],
                'mean_percent': sum(self.cpu_snapshots) / len(self.cpu_snapshots),
                'max_percent': max(self.cpu_snapshots)
            }

        # Error metrics
        for endpoint, errors in self.error_rates.items():
            if errors:
                summary['errors'][endpoint] = {
                    'count': len(errors),
                    'types': list(set(e['type'] for e in errors)),
                    'recent': errors[-5:]  # Last 5 errors
                }

        return summary


# Global performance metrics instance
performance_metrics = PerformanceMetrics()


class PerformanceMonitoringMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for comprehensive performance monitoring
    """

    def __init__(self, app: ASGIApp, enable_profiling: bool = False):
        super().__init__(app)
        self.enable_profiling = enable_profiling
        self.process = psutil.Process()

        # Start background monitoring tasks
        asyncio.create_task(self._monitor_system_resources())

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request with performance monitoring
        """
        # Start timing
        start_time = time.time()

        # Track active connections
        active_connections.inc()

        # Get endpoint path
        endpoint = f"{request.method} {request.url.path}"

        # Memory tracking for profiling mode
        if self.enable_profiling:
            tracemalloc.start()
            mem_before = tracemalloc.get_traced_memory()[0]

        try:
            # Process request
            response = await call_next(request)

            # Record successful request
            status = response.status_code
            request_count.labels(
                method=request.method,
                endpoint=request.url.path,
                status=status
            ).inc()

        except Exception as e:
            # Record error
            error_type = type(e).__name__
            error_count.labels(
                type=error_type,
                endpoint=request.url.path
            ).inc()

            performance_metrics.add_error(endpoint, error_type)

            # Log error details
            logger.error(f"Error processing {endpoint}: {str(e)}")
            raise

        finally:
            # Calculate duration
            duration = time.time() - start_time

            # Record metrics
            request_duration.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)

            performance_metrics.add_request_time(endpoint, duration)

            # Memory profiling
            if self.enable_profiling:
                mem_after = tracemalloc.get_traced_memory()[0]
                mem_used = mem_after - mem_before

                if mem_used > 10 * 1024 * 1024:  # > 10MB
                    logger.warning(
                        f"High memory usage for {endpoint}: {mem_used / 1024 / 1024:.2f}MB"
                    )

                tracemalloc.stop()

            # Track response size
            if hasattr(response, 'body'):
                response_size.labels(
                    method=request.method,
                    endpoint=request.url.path
                ).observe(len(response.body))

            # Decrement active connections
            active_connections.dec()

            # Add performance headers
            response.headers['X-Response-Time'] = f"{duration * 1000:.2f}ms"
            response.headers['X-Process-Time'] = f"{duration * 1000:.2f}ms"

            # Log slow requests
            if duration > 1.0:
                logger.warning(
                    f"Slow request: {endpoint} took {duration:.2f}s"
                )

        return response

    async def _monitor_system_resources(self):
        """
        Background task to monitor system resources
        """
        while True:
            try:
                # Memory usage
                memory_info = self.process.memory_info()
                memory_mb = memory_info.rss
                memory_usage_gauge.set(memory_mb)
                performance_metrics.memory_snapshots.append(memory_mb)

                # CPU usage
                cpu_percent = self.process.cpu_percent(interval=1)
                cpu_usage_gauge.set(cpu_percent)
                performance_metrics.cpu_snapshots.append(cpu_percent)

                # Check for resource exhaustion
                if memory_mb > 512 * 1024 * 1024:  # > 512MB
                    logger.error(f"High memory usage: {memory_mb / 1024 / 1024:.2f}MB")

                if cpu_percent > 80:
                    logger.error(f"High CPU usage: {cpu_percent}%")

            except Exception as e:
                logger.error(f"Error monitoring resources: {str(e)}")

            # Sleep for 10 seconds
            await asyncio.sleep(10)


class DatabasePerformanceMonitor:
    """
    Monitor database query performance
    """

    @staticmethod
    def setup(engine: Engine):
        """
        Set up database performance monitoring

        Args:
            engine: SQLAlchemy engine instance
        """

        @event.listens_for(engine, "before_execute")
        def before_execute(conn, clauseelement, multiparams, params, execution_options):
            conn.info.setdefault('query_start_time', []).append(time.time())

        @event.listens_for(engine, "after_execute")
        def after_execute(conn, clauseelement, multiparams, params, result, execution_options):
            start_times = conn.info.get('query_start_time', [])
            if start_times:
                duration = time.time() - start_times.pop()

                # Extract operation and table from query
                query_str = str(clauseelement)
                operation = query_str.split()[0].upper() if query_str else 'UNKNOWN'

                # Simple table extraction (can be improved)
                table = 'unknown'
                if 'FROM' in query_str.upper():
                    parts = query_str.upper().split('FROM')
                    if len(parts) > 1:
                        table = parts[1].strip().split()[0].lower()

                # Record metrics
                db_query_duration.labels(
                    operation=operation,
                    table=table
                ).observe(duration)

                db_query_count.labels(
                    operation=operation,
                    table=table
                ).inc()

                performance_metrics.add_query_time(query_str[:100], duration)

                # Log slow queries
                if duration > 0.1:  # > 100ms
                    logger.warning(
                        f"Slow query ({duration:.3f}s): {query_str[:200]}..."
                    )


class RequestTracingMiddleware:
    """
    Distributed tracing middleware for request correlation
    """

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            # Generate or extract trace ID
            headers = dict(scope.get("headers", []))
            trace_id = headers.get(b"x-trace-id", None)

            if not trace_id:
                import uuid
                trace_id = str(uuid.uuid4()).encode()

            # Store trace ID in scope
            scope["trace_id"] = trace_id.decode() if isinstance(trace_id, bytes) else trace_id

            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    # Add trace ID to response headers
                    headers = message.get("headers", [])
                    headers.append((b"x-trace-id", trace_id))
                    message["headers"] = headers
                await send(message)

            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)


def create_performance_router(app: FastAPI) -> APIRoute:
    """
    Create performance monitoring endpoints

    Args:
        app: FastAPI application instance

    Returns:
        APIRoute: Performance monitoring router
    """
    from fastapi import APIRouter

    router = APIRouter(prefix="/performance", tags=["monitoring"])

    @router.get("/metrics")
    async def get_metrics():
        """Get Prometheus metrics"""
        return Response(
            content=generate_latest(registry),
            media_type="text/plain"
        )

    @router.get("/summary")
    async def get_performance_summary():
        """Get performance summary"""
        return performance_metrics.get_summary()

    @router.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else None
        }

    @router.get("/slow-queries")
    async def get_slow_queries(limit: int = 10):
        """Get recent slow queries"""
        return {
            "slow_queries": performance_metrics.slow_queries[-limit:],
            "total_count": len(performance_metrics.slow_queries)
        }

    @router.get("/slow-endpoints")
    async def get_slow_endpoints(limit: int = 10):
        """Get recent slow endpoints"""
        return {
            "slow_endpoints": performance_metrics.slow_endpoints[-limit:],
            "total_count": len(performance_metrics.slow_endpoints)
        }

    return router


def setup_performance_monitoring(
    app: FastAPI,
    enable_profiling: bool = False,
    enable_tracing: bool = True
):
    """
    Set up comprehensive performance monitoring for FastAPI app

    Args:
        app: FastAPI application instance
        enable_profiling: Enable memory profiling
        enable_tracing: Enable distributed tracing
    """
    # Add performance monitoring middleware
    app.add_middleware(
        PerformanceMonitoringMiddleware,
        enable_profiling=enable_profiling
    )

    # Add request tracing if enabled
    if enable_tracing:
        app.add_middleware(RequestTracingMiddleware)

    # Add performance monitoring routes
    router = create_performance_router(app)
    app.include_router(router)

    # Store start time
    app.state.start_time = time.time()

    logger.info("Performance monitoring initialized")


# Export public API
__all__ = [
    'PerformanceMonitoringMiddleware',
    'DatabasePerformanceMonitor',
    'RequestTracingMiddleware',
    'setup_performance_monitoring',
    'performance_metrics'
]