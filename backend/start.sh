#!/bin/bash

# aclue Backend Start Script
# Handles both development and production environments

set -e

echo "🚀 Starting aclue Backend..."
echo "Environment: ${ENVIRONMENT:-production}"
echo "Port: ${PORT:-8000}"

# Set default values for production
export PYTHONPATH="${PYTHONPATH:-/app}"
export WORKERS="${WORKERS:-4}"

# Use PORT environment variable from Railway, fallback to 8000
PORT=${PORT:-8000}

# Start the application
if [ "${ENVIRONMENT}" = "development" ]; then
    echo "🔧 Starting in development mode with hot reload..."
    exec uvicorn app.main_api:app --host 0.0.0.0 --port $PORT --reload
else
    echo "🚀 Starting in production mode with ${WORKERS} workers..."
    echo "Worker timeout: ${WORKER_TIMEOUT:-30}s"
    echo "Max requests per worker: ${WORKER_MAX_REQUESTS:-1000}"

    # Use gunicorn for production deployment with uvicorn workers
    exec gunicorn app.main_api:app \
        --bind 0.0.0.0:$PORT \
        --workers $WORKERS \
        --worker-class uvicorn.workers.UvicornWorker \
        --timeout ${WORKER_TIMEOUT:-30} \
        --keepalive ${WORKER_KEEPALIVE:-5} \
        --max-requests ${WORKER_MAX_REQUESTS:-1000} \
        --max-requests-jitter ${WORKER_MAX_REQUESTS_JITTER:-50} \
        --preload \
        --access-logfile - \
        --error-logfile - \
        --log-level info
fi