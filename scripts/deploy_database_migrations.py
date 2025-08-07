#!/usr/bin/env python3
"""
Database Migration Deployment Script
Safely deploys database schema changes to Supabase production database.
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_sql_file(file_path: Path) -> str:
    """Load SQL content from file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Failed to load SQL file {file_path}: {e}")
        raise

def execute_migration(supabase: Client, sql_content: str, migration_name: str):
    """Execute a database migration safely."""
    try:
        logger.info(f"🚀 Executing migration: {migration_name}")
        
        # Execute the SQL content
        result = supabase.rpc('exec_sql', {'sql': sql_content}).execute()
        
        if result.data:
            logger.info(f"✅ Migration {migration_name} executed successfully")
            return True
        else:
            logger.error(f"❌ Migration {migration_name} failed: {result}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Migration {migration_name} failed with error: {e}")
        return False

def main():
    """Main migration deployment function."""
    logger.info("🔄 Starting database migration deployment...")
    
    # Database configuration
    supabase_url = os.getenv('SUPABASE_URL', 'https://xchsarvamppwephulylt.supabase.co')
    supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
    
    if not supabase_service_key:
        logger.error("❌ SUPABASE_SERVICE_KEY environment variable required")
        sys.exit(1)
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(supabase_url, supabase_service_key)
        logger.info("✅ Connected to Supabase database")
        
        # Define migration files in order
        migration_files = [
            'database/02_create_missing_tables.sql',
            'database/enhanced_rls_policies.sql'
        ]
        
        # Execute each migration
        success_count = 0
        for migration_file in migration_files:
            file_path = Path(__file__).parent.parent / migration_file
            
            if not file_path.exists():
                logger.warning(f"⚠️ Migration file not found: {migration_file}")
                continue
            
            logger.info(f"📄 Loading migration: {migration_file}")
            sql_content = load_sql_file(file_path)
            
            if execute_migration(supabase, sql_content, migration_file):
                success_count += 1
            else:
                logger.error(f"❌ Failed to execute {migration_file}")
                
        # Summary
        total_migrations = len([f for f in migration_files if (Path(__file__).parent.parent / f).exists()])
        logger.info(f"📊 Migration Summary: {success_count}/{total_migrations} migrations executed successfully")
        
        if success_count == total_migrations:
            logger.info("🎉 All database migrations completed successfully!")
            return True
        else:
            logger.error("💥 Some migrations failed. Check logs for details.")
            return False
            
    except Exception as e:
        logger.error(f"❌ Database migration deployment failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)