#!/bin/bash
# Python Dependency Security Scanner
# Uses pip-audit and Safety for comprehensive Python vulnerability analysis

set -euo pipefail

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
VENV_PATH="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/security-tools-venv"
REPORTS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

echo "==============================================="
echo "Python Dependencies Security Assessment"
echo "Timestamp: $(date)"
echo "Project: ${BASE_DIR}"
echo "==============================================="

# Ensure reports directory exists
mkdir -p "${REPORTS_DIR}"

# Activate virtual environment
source "${VENV_PATH}/bin/activate"

# Scan Python backend dependencies
echo "🔍 Scanning Python backend dependencies..."

# Check if backend directory exists
BACKEND_DIR="${BASE_DIR}/backend"
if [[ -d "${BACKEND_DIR}" ]]; then
    cd "${BACKEND_DIR}"

    echo "📦 Found Python backend directory: ${BACKEND_DIR}"

    # pip-audit scan with detailed output
    echo ""
    echo "🛡️  Running pip-audit vulnerability scan..."
    pip-audit \
        --format json \
        --output "${REPORTS_DIR}/pip-audit_backend_${TIMESTAMP}.json" \
        --desc \
        --cache-dir /tmp/pip-audit-cache \
        || echo "⚠️  pip-audit completed with warnings"

    # Generate human-readable report
    pip-audit \
        --format columns \
        --output "${REPORTS_DIR}/pip-audit_backend_${TIMESTAMP}.txt" \
        --desc \
        --cache-dir /tmp/pip-audit-cache \
        || echo "⚠️  pip-audit text report completed with warnings"

    # Safety scan
    echo ""
    echo "🛡️  Running Safety vulnerability database scan..."
    safety check \
        --json \
        --output "${REPORTS_DIR}/safety_backend_${TIMESTAMP}.json" \
        --full-report \
        || echo "⚠️  Safety scan completed with warnings"

    # Safety human-readable report
    safety check \
        --output "${REPORTS_DIR}/safety_backend_${TIMESTAMP}.txt" \
        --full-report \
        || echo "⚠️  Safety text report completed with warnings"

    echo "✅ Backend Python dependencies scanned"
else
    echo "⚠️  Backend directory not found: ${BACKEND_DIR}"
fi

# Scan for any requirements.txt files in the project
echo ""
echo "🔍 Scanning for additional Python requirements files..."

find "${BASE_DIR}" -name "requirements*.txt" -o -name "pyproject.toml" -o -name "poetry.lock" | while read -r file; do
    echo "📄 Found: ${file}"

    file_basename=$(basename "${file}" | sed 's/[^a-zA-Z0-9._-]/_/g')
    relative_path=$(realpath --relative-to="${BASE_DIR}" "${file}" | sed 's/\//_/g')

    if [[ "${file}" == *.txt ]]; then
        echo "🛡️  Scanning requirements file: ${file}"

        # pip-audit for requirements files
        pip-audit \
            --requirement "${file}" \
            --format json \
            --output "${REPORTS_DIR}/pip-audit_${relative_path}_${TIMESTAMP}.json" \
            --desc \
            || echo "⚠️  pip-audit scan completed with warnings for ${file}"

        # Safety for requirements files
        safety check \
            --requirement "${file}" \
            --json \
            --output "${REPORTS_DIR}/safety_${relative_path}_${TIMESTAMP}.json" \
            --full-report \
            || echo "⚠️  Safety scan completed with warnings for ${file}"

    elif [[ "${file}" == *pyproject.toml ]]; then
        echo "🛡️  Scanning pyproject.toml: ${file}"

        # For pyproject.toml, scan the directory
        file_dir=$(dirname "${file}")
        cd "${file_dir}"

        pip-audit \
            --format json \
            --output "${REPORTS_DIR}/pip-audit_${relative_path}_${TIMESTAMP}.json" \
            --desc \
            || echo "⚠️  pip-audit scan completed with warnings for ${file}"
    fi
done

# Generate consolidated summary report
echo ""
echo "📊 Generating consolidated Python security summary..."

python3 << 'EOF'
import json
import glob
import os
from datetime import datetime

reports_dir = "/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

# Find all pip-audit JSON reports from this session
pip_audit_files = glob.glob(f"{reports_dir}/pip-audit_*_{os.environ.get('TIMESTAMP', '*')}.json")
safety_files = glob.glob(f"{reports_dir}/safety_*_{os.environ.get('TIMESTAMP', '*')}.json")

print("=" * 50)
print("PYTHON SECURITY ASSESSMENT SUMMARY")
print("=" * 50)

total_vulnerabilities = 0
critical_vulns = 0
high_vulns = 0
medium_vulns = 0
low_vulns = 0

# Process pip-audit reports
for file_path in pip_audit_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        if isinstance(data, list):
            vulns = data
        else:
            vulns = data.get('vulnerabilities', [])

        print(f"\n📄 {os.path.basename(file_path)}: {len(vulns)} vulnerabilities")

        for vuln in vulns:
            total_vulnerabilities += 1
            severity = vuln.get('severity', 'unknown').lower()
            if severity in ['critical']:
                critical_vulns += 1
            elif severity in ['high']:
                high_vulns += 1
            elif severity in ['medium']:
                medium_vulns += 1
            else:
                low_vulns += 1

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process Safety reports
for file_path in safety_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        vulns = data.get('vulnerabilities', data if isinstance(data, list) else [])
        print(f"\n📄 {os.path.basename(file_path)}: {len(vulns)} Safety vulnerabilities")

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

print("\n" + "=" * 50)
print("OVERALL PYTHON SECURITY SUMMARY")
print("=" * 50)
print(f"🚨 Critical: {critical_vulns}")
print(f"⚠️  High: {high_vulns}")
print(f"⚠️  Medium: {medium_vulns}")
print(f"ℹ️  Low/Other: {low_vulns}")
print(f"📊 Total Vulnerabilities: {total_vulnerabilities}")

if total_vulnerabilities == 0:
    print("✅ No Python dependency vulnerabilities found!")
elif critical_vulns > 0:
    print("🚨 URGENT: Critical vulnerabilities require immediate attention")
elif high_vulns > 0:
    print("⚠️  High priority vulnerabilities should be addressed soon")
else:
    print("✅ No critical or high priority vulnerabilities found")

EOF

deactivate

echo ""
echo "==============================================="
echo "Python Security Assessment Complete"
echo "Time: $(date)"
echo "Reports available in: ${REPORTS_DIR}/"
echo "==============================================="