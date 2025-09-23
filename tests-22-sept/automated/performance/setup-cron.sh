#!/bin/bash

# Setup script for automated performance monitoring with cron

echo "======================================"
echo "PERFORMANCE MONITORING CRON SETUP"
echo "======================================"
echo ""

BASE_DIR="/home/jack/Documents/aclue-preprod"
PERF_DIR="$BASE_DIR/tests-22-sept/automated/performance"

# Make all scripts executable
chmod +x "$PERF_DIR"/*.sh

echo "Suggested cron jobs for automated monitoring:"
echo ""
echo "Add these lines to your crontab (run 'crontab -e'):"
echo ""
echo "# Continuous monitoring every hour"
echo "0 * * * * $PERF_DIR/continuous-monitoring.sh >> $PERF_DIR/cron.log 2>&1"
echo ""
echo "# Daily comprehensive performance audit at 2 AM"
echo "0 2 * * * $PERF_DIR/run-all-performance-tests.sh >> $PERF_DIR/daily-audit.log 2>&1"
echo ""
echo "# Weekly Lighthouse CI regression check on Sundays"
echo "0 3 * * 0 $PERF_DIR/run-lighthouse-ci.sh >> $PERF_DIR/weekly-lighthouse.log 2>&1"
echo ""
echo "# Site-wide Unlighthouse scan twice weekly (Wed & Sat)"
echo "0 4 * * 3,6 $PERF_DIR/run-unlighthouse.sh >> $PERF_DIR/biweekly-unlighthouse.log 2>&1"
echo ""
echo "======================================"
echo "GitHub Actions CI/CD Integration:"
echo "======================================"
echo ""
echo "Create .github/workflows/performance.yml with:"
echo ""
cat << 'YAML'
name: Performance Monitoring

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd web
          npm ci
      - name: Run Lighthouse CI
        run: |
          cd web
          npx lhci autorun
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: tests-22-sept/automated/performance/lighthouse-ci/
YAML
echo ""
echo "======================================"
echo "Setup complete!"
echo "Scripts are now executable and ready for automation."
echo "======================================