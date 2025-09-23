#!/bin/bash
# Convenience script for monitoring dashboard
cd "$(dirname "$0")"
exec tests-22-sept/automated/monitoring-dashboard.sh "$@"