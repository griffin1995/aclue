#!/bin/bash

# Master Performance Monitoring Script
# Runs all performance testing tools and generates comprehensive reports

set -e

echo "=============================================="
echo "ACLUE PLATFORM - COMPREHENSIVE PERFORMANCE MONITORING"
echo "=============================================="
echo ""

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
PERF_DIR="$BASE_DIR/tests-22-sept/automated/performance"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$PERF_DIR/master-report_$TIMESTAMP.json"

# Make scripts executable
chmod +x "$PERF_DIR"/*.sh

# Function to run test and capture result
run_test() {
    local test_name=$1
    local script_path=$2

    echo ""
    echo "----------------------------------------"
    echo "Running: $test_name"
    echo "----------------------------------------"

    if [ -f "$script_path" ]; then
        if bash "$script_path"; then
            echo "✅ $test_name completed successfully"
            return 0
        else
            echo "⚠️  $test_name failed or partially completed"
            return 1
        fi
    else
        echo "❌ $test_name script not found"
        return 1
    fi
}

# Track test results
declare -A test_results

echo "Starting comprehensive performance testing suite..."
echo "Timestamp: $TIMESTAMP"
echo ""

# 1. Run Lighthouse CI
if run_test "Lighthouse CI" "$PERF_DIR/run-lighthouse-ci.sh"; then
    test_results["lighthouse_ci"]="success"
else
    test_results["lighthouse_ci"]="failed"
fi

# 2. Run Unlighthouse
if run_test "Unlighthouse" "$PERF_DIR/run-unlighthouse.sh"; then
    test_results["unlighthouse"]="success"
else
    test_results["unlighthouse"]="failed"
fi

# 3. Run Sitespeed.io
if run_test "Sitespeed.io" "$PERF_DIR/run-sitespeed.sh"; then
    test_results["sitespeed"]="success"
else
    test_results["sitespeed"]="failed"
fi

# 4. Run WebPageTest
if run_test "WebPageTest" "$PERF_DIR/run-webpagetest.sh"; then
    test_results["webpagetest"]="success"
else
    test_results["webpagetest"]="failed"
fi

# Generate master report
echo ""
echo "=============================================="
echo "Generating master performance report..."
echo "=============================================="

cat > "$REPORT_FILE" << EOF
{
    "timestamp": "$TIMESTAMP",
    "platform": "aclue Performance Monitoring Suite",
    "test_results": {
        "lighthouse_ci": "${test_results[lighthouse_ci]:-skipped}",
        "unlighthouse": "${test_results[unlighthouse]:-skipped}",
        "sitespeed": "${test_results[sitespeed]:-skipped}",
        "webpagetest": "${test_results[webpagetest]:-skipped}"
    },
    "monitored_urls": [
        "https://aclue.app/",
        "https://aclue.app/landingpage",
        "https://aclue.app/discover",
        "http://localhost:3000/",
        "http://localhost:3000/landingpage",
        "http://localhost:3000/discover"
    ],
    "metrics_tracked": {
        "core_web_vitals": [
            "Largest Contentful Paint (LCP)",
            "First Input Delay (FID) / Interaction to Next Paint (INP)",
            "Cumulative Layout Shift (CLS)"
        ],
        "performance_metrics": [
            "First Contentful Paint (FCP)",
            "Time to Interactive (TTI)",
            "Total Blocking Time (TBT)",
            "Speed Index",
            "Time to First Byte (TTFB)"
        ],
        "resource_metrics": [
            "Total Transfer Size",
            "Number of Requests",
            "JavaScript Size",
            "CSS Size",
            "Image Size"
        ],
        "other_metrics": [
            "Performance Score",
            "Accessibility Score",
            "Best Practices Score",
            "SEO Score",
            "Carbon Footprint"
        ]
    },
    "performance_budgets": {
        "lcp": "2500ms",
        "fcp": "1800ms",
        "cls": "0.1",
        "tbt": "300ms",
        "tti": "3800ms",
        "performance_score": "85",
        "total_size": "2MB"
    },
    "tools_configuration": {
        "lighthouse_ci": {
            "config": "$BASE_DIR/web/lighthouserc.json",
            "reports": "$PERF_DIR/lighthouse-ci/"
        },
        "unlighthouse": {
            "config": "$BASE_DIR/web/unlighthouse.config.ts",
            "reports": "$PERF_DIR/unlighthouse/"
        },
        "sitespeed": {
            "config": "$PERF_DIR/sitespeed.config.json",
            "reports": "$PERF_DIR/sitespeed/"
        },
        "webpagetest": {
            "config": "$PERF_DIR/webpagetest-config.json",
            "reports": "$PERF_DIR/webpagetest/"
        }
    },
    "analysis_capabilities": [
        "Automated Core Web Vitals monitoring",
        "Performance regression detection",
        "Site-wide parallel performance auditing",
        "Real-world browser testing",
        "Sustainability and carbon footprint analysis",
        "Performance budget enforcement",
        "Waterfall and filmstrip analysis",
        "Resource breakdown analysis",
        "Network throttling simulation"
    ]
}
EOF

# Display summary
echo ""
echo "=============================================="
echo "PERFORMANCE TESTING COMPLETE"
echo "=============================================="
echo ""
echo "Test Results Summary:"
echo "  • Lighthouse CI: ${test_results[lighthouse_ci]:-skipped}"
echo "  • Unlighthouse: ${test_results[unlighthouse]:-skipped}"
echo "  • Sitespeed.io: ${test_results[sitespeed]:-skipped}"
echo "  • WebPageTest: ${test_results[webpagetest]:-skipped}"
echo ""
echo "Master report saved to: $REPORT_FILE"
echo ""
echo "View detailed reports in:"
echo "  • $PERF_DIR/lighthouse-ci/"
echo "  • $PERF_DIR/unlighthouse/"
echo "  • $PERF_DIR/sitespeed/"
echo "  • $PERF_DIR/webpagetest/"
echo ""
echo "=============================================="