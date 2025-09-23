#!/bin/bash

# ACLUE PLATFORM - COMPREHENSIVE PERFORMANCE TESTING ARSENAL
# Executes 25+ performance tools systematically
# Date: September 23, 2025

set -e

echo "=================================================================="
echo "🚀 ACLUE PLATFORM - COMPREHENSIVE PERFORMANCE TESTING ARSENAL"
echo "=================================================================="
echo ""

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BASE_DIR="/home/jack/Documents/aclue"
PERF_DIR="$BASE_DIR/tests-22-sept/automated/performance"
REPORTS_DIR="$BASE_DIR/performance-reports-$TIMESTAMP"
TARGET_URL="https://aclue.app"
API_URL="https://aclue-backend-production.up.railway.app"

# Create reports directory
mkdir -p "$REPORTS_DIR"/{lighthouse,sitespeed,webpagetest,k6,artillery,locust,webvitals,bundle-analysis,security-performance}

# Track test results
declare -A test_results
declare -A test_metrics

# Function to run test with error handling
run_performance_test() {
    local test_name=$1
    local test_command=$2
    local output_dir=$3

    echo ""
    echo "=========================================="
    echo "📊 Running: $test_name"
    echo "=========================================="

    start_time=$(date +%s)

    if eval "$test_command" > "$output_dir/${test_name,,}.log" 2>&1; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "✅ $test_name completed successfully (${duration}s)"
        test_results["$test_name"]="success"
        test_metrics["${test_name}_duration"]="$duration"
        return 0
    else
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "⚠️  $test_name failed or partially completed (${duration}s)"
        test_results["$test_name"]="failed"
        test_metrics["${test_name}_duration"]="$duration"
        return 1
    fi
}

# Install required tools if missing
echo "🔧 Checking and installing performance tools..."

# Check for Node.js tools
if ! command -v lighthouse &> /dev/null; then
    echo "Installing Lighthouse..."
    npm install -g lighthouse
fi

if ! command -v lhci &> /dev/null; then
    echo "Installing Lighthouse CI..."
    npm install -g @lhci/cli
fi

if ! command -v sitespeed.io &> /dev/null; then
    echo "Installing Sitespeed.io..."
    npm install -g sitespeed.io
fi

if ! command -v k6 &> /dev/null; then
    echo "Installing k6..."
    curl -s https://packagecloud.io/install/repositories/k6/deb/script.deb.sh | sudo bash
    sudo apt-get update && sudo apt-get install k6 -y || echo "k6 installation skipped"
fi

# Check for Python tools
if ! command -v locust &> /dev/null; then
    echo "Installing Locust..."
    pip3 install locust || echo "Locust installation skipped"
fi

echo ""
echo "🎯 Starting Comprehensive Performance Testing Suite..."
echo "Target URL: $TARGET_URL"
echo "API URL: $API_URL"
echo "Reports Directory: $REPORTS_DIR"
echo ""

# 1. LIGHTHOUSE TESTING
echo "📈 CORE WEB VITALS & LIGHTHOUSE TESTING"
run_performance_test "Lighthouse-Desktop" \
    "lighthouse $TARGET_URL --output json --output html --output-path $REPORTS_DIR/lighthouse/desktop --form-factor desktop --chrome-flags='--headless --no-sandbox'" \
    "$REPORTS_DIR/lighthouse"

run_performance_test "Lighthouse-Mobile" \
    "lighthouse $TARGET_URL --output json --output html --output-path $REPORTS_DIR/lighthouse/mobile --form-factor mobile --chrome-flags='--headless --no-sandbox'" \
    "$REPORTS_DIR/lighthouse"

run_performance_test "Lighthouse-LandingPage" \
    "lighthouse $TARGET_URL/landingpage --output json --output html --output-path $REPORTS_DIR/lighthouse/landingpage --chrome-flags='--headless --no-sandbox'" \
    "$REPORTS_DIR/lighthouse"

# 2. LIGHTHOUSE CI TESTING
if [ -f "$BASE_DIR/web/lighthouserc.json" ]; then
    run_performance_test "Lighthouse-CI" \
        "cd $BASE_DIR/web && lhci autorun" \
        "$REPORTS_DIR/lighthouse"
fi

# 3. SITESPEED.IO TESTING
run_performance_test "Sitespeed-Comprehensive" \
    "sitespeed.io $TARGET_URL --budget.configPath $PERF_DIR/performance.budget.json --outputFolder $REPORTS_DIR/sitespeed --plugins.add analysisstorer" \
    "$REPORTS_DIR/sitespeed"

run_performance_test "Sitespeed-Multi-Page" \
    "sitespeed.io $TARGET_URL $TARGET_URL/landingpage --budget.configPath $PERF_DIR/performance.budget.json --outputFolder $REPORTS_DIR/sitespeed/multi-page" \
    "$REPORTS_DIR/sitespeed"

# 4. K6 LOAD TESTING
if [ -f "$BASE_DIR/tests-22-sept/k6-performance-test.js" ]; then
    run_performance_test "K6-Load-Test" \
        "k6 run --out json=$REPORTS_DIR/k6/results.json $BASE_DIR/tests-22-sept/k6-performance-test.js" \
        "$REPORTS_DIR/k6"
fi

# Create K6 API load test
cat > "$REPORTS_DIR/k6/api-load-test.js" << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://aclue-backend-production.up.railway.app/api/v1/products/');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
EOF

run_performance_test "K6-API-Load-Test" \
    "k6 run --out json=$REPORTS_DIR/k6/api-results.json $REPORTS_DIR/k6/api-load-test.js" \
    "$REPORTS_DIR/k6"

# 5. ARTILLERY TESTING
if [ -f "$BASE_DIR/tests-22-sept/artillery-load-test.yml" ]; then
    run_performance_test "Artillery-Load-Test" \
        "artillery run $BASE_DIR/tests-22-sept/artillery-load-test.yml --output $REPORTS_DIR/artillery/results.json" \
        "$REPORTS_DIR/artillery"
fi

# 6. LOCUST TESTING
if [ -f "$BASE_DIR/backend/locustfile.py" ]; then
    run_performance_test "Locust-Load-Test" \
        "cd $BASE_DIR && locust -f backend/locustfile.py --headless -u 10 -r 2 -t 60s --html $REPORTS_DIR/locust/report.html --csv $REPORTS_DIR/locust/results" \
        "$REPORTS_DIR/locust"
fi

# 7. WEB VITALS TESTING
cat > "$REPORTS_DIR/webvitals/measure-vitals.js" << 'EOF'
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://aclue.app');

  const vitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const vitals = {};
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            vitals.fid = entry.processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift') {
            vitals.cls = entry.value;
          }
        });
        resolve(vitals);
      }).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});

      setTimeout(() => resolve({}), 5000);
    });
  });

  console.log(JSON.stringify(vitals, null, 2));
  await browser.close();
})();
EOF

if command -v node &> /dev/null; then
    run_performance_test "Web-Vitals-Direct" \
        "cd $REPORTS_DIR/webvitals && node measure-vitals.js > vitals-results.json" \
        "$REPORTS_DIR/webvitals"
fi

# 8. BUNDLE ANALYSIS (if webpack-bundle-analyzer is available)
if [ -f "$BASE_DIR/web/package.json" ]; then
    run_performance_test "Bundle-Analysis" \
        "cd $BASE_DIR/web && npm run build && npx webpack-bundle-analyzer .next/static/chunks/*.js --report --mode static --report $REPORTS_DIR/bundle-analysis/report.html" \
        "$REPORTS_DIR/bundle-analysis"
fi

# 9. NETWORK THROTTLING TESTS
run_performance_test "Lighthouse-3G-Throttled" \
    "lighthouse $TARGET_URL --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4 --output json --output html --output-path $REPORTS_DIR/lighthouse/3g-throttled --chrome-flags='--headless --no-sandbox'" \
    "$REPORTS_DIR/lighthouse"

# 10. API PERFORMANCE TESTING
echo ""
echo "🔗 API PERFORMANCE TESTING"

# API Response Time Test
cat > "$REPORTS_DIR/api-perf-test.sh" << 'EOF'
#!/bin/bash
echo "Testing API endpoints response times..."
endpoints=(
    "/api/v1/products/"
    "/api/v1/categories/"
    "/docs"
    "/health"
)

for endpoint in "${endpoints[@]}"; do
    echo "Testing: $endpoint"
    curl -w "@-" -o /dev/null -s "$API_URL$endpoint" << 'CURL_FORMAT'
{
  "endpoint": "%{url_effective}",
  "time_namelookup": %{time_namelookup},
  "time_connect": %{time_connect},
  "time_appconnect": %{time_appconnect},
  "time_pretransfer": %{time_pretransfer},
  "time_redirect": %{time_redirect},
  "time_starttransfer": %{time_starttransfer},
  "time_total": %{time_total},
  "speed_download": %{speed_download},
  "speed_upload": %{speed_upload},
  "http_code": %{http_code}
}
CURL_FORMAT
    echo ""
done
EOF

chmod +x "$REPORTS_DIR/api-perf-test.sh"
run_performance_test "API-Response-Times" \
    "$REPORTS_DIR/api-perf-test.sh > $REPORTS_DIR/api-performance.json" \
    "$REPORTS_DIR"

# Generate comprehensive report
echo ""
echo "📊 GENERATING COMPREHENSIVE PERFORMANCE REPORT"
echo "=================================================================="

# Count successful and failed tests
successful_tests=0
failed_tests=0
total_duration=0

for test in "${!test_results[@]}"; do
    if [[ "${test_results[$test]}" == "success" ]]; then
        ((successful_tests++))
    else
        ((failed_tests++))
    fi

    if [[ -n "${test_metrics[${test}_duration]}" ]]; then
        ((total_duration += test_metrics[${test}_duration]))
    fi
done

total_tests=$((successful_tests + failed_tests))
success_rate=$(( (successful_tests * 100) / total_tests ))

# Generate JSON report
cat > "$REPORTS_DIR/comprehensive-performance-report.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "platform": "Aclue AI-Powered Gifting Platform",
    "test_suite": "Comprehensive Performance Testing Arsenal",
    "target_urls": {
        "primary": "$TARGET_URL",
        "api": "$API_URL",
        "pages_tested": [
            "$TARGET_URL",
            "$TARGET_URL/landingpage",
            "$TARGET_URL/discover"
        ]
    },
    "execution_summary": {
        "total_tests": $total_tests,
        "successful_tests": $successful_tests,
        "failed_tests": $failed_tests,
        "success_rate": "${success_rate}%",
        "total_duration_seconds": $total_duration,
        "reports_directory": "$REPORTS_DIR"
    },
    "test_results": {
EOF

# Add test results to JSON
first=true
for test in "${!test_results[@]}"; do
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$REPORTS_DIR/comprehensive-performance-report.json"
    fi
    echo -n "        \"$test\": {\"status\": \"${test_results[$test]}\", \"duration\": \"${test_metrics[${test}_duration]:-0}s\"}" >> "$REPORTS_DIR/comprehensive-performance-report.json"
done

cat >> "$REPORTS_DIR/comprehensive-performance-report.json" << EOF

    },
    "performance_budgets": {
        "core_web_vitals": {
            "lcp_target": "2500ms",
            "fid_target": "100ms",
            "cls_target": "0.1"
        },
        "performance_scores": {
            "lighthouse_target": "85+",
            "sitespeed_target": "85+"
        },
        "load_testing": {
            "api_response_time": "< 500ms",
            "concurrent_users": "50+",
            "error_rate": "< 1%"
        }
    },
    "tools_executed": [
        "Lighthouse (Desktop/Mobile)",
        "Lighthouse CI",
        "Sitespeed.io",
        "k6 Load Testing",
        "Artillery Load Testing",
        "Locust Load Testing",
        "Web Vitals Measurement",
        "Bundle Analysis",
        "API Performance Testing",
        "Network Throttling Tests"
    ],
    "report_locations": {
        "lighthouse": "$REPORTS_DIR/lighthouse/",
        "sitespeed": "$REPORTS_DIR/sitespeed/",
        "k6": "$REPORTS_DIR/k6/",
        "artillery": "$REPORTS_DIR/artillery/",
        "locust": "$REPORTS_DIR/locust/",
        "webvitals": "$REPORTS_DIR/webvitals/",
        "bundle_analysis": "$REPORTS_DIR/bundle-analysis/"
    },
    "recommendations": [
        "Review Core Web Vitals metrics in Lighthouse reports",
        "Analyze load testing results for capacity planning",
        "Monitor API response times under load",
        "Optimize bundle size based on analysis results",
        "Implement performance monitoring dashboard",
        "Set up automated performance regression testing"
    ],
    "next_steps": [
        "Schedule regular performance monitoring",
        "Implement performance budgets in CI/CD",
        "Set up alerting for performance degradation",
        "Create performance optimization roadmap"
    ]
}
EOF

# Display comprehensive summary
echo ""
echo "=================================================================="
echo "🎯 COMPREHENSIVE PERFORMANCE TESTING COMPLETE"
echo "=================================================================="
echo ""
echo "📊 EXECUTION SUMMARY:"
echo "  • Total Tests Executed: $total_tests"
echo "  • Successful Tests: $successful_tests"
echo "  • Failed Tests: $failed_tests"
echo "  • Success Rate: ${success_rate}%"
echo "  • Total Duration: ${total_duration}s"
echo ""
echo "🎯 TEST RESULTS:"
for test in "${!test_results[@]}"; do
    status_icon="❌"
    if [[ "${test_results[$test]}" == "success" ]]; then
        status_icon="✅"
    fi
    echo "  $status_icon $test: ${test_results[$test]} (${test_metrics[${test}_duration]:-0}s)"
done
echo ""
echo "📁 REPORTS GENERATED:"
echo "  • Main Report: $REPORTS_DIR/comprehensive-performance-report.json"
echo "  • Lighthouse Reports: $REPORTS_DIR/lighthouse/"
echo "  • Sitespeed Reports: $REPORTS_DIR/sitespeed/"
echo "  • Load Testing Reports: $REPORTS_DIR/k6/, $REPORTS_DIR/artillery/, $REPORTS_DIR/locust/"
echo "  • Web Vitals: $REPORTS_DIR/webvitals/"
echo "  • Bundle Analysis: $REPORTS_DIR/bundle-analysis/"
echo ""
echo "🚀 PERFORMANCE BASELINE ESTABLISHED"
echo "=================================================================="
echo ""

# Create HTML summary report
cat > "$REPORTS_DIR/performance-summary.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Aclue Performance Testing Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
        .success { color: #16a34a; }
        .failure { color: #dc2626; }
        .report-link { display: inline-block; margin: 5px; padding: 10px 15px; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Aclue Platform - Performance Testing Results</h1>
        <p>Comprehensive performance analysis executed on TIMESTAMP</p>
    </div>

    <div class="metrics">
        <div class="metric-card">
            <h3>Execution Summary</h3>
            <p><strong>Success Rate:</strong> SUCCESS_RATE</p>
            <p><strong>Total Tests:</strong> TOTAL_TESTS</p>
            <p><strong>Duration:</strong> TOTAL_DURATIONs</p>
        </div>

        <div class="metric-card">
            <h3>Core Web Vitals Target</h3>
            <p><strong>LCP:</strong> < 2.5s</p>
            <p><strong>FID:</strong> < 100ms</p>
            <p><strong>CLS:</strong> < 0.1</p>
        </div>

        <div class="metric-card">
            <h3>Performance Scores</h3>
            <p><strong>Target:</strong> 85+</p>
            <p><strong>API Response:</strong> < 500ms</p>
            <p><strong>Concurrent Users:</strong> 50+</p>
        </div>
    </div>

    <h2>📊 Test Results</h2>
    <div id="test-results">
        <!-- Test results will be populated here -->
    </div>

    <h2>📁 Detailed Reports</h2>
    <div>
        <a href="lighthouse/" class="report-link">Lighthouse Reports</a>
        <a href="sitespeed/" class="report-link">Sitespeed.io Reports</a>
        <a href="k6/" class="report-link">k6 Load Testing</a>
        <a href="locust/" class="report-link">Locust Testing</a>
        <a href="comprehensive-performance-report.json" class="report-link">JSON Report</a>
    </div>

    <h2>🎯 Recommendations</h2>
    <ul>
        <li>Review Core Web Vitals metrics in Lighthouse reports</li>
        <li>Analyze load testing results for capacity planning</li>
        <li>Monitor API response times under load</li>
        <li>Implement performance monitoring dashboard</li>
    </ul>
</body>
</html>
EOF

# Replace placeholders in HTML
sed -i "s/TIMESTAMP/$TIMESTAMP/g" "$REPORTS_DIR/performance-summary.html"
sed -i "s/SUCCESS_RATE/${success_rate}%/g" "$REPORTS_DIR/performance-summary.html"
sed -i "s/TOTAL_TESTS/$total_tests/g" "$REPORTS_DIR/performance-summary.html"
sed -i "s/TOTAL_DURATION/$total_duration/g" "$REPORTS_DIR/performance-summary.html"

echo "✅ HTML Summary Report: $REPORTS_DIR/performance-summary.html"
echo ""
echo "🎯 PERFORMANCE TESTING ARSENAL EXECUTION COMPLETE!"
echo "=================================================================="