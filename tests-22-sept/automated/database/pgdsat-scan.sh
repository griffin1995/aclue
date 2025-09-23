#!/bin/bash
# PGDSAT PostgreSQL Database Security Assessment Tool
# Performs 70+ security checks against CIS PostgreSQL benchmarks

set -euo pipefail

# Configuration
TOOLS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/tools"
REPORTS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
REPORT_FILE="${REPORTS_DIR}/pgdsat_security_report_${TIMESTAMP}.json"

# Database connection parameters (read from environment or defaults)
DB_HOST="${DB_HOST:-db.usdgihyvmwxtbspkdmuj.supabase.co}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-postgres}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${SUPABASE_DB_PASSWORD:-}"

echo "==============================================="
echo "PGDSAT PostgreSQL Security Assessment"
echo "Timestamp: $(date)"
echo "Target: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo "Report: ${REPORT_FILE}"
echo "==============================================="

# Ensure reports directory exists
mkdir -p "${REPORTS_DIR}"

# Check if PGDSAT tool exists
if [[ ! -f "${TOOLS_DIR}/ciscollector" ]]; then
    echo "ERROR: PGDSAT tool not found at ${TOOLS_DIR}/ciscollector"
    exit 1
fi

# Check if database credentials are provided
if [[ -z "${DB_PASS}" ]]; then
    echo "WARNING: DB_PASS not set. Using environment variable SUPABASE_DB_PASSWORD"
    echo "Please set SUPABASE_DB_PASSWORD environment variable with database password"
fi

# Create configuration file for PGDSAT
CONFIG_FILE="/tmp/pgdsat_config_${TIMESTAMP}.json"
cat > "${CONFIG_FILE}" << EOF
{
    "host": "${DB_HOST}",
    "port": ${DB_PORT},
    "database": "${DB_NAME}",
    "user": "${DB_USER}",
    "password": "${DB_PASS}",
    "sslmode": "require",
    "connect_timeout": 10
}
EOF

echo "Running PGDSAT CIS PostgreSQL Benchmark Assessment..."

# Execute PGDSAT with comprehensive security checks
cd "${TOOLS_DIR}"

# Run the assessment with detailed output
if ./ciscollector \
    --config "${CONFIG_FILE}" \
    --output-format json \
    --output-file "${REPORT_FILE}" \
    --verbose \
    --all-checks \
    2>&1 | tee "${REPORTS_DIR}/pgdsat_execution_log_${TIMESTAMP}.txt"; then

    echo "✅ PGDSAT assessment completed successfully"
    echo "📊 Report saved to: ${REPORT_FILE}"

    # Generate summary statistics
    if [[ -f "${REPORT_FILE}" ]]; then
        echo ""
        echo "==============================================="
        echo "PGDSAT ASSESSMENT SUMMARY"
        echo "==============================================="

        # Parse JSON results (simplified parsing)
        python3 -c "
import json
try:
    with open('${REPORT_FILE}', 'r') as f:
        data = json.load(f)

    print(f'Total Checks: {len(data.get(\"checks\", []))}')

    passed = sum(1 for check in data.get('checks', []) if check.get('status') == 'PASS')
    failed = sum(1 for check in data.get('checks', []) if check.get('status') == 'FAIL')
    warnings = sum(1 for check in data.get('checks', []) if check.get('status') == 'WARN')

    print(f'✅ Passed: {passed}')
    print(f'❌ Failed: {failed}')
    print(f'⚠️  Warnings: {warnings}')
    print(f'Security Score: {passed/(passed+failed+warnings)*100:.1f}%' if (passed+failed+warnings) > 0 else 'N/A')

    # Show critical failures
    critical_failures = [check for check in data.get('checks', [])
                        if check.get('status') == 'FAIL' and check.get('severity', '').lower() in ['high', 'critical']]

    if critical_failures:
        print('\\n🚨 CRITICAL SECURITY ISSUES:')
        for failure in critical_failures[:5]:  # Show top 5
            print(f'  - {failure.get(\"title\", \"Unknown check\")}: {failure.get(\"description\", \"No description\")}')

except Exception as e:
    print(f'Error parsing report: {e}')
" || echo "Unable to parse JSON report for summary"

    else
        echo "⚠️  Report file not found, check execution log for errors"
    fi

else
    echo "❌ PGDSAT assessment failed"
    echo "📋 Check execution log: ${REPORTS_DIR}/pgdsat_execution_log_${TIMESTAMP}.txt"
    exit 1
fi

# Cleanup temporary config file
rm -f "${CONFIG_FILE}"

echo ""
echo "==============================================="
echo "PGDSAT Assessment Complete"
echo "Time: $(date)"
echo "Reports available in: ${REPORTS_DIR}/"
echo "==============================================="