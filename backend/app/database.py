"""
Database connection and utilities for GiftSync using official Supabase client
"""
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase clients
def create_supabase_client(use_service_key: bool = False) -> Client:
    """Create a Supabase client instance with current API"""
    if not settings.SUPABASE_URL:
        raise ValueError("SUPABASE_URL is required")
    
    if use_service_key:
        if not settings.SUPABASE_SERVICE_KEY:
            raise ValueError("SUPABASE_SERVICE_KEY is required for service operations")
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    else:
        if not settings.SUPABASE_ANON_KEY:
            raise ValueError("SUPABASE_ANON_KEY is required")
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# Lazy initialization to avoid import-time errors
_supabase_anon = None
_supabase_service = None

def get_supabase_anon() -> Client:
    """Get or create anonymous Supabase client"""
    global _supabase_anon
    if _supabase_anon is None:
        _supabase_anon = create_supabase_client(use_service_key=False)
    return _supabase_anon

def get_supabase_service() -> Client:
    """Get or create service Supabase client"""
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = create_supabase_client(use_service_key=True)
    return _supabase_service

# Export lazy getters for backward compatibility
supabase_anon = None  # Will be initialized lazily
supabase_service = None  # Will be initialized lazily

class SupabaseClient:
    """Wrapper class for Supabase operations with backward compatibility"""
    
    def __init__(self):
        pass
    
    def _get_client(self, use_service_key: bool = False) -> Client:
        """Get the appropriate Supabase client"""
        return get_supabase_service() if use_service_key else get_supabase_anon()
    
    async def select(self, table: str, select: str = "*", filters: Optional[dict] = None, limit: int = 100, use_service_key: bool = False):
        """Select data from a table using Supabase query builder"""
        client = self._get_client(use_service_key)
        query = client.table(table).select(select)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        # Apply limit
        if limit > 0:
            query = query.limit(limit)
        
        response = query.execute()
        return response.data
    
    async def insert(self, table: str, data: dict, use_service_key: bool = False):
        """Insert data into a table using Supabase query builder"""
        client = self._get_client(use_service_key)
        response = client.table(table).insert(data).execute()
        return response.data
    
    async def update(self, table: str, data: dict, filters: dict, use_service_key: bool = False):
        """Update data in a table using Supabase query builder"""
        client = self._get_client(use_service_key)
        query = client.table(table).update(data)
        
        # Apply filters
        for key, value in filters.items():
            query = query.eq(key, value)
        
        response = query.execute()
        return response.data
    
    async def delete(self, table: str, filters: dict, use_service_key: bool = False):
        """Delete data from a table using Supabase query builder"""
        client = self._get_client(use_service_key)
        query = client.table(table).delete()
        
        # Apply filters
        for key, value in filters.items():
            query = query.eq(key, value)
        
        response = query.execute()
        return response.data
    
    async def upsert(self, table: str, data: dict, use_service_key: bool = False, on_conflict: str = None):
        """Upsert data in a table using Supabase query builder"""
        client = self._get_client(use_service_key)
        query = client.table(table).upsert(data)
        
        if on_conflict:
            query = query.on_conflict(on_conflict)
        
        response = query.execute()
        return response.data

# Global instance for backward compatibility
supabase = SupabaseClient()

# Export both old and new interfaces
__all__ = ['supabase', 'get_supabase_anon', 'get_supabase_service', 'create_supabase_client']