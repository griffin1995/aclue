#!/bin/bash

# Individual Checkov Infrastructure Security Scanner
# Comprehensive Infrastructure as Code security analysis

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"

mkdir -p "$REPORTS_DIR"

echo "🔍 Running Checkov Infrastructure Security Scan"
echo "Project: $PROJECT_ROOT"
echo "Reports: $REPORTS_DIR"

# Activate virtual environment
source "$SCRIPT_DIR/venv/bin/activate"

# Run Checkov with comprehensive configuration
cd "$PROJECT_ROOT"

checkov \
    --config-file "$SCRIPT_DIR/configs/checkov-config.yaml" \
    --directory "$PROJECT_ROOT" \
    --output cli \
    --output json \
    --output-file "$REPORTS_DIR/checkov-detailed-report.json" \
    --framework all \
    --quiet

deactivate

echo "✅ Checkov scan completed"
echo "📄 Report saved to: $REPORTS_DIR/checkov-detailed-report.json"