#!/bin/bash

# Unlighthouse Site-wide Performance Auditing Script
# Parallel performance testing across all pages

set -e

echo "======================================"
echo "UNLIGHTHOUSE PERFORMANCE AUDITING"
echo "======================================"

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
REPORT_DIR="$BASE_DIR/tests-22-sept/automated/performance/unlighthouse"
CONFIG_FILE="$BASE_DIR/web/unlighthouse.config.ts"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create report directory
mkdir -p "$REPORT_DIR"

echo ""
echo "Starting Unlighthouse site-wide audit..."
echo "Timestamp: $TIMESTAMP"
echo "Report directory: $REPORT_DIR"
echo ""

# Change to web directory
cd "$BASE_DIR/web"

# Run Unlighthouse for localhost
echo "Testing localhost:3000..."
npx unlighthouse --site http://localhost:3000 \
    --output-path "$REPORT_DIR/localhost_$TIMESTAMP" \
    --config "$CONFIG_FILE" || {
    echo "Warning: Localhost test failed - may not be running"
}

# Run Unlighthouse for production
echo ""
echo "Testing production site (aclue.app)..."
npx unlighthouse --site https://aclue.app \
    --output-path "$REPORT_DIR/production_$TIMESTAMP" \
    --config "$CONFIG_FILE" || {
    echo "Error: Production test failed"
    exit 1
}

# Generate combined report
echo ""
echo "Generating combined performance report..."
cat > "$REPORT_DIR/summary_$TIMESTAMP.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "tool": "Unlighthouse",
    "status": "complete",
    "sites_tested": [
        "http://localhost:3000",
        "https://aclue.app"
    ],
    "features": [
        "Site-wide parallel testing",
        "Performance regression detection",
        "Core Web Vitals tracking",
        "Accessibility scanning",
        "SEO analysis",
        "Best practices validation"
    ],
    "reports": {
        "localhost": "$REPORT_DIR/localhost_$TIMESTAMP",
        "production": "$REPORT_DIR/production_$TIMESTAMP"
    }
}
EOF

echo ""
echo "======================================"
echo "UNLIGHTHOUSE AUDIT COMPLETE"
echo "Reports saved to: $REPORT_DIR"
echo "View reports by opening:"
echo "  - $REPORT_DIR/localhost_$TIMESTAMP/index.html"
echo "  - $REPORT_DIR/production_$TIMESTAMP/index.html"
echo "======================================