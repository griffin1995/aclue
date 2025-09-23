#!/bin/bash
# Convenience script to run Aclue testing suite
cd "$(dirname "$0")"
exec tests-22-sept/automated/run-all-automated-tests.sh "$@"