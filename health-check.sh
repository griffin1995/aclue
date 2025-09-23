#!/bin/bash
# Convenience script for system health check
cd "$(dirname "$0")"
exec tests-22-sept/automated/health-check.sh "$@"