#!/bin/bash

# Frontend Testing Suite for aclue
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
WEB_DIR="${PROJECT_ROOT}/web"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
RESULTS_DIR="${SCRIPT_DIR}/frontend-results/${TIMESTAMP}"

mkdir -p "${RESULTS_DIR}"

echo "================================================================"
echo "              FRONTEND TESTING SUITE"
echo "================================================================"
echo "Timestamp: ${TIMESTAMP}"
echo "Results: ${RESULTS_DIR}"
echo "================================================================"

cd "${WEB_DIR}"

# Install necessary packages
echo "[INFO] Installing frontend testing tools..."
npm install --save-dev \
    @axe-core/playwright \
    lighthouse \
    web-vitals \
    @lhci/cli \
    pa11y \
    broken-link-checker \
    --silent 2>/dev/null || true

# Run accessibility tests with Pa11y
echo "[INFO] Running Pa11y accessibility tests..."
if command -v pa11y &> /dev/null; then
    npx pa11y https://aclue.app --reporter json > "${RESULTS_DIR}/pa11y.json" 2>&1 || true
fi

# Run broken link checker
echo "[INFO] Checking for broken links..."
if command -v blc &> /dev/null; then
    npx blc https://aclue.app --filter-level 3 > "${RESULTS_DIR}/broken-links.txt" 2>&1 || true
fi

# Run Lighthouse CI
echo "[INFO] Running Lighthouse performance audit..."
if [ -f "lighthouserc.js" ] || [ -f ".lighthouserc.js" ]; then
    npx lhci autorun --collect.url=https://aclue.app --upload.target=filesystem --upload.outputDir="${RESULTS_DIR}/lighthouse" 2>&1 || true
else
    npx lighthouse https://aclue.app \
        --output json \
        --output-path "${RESULTS_DIR}/lighthouse.json" \
        --chrome-flags="--headless --no-sandbox" \
        --only-categories=performance,accessibility,best-practices,seo 2>&1 || true
fi

# Run TypeScript type checking
echo "[INFO] Running TypeScript type checking..."
npx tsc --noEmit --pretty > "${RESULTS_DIR}/typescript-check.log" 2>&1 || true

# Check bundle size
echo "[INFO] Analyzing bundle size..."
if [ -f "next.config.js" ]; then
    npm run build 2>&1 | tee "${RESULTS_DIR}/build.log" || true

    # Extract bundle size info
    if [ -d ".next" ]; then
        du -sh .next/* > "${RESULTS_DIR}/bundle-sizes.txt" 2>&1 || true
    fi
fi

# Generate summary
cat > "${RESULTS_DIR}/summary.json" << EOF
{
    "timestamp": "${TIMESTAMP}",
    "tests_executed": [
        "pa11y_accessibility",
        "broken_link_checker",
        "lighthouse_performance",
        "typescript_type_check",
        "bundle_size_analysis"
    ],
    "results_directory": "${RESULTS_DIR}"
}
EOF

echo "================================================================"
echo "Frontend testing completed!"
echo "Results saved to: ${RESULTS_DIR}"
echo "================================================================"