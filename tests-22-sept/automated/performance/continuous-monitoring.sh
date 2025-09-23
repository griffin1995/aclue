#!/bin/bash

# Continuous Performance Monitoring Script
# Designed for cron job scheduling or CI/CD integration

set -e

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
PERF_DIR="$BASE_DIR/tests-22-sept/automated/performance"
RESULTS_DIR="$PERF_DIR/continuous-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATE=$(date +"%Y-%m-%d")

# Create results directory
mkdir -p "$RESULTS_DIR/$DATE"

# Function to check if service is running
check_service() {
    local url=$1
    if curl -s --head --request GET "$url" --max-time 5 | grep "200 OK\|301\|302" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to run quick performance check
quick_perf_check() {
    local url=$1
    local label=$2
    local output_file="$RESULTS_DIR/$DATE/${label}_$TIMESTAMP.json"

    echo "Checking $label: $url"

    # Use Lighthouse for quick check
    npx lighthouse "$url" \
        --output json \
        --output-path "$output_file" \
        --only-categories performance \
        --throttling-method provided \
        --preset desktop \
        --quiet \
        --chrome-flags="--headless" || {
        echo "Warning: Failed to test $url"
        return 1
    }

    # Extract key metrics
    if [ -f "$output_file" ]; then
        performance_score=$(jq '.categories.performance.score' "$output_file")
        lcp=$(jq '.audits["largest-contentful-paint"].numericValue' "$output_file")
        fcp=$(jq '.audits["first-contentful-paint"].numericValue' "$output_file")
        cls=$(jq '.audits["cumulative-layout-shift"].numericValue' "$output_file")
        tbt=$(jq '.audits["total-blocking-time"].numericValue' "$output_file")

        echo "  Performance Score: $(echo "$performance_score * 100" | bc)%"
        echo "  LCP: ${lcp}ms"
        echo "  FCP: ${fcp}ms"
        echo "  CLS: $cls"
        echo "  TBT: ${tbt}ms"
    fi

    return 0
}

# Log start
echo "======================================"
echo "CONTINUOUS PERFORMANCE MONITORING"
echo "Started: $(date)"
echo "======================================"

# Check production site
echo ""
echo "Testing Production Environment..."
if check_service "https://aclue.app"; then
    quick_perf_check "https://aclue.app/" "production_homepage"
    quick_perf_check "https://aclue.app/landingpage" "production_landingpage"
    quick_perf_check "https://aclue.app/discover" "production_discover"
else
    echo "⚠️  Production site is not responding"
fi

# Check localhost if available
echo ""
echo "Testing Local Environment..."
if check_service "http://localhost:3000"; then
    quick_perf_check "http://localhost:3000/" "localhost_homepage"
    quick_perf_check "http://localhost:3000/landingpage" "localhost_landingpage"
    quick_perf_check "http://localhost:3000/discover" "localhost_discover"
else
    echo "ℹ️  Local development server is not running"
fi

# Generate daily summary
echo ""
echo "Generating daily summary..."
SUMMARY_FILE="$RESULTS_DIR/$DATE/summary_$TIMESTAMP.json"

cat > "$SUMMARY_FILE" << EOF
{
    "date": "$DATE",
    "timestamp": "$TIMESTAMP",
    "monitoring_type": "continuous",
    "environments_tested": {
        "production": $(check_service "https://aclue.app" && echo "true" || echo "false"),
        "localhost": $(check_service "http://localhost:3000" && echo "true" || echo "false")
    },
    "results_directory": "$RESULTS_DIR/$DATE",
    "monitoring_frequency": "hourly recommended",
    "alert_thresholds": {
        "performance_score": 80,
        "lcp": 3000,
        "fcp": 2000,
        "cls": 0.15,
        "tbt": 400
    }
}
EOF

# Check for performance regressions
echo ""
echo "Checking for performance regressions..."
if [ -f "$RESULTS_DIR/$DATE/production_homepage_"*.json ]; then
    latest_score=$(jq '.categories.performance.score' "$RESULTS_DIR/$DATE"/production_homepage_*.json | tail -1)
    if (( $(echo "$latest_score < 0.80" | bc -l) )); then
        echo "⚠️  ALERT: Performance score below threshold: $(echo "$latest_score * 100" | bc)%"
    fi
fi

echo ""
echo "======================================"
echo "MONITORING COMPLETE"
echo "Results saved to: $RESULTS_DIR/$DATE"
echo "Completed: $(date)"
echo "======================================"

# Exit with success
exit 0