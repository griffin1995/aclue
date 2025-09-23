#!/bin/bash

# Quick Test Runner for All Infrastructure Validation Tools
# Tests each tool individually to verify installation and configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TOOLS_DIR="$SCRIPT_DIR/tools"
REPORTS_DIR="$SCRIPT_DIR/reports"

mkdir -p "$REPORTS_DIR"

echo "🧪 Testing All Infrastructure Validation Tools"
echo "============================================="

# Test Hadolint
echo "Testing Hadolint..."
if [[ -x "$TOOLS_DIR/hadolint" ]]; then
    "$TOOLS_DIR/hadolint" --version
    echo "✅ Hadolint OK"
else
    echo "❌ Hadolint not found"
fi

# Test Dockle
echo "Testing Dockle..."
if [[ -x "$TOOLS_DIR/dockle" ]]; then
    "$TOOLS_DIR/dockle" --version
    echo "✅ Dockle OK"
else
    echo "❌ Dockle not found"
fi

# Test Gitleaks
echo "Testing Gitleaks..."
if [[ -x "$TOOLS_DIR/gitleaks" ]]; then
    "$TOOLS_DIR/gitleaks" version
    echo "✅ Gitleaks OK"
else
    echo "❌ Gitleaks not found"
fi

# Test tfsec
echo "Testing tfsec..."
if [[ -x "$TOOLS_DIR/tfsec" ]]; then
    "$TOOLS_DIR/tfsec" --version
    echo "✅ tfsec OK"
else
    echo "❌ tfsec not found"
fi

# Test Terrascan
echo "Testing Terrascan..."
if [[ -x "$TOOLS_DIR/terrascan" ]]; then
    "$TOOLS_DIR/terrascan" version
    echo "✅ Terrascan OK"
else
    echo "❌ Terrascan not found"
fi

# Test Python tools in venv
echo "Testing Python tools..."
if [[ -f "$SCRIPT_DIR/venv/bin/activate" ]]; then
    source "$SCRIPT_DIR/venv/bin/activate"
    
    # Test Checkov
    if [[ -f "$SCRIPT_DIR/venv/bin/checkov" ]]; then
        checkov --version
        echo "✅ Checkov OK"
    else
        echo "❌ Checkov not found"
    fi
    
    # Test detect-secrets
    if [[ -f "$SCRIPT_DIR/venv/bin/detect-secrets" ]]; then
        detect-secrets --version
        echo "✅ detect-secrets OK"
    else
        echo "❌ detect-secrets not found"
    fi
    
    # Test TruffleHog
    if command -v trufflehog &> /dev/null; then
        trufflehog --version
        echo "✅ TruffleHog OK"
    else
        echo "❌ TruffleHog not found"
    fi
    
    deactivate
else
    echo "❌ Python virtual environment not found"
fi

# Test KICS
echo "Testing KICS..."
if command -v kics &> /dev/null; then
    kics version
    echo "✅ KICS OK"
else
    echo "❌ KICS not found"
fi

# Test Docker Scout (if Docker is available)
echo "Testing Docker Scout..."
if command -v docker &> /dev/null; then
    docker scout version 2>/dev/null || echo "Docker Scout plugin not available"
    echo "✅ Docker available for Scout"
else
    echo "❌ Docker not available"
fi

echo ""
echo "🎯 Quick Functionality Test"
echo "=========================="

# Create a test report directory
TEST_REPORTS="$REPORTS_DIR/test-$(date +%s)"
mkdir -p "$TEST_REPORTS"

# Quick Gitleaks test on current directory
echo "Running quick Gitleaks test..."
cd "$PROJECT_ROOT"
"$TOOLS_DIR/gitleaks" detect \
    --no-git \
    --source . \
    --report-path "$TEST_REPORTS/gitleaks-test.json" \
    --report-format json \
    --verbose || echo "Gitleaks test completed (may have found secrets)"

# Quick Hadolint test (find any Dockerfile)
DOCKERFILE=$(find "$PROJECT_ROOT" -name "Dockerfile*" -type f | head -1)
if [[ -n "$DOCKERFILE" ]]; then
    echo "Running quick Hadolint test on $DOCKERFILE..."
    "$TOOLS_DIR/hadolint" --format json "$DOCKERFILE" > "$TEST_REPORTS/hadolint-test.json" || echo "Hadolint test completed"
fi

# Quick Checkov test
echo "Running quick Checkov test..."
source "$SCRIPT_DIR/venv/bin/activate"
checkov \
    --directory "$PROJECT_ROOT" \
    --output json \
    --output-file "$TEST_REPORTS/checkov-test.json" \
    --quiet \
    --compact || echo "Checkov test completed"
deactivate

echo ""
echo "✅ All tool tests completed!"
echo "📁 Test reports saved to: $TEST_REPORTS"
echo ""
echo "🚀 Ready to run full infrastructure validation with:"
echo "   ./validate-infrastructure.sh"