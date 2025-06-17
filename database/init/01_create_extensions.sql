-- Create necessary PostgreSQL extensions

-- UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable case-insensitive text matching
CREATE EXTENSION IF NOT EXISTS "citext";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable advanced indexing
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- PostGIS for geographic data (if needed for location features)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable fuzzy string matching
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";