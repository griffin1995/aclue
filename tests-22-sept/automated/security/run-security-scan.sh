#!/bin/bash

# Quick-start Security Scanning Script
# Purpose: Easy execution of security scans for aclue platform

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================"
echo "aclue Platform Security Scanner"
echo "======================================"
echo ""

# Check for scan type
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [scan-type]"
    echo ""
    echo "Scan types:"
    echo "  quick     - Quick security scan (critical issues only)"
    echo "  standard  - Standard security scan (default)"
    echo "  full      - Comprehensive deep scan (takes longer)"
    echo "  semgrep   - Run only Semgrep source code analysis"
    echo "  nuclei    - Run only Nuclei vulnerability scan"
    echo "  trivy     - Run only Trivy container/filesystem scan"
    echo "  zap       - Run only OWASP ZAP scan"
    echo "  secrets   - Run only secret detection"
    echo ""
    echo "Examples:"
    echo "  $0          # Run standard scan"
    echo "  $0 quick    # Run quick scan"
    echo "  $0 full     # Run comprehensive scan"
    exit 0
fi

SCAN_TYPE="${1:-standard}"

case "$SCAN_TYPE" in
    quick)
        echo "Starting QUICK security scan..."
        "$SCRIPT_DIR/scripts/master-security-scan.sh" --quick
        ;;
    full)
        echo "Starting FULL comprehensive security scan..."
        echo "This may take 30-60 minutes to complete."
        "$SCRIPT_DIR/scripts/master-security-scan.sh" --full
        ;;
    semgrep)
        echo "Running Semgrep source code analysis..."
        source /home/jack/Documents/aclue-preprod/security-venv/bin/activate
        semgrep --config=auto --config=p/security-audit --config=p/owasp-top-ten /home/jack/Documents/aclue-preprod
        ;;
    nuclei)
        echo "Running Nuclei vulnerability scan..."
        /home/jack/Documents/aclue-preprod/security-venv/bin/nuclei -target https://aclue.app -severity critical,high,medium
        ;;
    trivy)
        echo "Running Trivy security scan..."
        docker run --rm -v /home/jack/Documents/aclue-preprod:/project aquasec/trivy:latest fs /project
        ;;
    zap)
        echo "Running OWASP ZAP scan..."
        docker run --rm -t zaproxy/zap-stable zap-baseline.py -t https://aclue.app
        ;;
    secrets)
        echo "Running secret detection..."
        source /home/jack/Documents/aclue-preprod/security-venv/bin/activate
        detect-secrets scan --all-files /home/jack/Documents/aclue-preprod
        ;;
    standard|*)
        echo "Starting STANDARD security scan..."
        "$SCRIPT_DIR/scripts/master-security-scan.sh"
        ;;
esac

echo ""
echo "======================================"
echo "Security scan completed!"
echo "Check reports in: $SCRIPT_DIR/reports/"
echo "======================================"