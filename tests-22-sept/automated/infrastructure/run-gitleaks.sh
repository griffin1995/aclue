#!/bin/bash

# Individual Gitleaks Secret Detection Scanner
# Git repository secret scanning with comprehensive rules

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"

mkdir -p "$REPORTS_DIR"

echo "🔍 Running Gitleaks Secret Detection Scan"
echo "Project: $PROJECT_ROOT"
echo "Reports: $REPORTS_DIR"

# Run Gitleaks with custom configuration
cd "$PROJECT_ROOT"

"$SCRIPT_DIR/tools/gitleaks" detect \
    --config "$SCRIPT_DIR/configs/gitleaks-config.toml" \
    --report-path "$REPORTS_DIR/gitleaks-detailed-report.json" \
    --report-format json \
    --source . \
    --verbose

echo "✅ Gitleaks scan completed"
echo "📄 Report saved to: $REPORTS_DIR/gitleaks-detailed-report.json"