#!/bin/bash

# Lighthouse CI Performance Testing Script
# Automated Core Web Vitals monitoring with regression detection

set -e

echo "======================================"
echo "LIGHTHOUSE CI PERFORMANCE TESTING"
echo "======================================"

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
REPORT_DIR="$BASE_DIR/tests-22-sept/automated/performance/lighthouse-ci"
CONFIG_FILE="$BASE_DIR/web/lighthouserc.json"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create report directory
mkdir -p "$REPORT_DIR"

echo ""
echo "Starting Lighthouse CI performance tests..."
echo "Timestamp: $TIMESTAMP"
echo "Report directory: $REPORT_DIR"
echo ""

# Change to web directory
cd "$BASE_DIR/web"

# Run Lighthouse CI
echo "Running Lighthouse CI with configuration..."
npx lhci autorun --config="$CONFIG_FILE" || {
    echo "Error: Lighthouse CI failed"
    exit 1
}

# Generate summary report
echo ""
echo "Generating performance summary..."
cat > "$REPORT_DIR/summary_$TIMESTAMP.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "tool": "Lighthouse CI",
    "status": "complete",
    "config": "$CONFIG_FILE",
    "metrics_tracked": [
        "First Contentful Paint (FCP)",
        "Largest Contentful Paint (LCP)",
        "Cumulative Layout Shift (CLS)",
        "Total Blocking Time (TBT)",
        "Speed Index",
        "Time to Interactive (TTI)"
    ],
    "performance_budgets": {
        "performance_score": 85,
        "accessibility_score": 95,
        "best_practices_score": 90,
        "seo_score": 90
    }
}
EOF

echo ""
echo "======================================"
echo "LIGHTHOUSE CI COMPLETE"
echo "Reports saved to: $REPORT_DIR"
echo "======================================