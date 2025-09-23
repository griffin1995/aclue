#!/bin/bash

# Sitespeed.io Comprehensive Performance Analysis Script
# Complete performance metrics with sustainability analysis

set -e

echo "======================================"
echo "SITESPEED.IO PERFORMANCE ANALYSIS"
echo "======================================"

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
REPORT_DIR="$BASE_DIR/tests-22-sept/automated/performance/sitespeed"
CONFIG_FILE="$BASE_DIR/tests-22-sept/automated/performance/sitespeed.config.json"
BUDGET_FILE="$BASE_DIR/tests-22-sept/automated/performance/performance.budget.json"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create report directory
mkdir -p "$REPORT_DIR"

echo ""
echo "Starting Sitespeed.io analysis..."
echo "Timestamp: $TIMESTAMP"
echo "Report directory: $REPORT_DIR"
echo ""

# Test localhost if running
echo "Testing localhost:3000..."
sitespeed.io http://localhost:3000 \
    --outputFolder "$REPORT_DIR/localhost_$TIMESTAMP" \
    --config "$CONFIG_FILE" \
    --budget.configPath "$BUDGET_FILE" \
    --browsertime.iterations 3 \
    --browsertime.connectivity.profile cable \
    --plugins.add lighthouse \
    --html.showAllWaterfallSummary \
    --summary --summaryDetail \
    --sustainable.enable --sustainable.pageViews 1000000 \
    --coach.enable || {
    echo "Warning: Localhost test failed - may not be running"
}

# Test production site
echo ""
echo "Testing production site (aclue.app)..."
sitespeed.io https://aclue.app https://aclue.app/landingpage https://aclue.app/discover \
    --outputFolder "$REPORT_DIR/production_$TIMESTAMP" \
    --config "$CONFIG_FILE" \
    --budget.configPath "$BUDGET_FILE" \
    --browsertime.iterations 3 \
    --browsertime.connectivity.profile cable \
    --plugins.add lighthouse \
    --html.showAllWaterfallSummary \
    --summary --summaryDetail \
    --sustainable.enable --sustainable.pageViews 1000000 \
    --coach.enable || {
    echo "Error: Production test failed"
    exit 1
}

# Generate performance insights
echo ""
echo "Generating performance insights..."
cat > "$REPORT_DIR/insights_$TIMESTAMP.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "tool": "Sitespeed.io",
    "status": "complete",
    "analysis_types": [
        "Performance metrics",
        "Lighthouse integration",
        "Sustainability analysis",
        "Coach recommendations",
        "Waterfall analysis",
        "HAR file generation",
        "Budget validation",
        "Resource timing"
    ],
    "metrics_collected": [
        "First Paint",
        "First Contentful Paint",
        "Largest Contentful Paint",
        "Cumulative Layout Shift",
        "Total Blocking Time",
        "Speed Index",
        "Time to Interactive",
        "Total Transfer Size",
        "Number of Requests",
        "Carbon Footprint"
    ],
    "reports": {
        "localhost": "$REPORT_DIR/localhost_$TIMESTAMP",
        "production": "$REPORT_DIR/production_$TIMESTAMP"
    }
}
EOF

echo ""
echo "======================================"
echo "SITESPEED.IO ANALYSIS COMPLETE"
echo "Reports saved to: $REPORT_DIR"
echo "View HTML reports:"
echo "  - $REPORT_DIR/localhost_$TIMESTAMP/index.html"
echo "  - $REPORT_DIR/production_$TIMESTAMP/index.html"
echo "======================================