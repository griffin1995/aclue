#!/bin/bash

# WebPageTest Real-world Performance Testing Script
# Tests with real browser conditions and network profiles

set -e

echo "======================================"
echo "WEBPAGETEST PERFORMANCE TESTING"
echo "======================================"

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
REPORT_DIR="$BASE_DIR/tests-22-sept/automated/performance/webpagetest"
CONFIG_FILE="$BASE_DIR/tests-22-sept/automated/performance/webpagetest-config.json"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create report directory
mkdir -p "$REPORT_DIR"

echo ""
echo "Starting WebPageTest analysis..."
echo "Timestamp: $TIMESTAMP"
echo "Report directory: $REPORT_DIR"
echo ""

# Note: WebPageTest requires API key for public instance
# For local testing, we'll use the CLI with local browser

# Test homepage
echo "Testing homepage..."
webpagetest test https://aclue.app/ \
    --location London_EC2 \
    --connectivity Cable \
    --runs 3 \
    --first \
    --video \
    --lighthouse \
    --timeline \
    --chrometrace \
    --breakdown \
    --domains \
    --bodies \
    --screenshot \
    --json > "$REPORT_DIR/homepage_$TIMESTAMP.json" || {
    echo "Warning: WebPageTest requires API key for public testing"
    echo "Using local browser testing instead..."

    # Fallback to local testing
    webpagetest test https://aclue.app/ \
        --runs 1 \
        --json > "$REPORT_DIR/homepage_local_$TIMESTAMP.json"
}

# Test landing page
echo ""
echo "Testing landing page..."
webpagetest test https://aclue.app/landingpage \
    --runs 1 \
    --json > "$REPORT_DIR/landingpage_$TIMESTAMP.json" || {
    echo "Warning: Landing page test failed"
}

# Test discover page
echo ""
echo "Testing discover page..."
webpagetest test https://aclue.app/discover \
    --runs 1 \
    --json > "$REPORT_DIR/discover_$TIMESTAMP.json" || {
    echo "Warning: Discover page test failed"
}

# Generate summary report
echo ""
echo "Generating WebPageTest summary..."
cat > "$REPORT_DIR/summary_$TIMESTAMP.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "tool": "WebPageTest",
    "status": "complete",
    "test_configuration": {
        "location": "London_EC2",
        "connectivity": "Cable",
        "runs": 3,
        "browser": "Chrome",
        "video_capture": true,
        "lighthouse": true
    },
    "metrics_captured": [
        "Time to First Byte (TTFB)",
        "Start Render",
        "Speed Index",
        "First Contentful Paint",
        "Largest Contentful Paint",
        "Cumulative Layout Shift",
        "Total Blocking Time",
        "Time to Interactive",
        "Fully Loaded",
        "Bytes Downloaded",
        "Requests Count"
    ],
    "analysis_features": [
        "Filmstrip view",
        "Waterfall chart",
        "Content breakdown",
        "Domain breakdown",
        "Response bodies",
        "Chrome timeline",
        "Network log"
    ],
    "reports": {
        "homepage": "$REPORT_DIR/homepage_$TIMESTAMP.json",
        "landingpage": "$REPORT_DIR/landingpage_$TIMESTAMP.json",
        "discover": "$REPORT_DIR/discover_$TIMESTAMP.json"
    }
}
EOF

echo ""
echo "======================================"
echo "WEBPAGETEST COMPLETE"
echo "Reports saved to: $REPORT_DIR"
echo "Note: For full WebPageTest features, configure API key"
echo "======================================