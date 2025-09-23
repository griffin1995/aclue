#!/bin/bash
# Node.js Dependencies Security Scanner
# Uses npm audit, Snyk, Retire.js, and OSV-Scanner for comprehensive JavaScript vulnerability analysis

set -euo pipefail

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
TOOLS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/tools"
REPORTS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

echo "==============================================="
echo "Node.js Dependencies Security Assessment"
echo "Timestamp: $(date)"
echo "Project: ${BASE_DIR}"
echo "==============================================="

# Ensure reports directory exists
mkdir -p "${REPORTS_DIR}"

# Function to scan a Node.js project directory
scan_nodejs_project() {
    local project_dir="$1"
    local project_name="$2"

    echo ""
    echo "🔍 Scanning Node.js project: ${project_name}"
    echo "📂 Directory: ${project_dir}"

    cd "${project_dir}"

    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        echo "⚠️  No package.json found in ${project_dir}"
        return 1
    fi

    # npm audit scan
    echo "🛡️  Running npm audit..."
    npm audit \
        --audit-level moderate \
        --json \
        > "${REPORTS_DIR}/npm-audit_${project_name}_${TIMESTAMP}.json" 2>/dev/null || true

    # npm audit human-readable report
    npm audit \
        --audit-level moderate \
        > "${REPORTS_DIR}/npm-audit_${project_name}_${TIMESTAMP}.txt" 2>/dev/null || echo "npm audit completed with warnings"

    # Snyk scan (if authenticated)
    echo "🛡️  Running Snyk vulnerability scan..."
    if snyk auth --check > /dev/null 2>&1; then
        snyk test \
            --json \
            --file=package.json \
            > "${REPORTS_DIR}/snyk_${project_name}_${TIMESTAMP}.json" 2>/dev/null || echo "⚠️  Snyk scan completed with findings"

        snyk test \
            --file=package.json \
            > "${REPORTS_DIR}/snyk_${project_name}_${TIMESTAMP}.txt" 2>/dev/null || echo "⚠️  Snyk text report completed with findings"
    else
        echo "ℹ️  Skipping Snyk scan - not authenticated. Run 'snyk auth' to enable."
        echo "Visit: https://snyk.io/login" > "${REPORTS_DIR}/snyk_${project_name}_${TIMESTAMP}_auth_required.txt"
    fi

    # Retire.js scan
    echo "🛡️  Running Retire.js vulnerable library scan..."
    retire \
        --outputformat json \
        --outputpath "${REPORTS_DIR}/retire_${project_name}_${TIMESTAMP}.json" \
        --path . \
        --verbose || echo "⚠️  Retire.js scan completed with findings"

    # Retire.js human-readable report
    retire \
        --path . \
        --verbose \
        > "${REPORTS_DIR}/retire_${project_name}_${TIMESTAMP}.txt" 2>&1 || echo "⚠️  Retire.js text report completed with findings"

    # OSV-Scanner scan
    echo "🛡️  Running OSV-Scanner for open source vulnerabilities..."
    "${TOOLS_DIR}/osv-scanner_linux_amd64" \
        --format json \
        --output "${REPORTS_DIR}/osv-scanner_${project_name}_${TIMESTAMP}.json" \
        . || echo "⚠️  OSV-Scanner completed with findings"

    "${TOOLS_DIR}/osv-scanner_linux_amd64" \
        --output "${REPORTS_DIR}/osv-scanner_${project_name}_${TIMESTAMP}.txt" \
        . || echo "⚠️  OSV-Scanner text report completed with findings"

    echo "✅ ${project_name} Node.js dependencies scanned"
}

# Scan web frontend
WEB_DIR="${BASE_DIR}/web"
if [[ -d "${WEB_DIR}" ]]; then
    scan_nodejs_project "${WEB_DIR}" "web-frontend"
else
    echo "⚠️  Web frontend directory not found: ${WEB_DIR}"
fi

# Look for other Node.js projects
echo ""
echo "🔍 Scanning for additional Node.js projects..."

find "${BASE_DIR}" -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*" | while read -r package_json; do
    project_dir=$(dirname "${package_json}")
    relative_path=$(realpath --relative-to="${BASE_DIR}" "${project_dir}")
    project_name=$(echo "${relative_path}" | sed 's/\//_/g')

    # Skip if already scanned
    if [[ "${project_dir}" != "${WEB_DIR}" ]]; then
        echo "📄 Found additional package.json: ${package_json}"
        scan_nodejs_project "${project_dir}" "${project_name}"
    fi
done

# Generate consolidated summary report
echo ""
echo "📊 Generating consolidated Node.js security summary..."

cd "${BASE_DIR}"

python3 << 'EOF'
import json
import glob
import os
from datetime import datetime

reports_dir = "/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
timestamp = os.environ.get('TIMESTAMP', datetime.now().strftime('%Y%m%d_%H%M%S'))

print("=" * 60)
print("NODE.JS SECURITY ASSESSMENT SUMMARY")
print("=" * 60)

# Process npm audit reports
npm_files = glob.glob(f"{reports_dir}/npm-audit_*_{timestamp}.json")
for file_path in npm_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        project_name = os.path.basename(file_path).replace(f'npm-audit_', '').replace(f'_{timestamp}.json', '')
        vulnerabilities = data.get('vulnerabilities', {})
        total_vulns = sum(vuln.get('via', []) if isinstance(vuln.get('via'), list) else 1 for vuln in vulnerabilities.values())

        print(f"\n📦 Project: {project_name}")
        print(f"   npm audit: {len(vulnerabilities)} packages with issues")
        if 'metadata' in data:
            print(f"   Dependencies: {data['metadata'].get('dependencies', 0)}")
            print(f"   Dev dependencies: {data['metadata'].get('devDependencies', 0)}")

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process Snyk reports
snyk_files = glob.glob(f"{reports_dir}/snyk_*_{timestamp}.json")
for file_path in snyk_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        project_name = os.path.basename(file_path).replace(f'snyk_', '').replace(f'_{timestamp}.json', '')
        vulns = data.get('vulnerabilities', [])

        print(f"\n🛡️  Snyk scan - {project_name}: {len(vulns)} vulnerabilities")

        severity_counts = {}
        for vuln in vulns:
            severity = vuln.get('severity', 'unknown')
            severity_counts[severity] = severity_counts.get(severity, 0) + 1

        for severity, count in sorted(severity_counts.items()):
            print(f"   {severity}: {count}")

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process Retire.js reports
retire_files = glob.glob(f"{reports_dir}/retire_*_{timestamp}.json")
for file_path in retire_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        project_name = os.path.basename(file_path).replace(f'retire_', '').replace(f'_{timestamp}.json', '')
        vulns = data if isinstance(data, list) else []

        print(f"\n🗄️  Retire.js scan - {project_name}: {len(vulns)} vulnerable libraries")

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process OSV-Scanner reports
osv_files = glob.glob(f"{reports_dir}/osv-scanner_*_{timestamp}.json")
for file_path in osv_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        project_name = os.path.basename(file_path).replace(f'osv-scanner_', '').replace(f'_{timestamp}.json', '')
        results = data.get('results', [])

        total_vulns = 0
        for result in results:
            packages = result.get('packages', [])
            for package in packages:
                vulns = package.get('vulnerabilities', [])
                total_vulns += len(vulns)

        print(f"\n🔍 OSV-Scanner - {project_name}: {total_vulns} open source vulnerabilities")

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

print("\n" + "=" * 60)
print("RECOMMENDATIONS:")
print("• Review high and critical severity vulnerabilities first")
print("• Run 'npm update' to update to latest secure versions")
print("• Consider using 'npm audit fix' for automatic fixes")
print("• Set up Snyk for continuous monitoring (requires authentication)")
print("=" * 60)

EOF

echo ""
echo "==============================================="
echo "Node.js Security Assessment Complete"
echo "Time: $(date)"
echo "Reports available in: ${REPORTS_DIR}/"
echo "==============================================="