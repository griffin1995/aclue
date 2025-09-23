#!/bin/bash
# Convenience script for quick security scan
cd "$(dirname "$0")"
exec tests-22-sept/automated/quick-scan.sh "$@"