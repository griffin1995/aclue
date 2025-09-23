#!/bin/bash
# Convenience script to run aclue testing suite
cd "$(dirname "$0")"
exec tests-22-sept/automated/run-all-automated-tests.sh "$@"