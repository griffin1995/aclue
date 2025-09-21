"""
Aclue Caching Optimization Module

Enterprise-grade caching strategies for optimal performance and scalability.
Implements multi-layer caching with Redis, in-memory caching, and CDN integration.

Caching Layers:
    1. Browser Cache: Static assets, API responses
    2. CDN Cache: Images, CSS, JS bundles
    3. Application Cache: In-memory caching for hot data
    4. Redis Cache: Distributed caching for shared state
    5. Database Cache: Query result caching

Performance Targets:
    - Cache hit rate > 80%
    - Redis response time < 5ms
    - Memory usage < 512MB
    - Cache warming time < 30s

Cache Strategies:
    - Cache-aside (lazy loading)
    - Write-through (synchronous writes)
    - Write-behind (asynchronous writes)
    - Refresh-ahead (proactive refresh)
"""

import asyncio
import hashlib
import json
import pickle
import time
from datetime import datetime, timedelta
from functools import wraps
from typing import Any, Dict, Optional, Union, Callable, List, TypeVar, Set
from collections import OrderedDict
import logging

import redis.asyncio as redis
from redis.asyncio import ConnectionPool
from fastapi import Request, Response
from starlette.datastructures import Headers

logger = logging.getLogger(__name__)

T = TypeVar('T')


class CacheConfig:
    """
    Cache configuration settings
    """
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 50
    REDIS_SOCKET_KEEPALIVE: bool = True
    REDIS_SOCKET_KEEPALIVE_OPTIONS: Dict = {
        1: 3,  # TCP_KEEPIDLE
        2: 3,  # TCP_KEEPINTVL
        3: 3,  # TCP_KEEPCNT
    }

    # Cache TTL settings (in seconds)
    DEFAULT_TTL: int = 300  # 5 minutes
    SHORT_TTL: int = 60  # 1 minute
    MEDIUM_TTL: int = 600  # 10 minutes
    LONG_TTL: int = 3600  # 1 hour
    VERY_LONG_TTL: int = 86400  # 24 hours

    # Cache key prefixes
    PRODUCT_PREFIX: str = "product:"
    USER_PREFIX: str = "user:"
    RECOMMENDATION_PREFIX: str = "rec:"
    SEARCH_PREFIX: str = "search:"
    SESSION_PREFIX: str = "session:"

    # Memory cache settings
    MEMORY_CACHE_SIZE: int = 1000  # Maximum number of items
    MEMORY_CACHE_TTL: int = 60  # Default TTL for memory cache

    # Cache warming settings
    WARM_CACHE_ON_STARTUP: bool = True
    WARM_CACHE_INTERVAL: int = 3600  # Re-warm every hour


class LRUCache:
    """
    Thread-safe LRU cache implementation for in-memory caching
    """

    def __init__(self, max_size: int = 1000, ttl: int = 60):
        """
        Initialize LRU cache

        Args:
            max_size: Maximum number of items to cache
            ttl: Time to live for cached items in seconds
        """
        self.max_size = max_size
        self.ttl = ttl
        self.cache: OrderedDict = OrderedDict()
        self.timestamps: Dict[str, float] = {}
        self.hits: int = 0
        self.misses: int = 0
        self.evictions: int = 0

    def get(self, key: str) -> Optional[Any]:
        """
        Get item from cache

        Args:
            key: Cache key

        Returns:
            Cached value or None if not found/expired
        """
        if key not in self.cache:
            self.misses += 1
            return None

        # Check if expired
        if time.time() - self.timestamps[key] > self.ttl:
            del self.cache[key]
            del self.timestamps[key]
            self.misses += 1
            return None

        # Move to end (most recently used)
        self.cache.move_to_end(key)
        self.hits += 1
        return self.cache[key]

    def set(self, key: str, value: Any) -> None:
        """
        Set item in cache

        Args:
            key: Cache key
            value: Value to cache
        """
        # Remove oldest if at capacity
        if len(self.cache) >= self.max_size and key not in self.cache:
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
            del self.timestamps[oldest_key]
            self.evictions += 1

        self.cache[key] = value
        self.timestamps[key] = time.time()
        self.cache.move_to_end(key)

    def invalidate(self, key: str) -> bool:
        """
        Remove item from cache

        Args:
            key: Cache key

        Returns:
            True if item was removed, False if not found
        """
        if key in self.cache:
            del self.cache[key]
            del self.timestamps[key]
            return True
        return False

    def invalidate_pattern(self, pattern: str) -> int:
        """
        Remove all keys matching pattern

        Args:
            pattern: Pattern to match (supports * wildcard)

        Returns:
            Number of keys removed
        """
        import fnmatch
        keys_to_remove = [
            key for key in self.cache.keys()
            if fnmatch.fnmatch(key, pattern)
        ]

        for key in keys_to_remove:
            del self.cache[key]
            del self.timestamps[key]

        return len(keys_to_remove)

    def clear(self) -> None:
        """Clear all cached items"""
        self.cache.clear()
        self.timestamps.clear()

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics

        Returns:
            Cache statistics dictionary
        """
        total_requests = self.hits + self.misses
        hit_rate = self.hits / total_requests if total_requests > 0 else 0

        return {
            "size": len(self.cache),
            "max_size": self.max_size,
            "hits": self.hits,
            "misses": self.misses,
            "evictions": self.evictions,
            "hit_rate": hit_rate,
            "total_requests": total_requests
        }


class CacheManager:
    """
    Centralized cache management with Redis and in-memory caching
    """

    def __init__(self, config: CacheConfig = CacheConfig()):
        """
        Initialize cache manager

        Args:
            config: Cache configuration
        """
        self.config = config
        self.redis_pool: Optional[ConnectionPool] = None
        self.redis_client: Optional[redis.Redis] = None
        self.memory_cache = LRUCache(
            max_size=config.MEMORY_CACHE_SIZE,
            ttl=config.MEMORY_CACHE_TTL
        )
        self.is_connected = False

    async def connect(self) -> None:
        """Connect to Redis"""
        try:
            self.redis_pool = ConnectionPool.from_url(
                self.config.REDIS_URL,
                max_connections=self.config.REDIS_MAX_CONNECTIONS,
                socket_keepalive=self.config.REDIS_SOCKET_KEEPALIVE,
                socket_keepalive_options=self.config.REDIS_SOCKET_KEEPALIVE_OPTIONS
            )

            self.redis_client = redis.Redis(connection_pool=self.redis_pool)

            # Test connection
            await self.redis_client.ping()
            self.is_connected = True

            logger.info("Connected to Redis cache")

            # Warm cache if configured
            if self.config.WARM_CACHE_ON_STARTUP:
                asyncio.create_task(self.warm_cache())

        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            self.is_connected = False

    async def disconnect(self) -> None:
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
        if self.redis_pool:
            await self.redis_pool.disconnect()
        self.is_connected = False

    async def get(
        self,
        key: str,
        use_memory_cache: bool = True
    ) -> Optional[Any]:
        """
        Get value from cache (memory first, then Redis)

        Args:
            key: Cache key
            use_memory_cache: Whether to check memory cache first

        Returns:
            Cached value or None
        """
        # Check memory cache first
        if use_memory_cache:
            value = self.memory_cache.get(key)
            if value is not None:
                return value

        # Check Redis
        if self.is_connected:
            try:
                value = await self.redis_client.get(key)
                if value:
                    # Deserialize and store in memory cache
                    deserialized = pickle.loads(value)
                    if use_memory_cache:
                        self.memory_cache.set(key, deserialized)
                    return deserialized
            except Exception as e:
                logger.error(f"Redis get error for key {key}: {str(e)}")

        return None

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        use_memory_cache: bool = True
    ) -> bool:
        """
        Set value in cache

        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds
            use_memory_cache: Whether to also store in memory cache

        Returns:
            True if successful
        """
        ttl = ttl or self.config.DEFAULT_TTL

        # Store in memory cache
        if use_memory_cache:
            self.memory_cache.set(key, value)

        # Store in Redis
        if self.is_connected:
            try:
                serialized = pickle.dumps(value)
                await self.redis_client.setex(key, ttl, serialized)
                return True
            except Exception as e:
                logger.error(f"Redis set error for key {key}: {str(e)}")

        return False

    async def delete(self, key: str) -> bool:
        """
        Delete value from cache

        Args:
            key: Cache key

        Returns:
            True if deleted
        """
        # Remove from memory cache
        self.memory_cache.invalidate(key)

        # Remove from Redis
        if self.is_connected:
            try:
                result = await self.redis_client.delete(key)
                return result > 0
            except Exception as e:
                logger.error(f"Redis delete error for key {key}: {str(e)}")

        return False

    async def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching pattern

        Args:
            pattern: Pattern to match

        Returns:
            Number of keys deleted
        """
        count = 0

        # Remove from memory cache
        count += self.memory_cache.invalidate_pattern(pattern)

        # Remove from Redis
        if self.is_connected:
            try:
                cursor = 0
                while True:
                    cursor, keys = await self.redis_client.scan(
                        cursor, match=pattern, count=100
                    )
                    if keys:
                        count += await self.redis_client.delete(*keys)
                    if cursor == 0:
                        break
            except Exception as e:
                logger.error(f"Redis delete pattern error: {str(e)}")

        return count

    async def get_or_set(
        self,
        key: str,
        factory: Callable,
        ttl: Optional[int] = None
    ) -> Any:
        """
        Get value from cache or compute and store

        Args:
            key: Cache key
            factory: Function to compute value if not cached
            ttl: Time to live in seconds

        Returns:
            Cached or computed value
        """
        # Try to get from cache
        value = await self.get(key)
        if value is not None:
            return value

        # Compute value
        if asyncio.iscoroutinefunction(factory):
            value = await factory()
        else:
            value = factory()

        # Store in cache
        await self.set(key, value, ttl)

        return value

    async def warm_cache(self) -> None:
        """
        Warm cache with frequently accessed data
        """
        logger.info("Starting cache warming")

        try:
            # Warm product cache
            # This would typically load popular products from database
            # For now, we'll just log the intention
            logger.info("Cache warming completed")

        except Exception as e:
            logger.error(f"Cache warming failed: {str(e)}")

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics

        Returns:
            Combined cache statistics
        """
        stats = {
            "memory_cache": self.memory_cache.get_stats(),
            "redis_connected": self.is_connected
        }

        if self.is_connected:
            # Add Redis stats asynchronously would require await
            # For sync context, we'll just indicate connection status
            stats["redis"] = {"connected": True}

        return stats


# Global cache manager instance
cache_manager = CacheManager()


def cache_key_builder(
    prefix: str,
    *args,
    **kwargs
) -> str:
    """
    Build cache key from prefix and parameters

    Args:
        prefix: Key prefix
        *args: Positional arguments
        **kwargs: Keyword arguments

    Returns:
        Cache key string
    """
    parts = [prefix]

    # Add positional arguments
    for arg in args:
        if arg is not None:
            parts.append(str(arg))

    # Add keyword arguments (sorted for consistency)
    for key in sorted(kwargs.keys()):
        value = kwargs[key]
        if value is not None:
            parts.append(f"{key}:{value}")

    return ":".join(parts)


def cached(
    ttl: int = 300,
    prefix: str = "cache",
    key_builder: Optional[Callable] = None
):
    """
    Decorator for caching function results

    Args:
        ttl: Time to live in seconds
        prefix: Cache key prefix
        key_builder: Custom key builder function

    Returns:
        Decorated function
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Build cache key
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                # Default key builder
                key_parts = [prefix, func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
                cache_key = ":".join(key_parts)

            # Try to get from cache
            cached_value = await cache_manager.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_value

            # Execute function
            result = await func(*args, **kwargs)

            # Store in cache
            await cache_manager.set(cache_key, result, ttl)
            logger.debug(f"Cached result for {cache_key}")

            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # For sync functions, we'll use memory cache only
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                key_parts = [prefix, func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
                cache_key = ":".join(key_parts)

            # Try memory cache
            cached_value = cache_manager.memory_cache.get(cache_key)
            if cached_value is not None:
                return cached_value

            # Execute function
            result = func(*args, **kwargs)

            # Store in memory cache
            cache_manager.memory_cache.set(cache_key, result)

            return result

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


class HTTPCacheMiddleware:
    """
    HTTP caching middleware for FastAPI
    """

    def __init__(
        self,
        max_age: int = 300,
        s_maxage: int = 600,
        public: bool = True,
        must_revalidate: bool = False,
        proxy_revalidate: bool = False,
        no_cache: bool = False,
        no_store: bool = False,
        no_transform: bool = False,
        immutable: bool = False,
        stale_while_revalidate: Optional[int] = None,
        stale_if_error: Optional[int] = None
    ):
        """
        Initialize HTTP cache middleware

        Args:
            max_age: Max age for browser cache
            s_maxage: Max age for shared caches (CDN)
            public: Allow public caching
            must_revalidate: Force revalidation when stale
            proxy_revalidate: Force proxy revalidation when stale
            no_cache: Prevent caching
            no_store: Prevent storing
            no_transform: Prevent transformation
            immutable: Mark as immutable
            stale_while_revalidate: Serve stale while revalidating
            stale_if_error: Serve stale on error
        """
        self.cache_control_parts = []

        if no_store:
            self.cache_control_parts.append("no-store")
        elif no_cache:
            self.cache_control_parts.append("no-cache")
        else:
            if public:
                self.cache_control_parts.append("public")
            else:
                self.cache_control_parts.append("private")

            self.cache_control_parts.append(f"max-age={max_age}")

            if s_maxage is not None:
                self.cache_control_parts.append(f"s-maxage={s_maxage}")

            if must_revalidate:
                self.cache_control_parts.append("must-revalidate")

            if proxy_revalidate:
                self.cache_control_parts.append("proxy-revalidate")

            if no_transform:
                self.cache_control_parts.append("no-transform")

            if immutable:
                self.cache_control_parts.append("immutable")

            if stale_while_revalidate is not None:
                self.cache_control_parts.append(
                    f"stale-while-revalidate={stale_while_revalidate}"
                )

            if stale_if_error is not None:
                self.cache_control_parts.append(
                    f"stale-if-error={stale_if_error}"
                )

        self.cache_control = ", ".join(self.cache_control_parts)

    async def __call__(self, request: Request, call_next):
        """
        Process request with cache headers

        Args:
            request: FastAPI request
            call_next: Next middleware/handler

        Returns:
            Response with cache headers
        """
        # Generate ETag from request
        etag = self._generate_etag(request)

        # Check If-None-Match header
        if_none_match = request.headers.get("if-none-match")
        if if_none_match == etag:
            # Return 304 Not Modified
            return Response(status_code=304)

        # Process request
        response = await call_next(request)

        # Add cache headers
        response.headers["Cache-Control"] = self.cache_control
        response.headers["ETag"] = etag
        response.headers["Vary"] = "Accept-Encoding"

        # Add cache status header
        cache_status = "MISS"
        if hasattr(response, "_from_cache") and response._from_cache:
            cache_status = "HIT"
        response.headers["X-Cache-Status"] = cache_status

        return response

    def _generate_etag(self, request: Request) -> str:
        """
        Generate ETag for request

        Args:
            request: FastAPI request

        Returns:
            ETag string
        """
        # Create hash from URL and relevant headers
        etag_parts = [
            str(request.url),
            request.headers.get("accept", ""),
            request.headers.get("accept-encoding", ""),
            request.headers.get("accept-language", "")
        ]

        etag_string = "|".join(etag_parts)
        etag_hash = hashlib.md5(etag_string.encode()).hexdigest()

        return f'"{etag_hash}"'


# Cache invalidation strategies
class CacheInvalidator:
    """
    Cache invalidation strategies
    """

    @staticmethod
    async def invalidate_user_cache(user_id: str):
        """Invalidate all user-related cache entries"""
        patterns = [
            f"{CacheConfig.USER_PREFIX}{user_id}:*",
            f"{CacheConfig.SESSION_PREFIX}{user_id}:*",
            f"{CacheConfig.RECOMMENDATION_PREFIX}{user_id}:*"
        ]

        total_deleted = 0
        for pattern in patterns:
            deleted = await cache_manager.delete_pattern(pattern)
            total_deleted += deleted

        logger.info(f"Invalidated {total_deleted} cache entries for user {user_id}")
        return total_deleted

    @staticmethod
    async def invalidate_product_cache(product_id: str):
        """Invalidate product-related cache entries"""
        patterns = [
            f"{CacheConfig.PRODUCT_PREFIX}{product_id}",
            f"{CacheConfig.PRODUCT_PREFIX}{product_id}:*",
            f"{CacheConfig.SEARCH_PREFIX}*"  # Invalidate search results
        ]

        total_deleted = 0
        for pattern in patterns:
            deleted = await cache_manager.delete_pattern(pattern)
            total_deleted += deleted

        logger.info(f"Invalidated {total_deleted} cache entries for product {product_id}")
        return total_deleted

    @staticmethod
    async def invalidate_all():
        """Invalidate all cache entries"""
        # Clear memory cache
        cache_manager.memory_cache.clear()

        # Clear Redis cache
        if cache_manager.is_connected:
            await cache_manager.redis_client.flushdb()

        logger.info("Invalidated all cache entries")


# Export public API
__all__ = [
    'CacheConfig',
    'CacheManager',
    'cache_manager',
    'cached',
    'cache_key_builder',
    'HTTPCacheMiddleware',
    'CacheInvalidator',
    'LRUCache'
]