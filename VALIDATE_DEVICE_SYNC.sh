#!/bin/bash
# aclue Project - Device Synchronization Validation Script
# This script validates that the device sync setup is complete and comprehensive

echo "=== aclue Device Synchronization Validation ==="
echo "This script validates the completeness of the device sync setup"
echo ""

# Initialize validation tracking
total_checks=0
passed_checks=0
failed_checks=0
warnings=0

validate_check() {
    local description="$1"
    local test_command="$2"
    local is_critical="$3"  # "critical" or "warning"
    
    total_checks=$((total_checks + 1))
    echo -n "Checking: $description... "
    
    if eval "$test_command" &>/dev/null; then
        echo "✓ PASS"
        passed_checks=$((passed_checks + 1))
        return 0
    else
        if [ "$is_critical" = "critical" ]; then
            echo "✗ FAIL"
            failed_checks=$((failed_checks + 1))
        else
            echo "⚠ WARNING"
            warnings=$((warnings + 1))
        fi
        return 1
    fi
}

echo "1. Validating Documentation Files"
echo "================================="

validate_check "DEVICE_SYNC_SETUP.md exists" "test -f DEVICE_SYNC_SETUP.md" "critical"
validate_check "aclue-setup-files.zip exists" "test -f aclue-setup-files.zip" "critical"
validate_check "CLAUDE.md exists (critical project instructions)" "test -f CLAUDE.md" "critical"

echo ""
echo "2. Validating ZIP Package Contents"
echo "=================================="

# Test ZIP package contents
if [ -f "aclue-setup-files.zip" ]; then
    validate_check "ZIP contains backend environment file" "unzip -l aclue-setup-files.zip | grep -q backend_env" "critical"
    validate_check "ZIP contains web environment file" "unzip -l aclue-setup-files.zip | grep -q web_env_local" "critical"
    validate_check "ZIP contains setup README" "unzip -l aclue-setup-files.zip | grep -q SETUP_PACKAGE_README.txt" "warning"
    validate_check "ZIP contains extraction script" "unzip -l aclue-setup-files.zip | grep -q extraction_script.sh" "warning"
    validate_check "ZIP contains venv setup script" "unzip -l aclue-setup-files.zip | grep -q venv_setup.sh" "warning"
else
    echo "✗ Cannot validate ZIP contents - file missing"
    failed_checks=$((failed_checks + 5))
    total_checks=$((total_checks + 5))
fi

echo ""
echo "3. Validating Project Structure"
echo "==============================="

validate_check "Backend directory exists" "test -d backend" "critical"
validate_check "Web directory exists" "test -d web" "critical"
validate_check "Backend requirements.txt exists" "test -f backend/requirements.txt" "critical"
validate_check "Web package.json exists" "test -f web/package.json" "critical"
validate_check "Database schema files exist" "test -d database" "warning"
validate_check "Documentation directory exists" "test -d docs" "warning"

echo ""
echo "4. Validating Current Environment Files"
echo "======================================="

validate_check "Backend .env exists" "test -f backend/.env" "warning"
validate_check "Backend .env.production exists" "test -f backend/.env.production" "warning"
validate_check "Web .env.local exists" "test -f web/.env.local" "warning"
validate_check "Backend virtual environment exists" "test -d backend/venv" "warning"

echo ""
echo "5. Validating Critical Documentation Content"
echo "============================================="

if [ -f "DEVICE_SYNC_SETUP.md" ]; then
    validate_check "Documentation mentions context-manager activation" "grep -q 'start project management' DEVICE_SYNC_SETUP.md" "critical"
    validate_check "Documentation includes verification checklist" "grep -q 'Verification Checklist' DEVICE_SYNC_SETUP.md" "critical"
    validate_check "Documentation includes troubleshooting" "grep -q 'Troubleshooting' DEVICE_SYNC_SETUP.md" "warning"
    validate_check "Documentation includes environment variables" "grep -q 'Environment Variables' DEVICE_SYNC_SETUP.md" "critical"
    validate_check "Documentation includes backend setup steps" "grep -q 'Backend Environment Setup' DEVICE_SYNC_SETUP.md" "critical"
    validate_check "Documentation includes frontend setup steps" "grep -q 'Frontend Environment Setup' DEVICE_SYNC_SETUP.md" "critical"
else
    echo "✗ Cannot validate documentation content - file missing"
    failed_checks=$((failed_checks + 6))
    total_checks=$((total_checks + 6))
fi

echo ""
echo "6. Validating Project Management Instructions"
echo "============================================="

if [ -f "CLAUDE.md" ]; then
    validate_check "CLAUDE.md contains critical startup instructions" "grep -q 'CRITICAL SESSION STARTUP INSTRUCTIONS' CLAUDE.md" "critical"
    validate_check "CLAUDE.md contains project management activation" "grep -q 'start project management' CLAUDE.md" "critical"
    validate_check "CLAUDE.md contains rebranding information" "grep -q 'aclue' CLAUDE.md" "warning"
    validate_check "CLAUDE.md contains authentication system docs" "grep -q 'Authentication System' CLAUDE.md" "warning"
else
    echo "✗ Cannot validate CLAUDE.md content - file missing"
    failed_checks=$((failed_checks + 4))
    total_checks=$((total_checks + 4))
fi

echo ""
echo "7. Testing ZIP Extraction Process"
echo "================================="

# Create test directory and test extraction
if [ -f "aclue-setup-files.zip" ]; then
    mkdir -p test_extraction
    cd test_extraction
    
    validate_check "ZIP file can be extracted" "unzip -q ../aclue-setup-files.zip" "critical"
    validate_check "Extraction script is executable" "test -x extraction_script.sh" "warning"
    validate_check "VENV setup script is executable" "test -x venv_setup.sh" "warning"
    validate_check "Backend env file content is valid" "grep -q DATABASE_URL backend_env" "critical"
    validate_check "Web env file content is valid" "grep -q NEXT_PUBLIC_API_URL web_env_local" "critical"
    
    cd ..
    rm -rf test_extraction
else
    echo "✗ Cannot test ZIP extraction - file missing"
    failed_checks=$((failed_checks + 5))
    total_checks=$((total_checks + 5))
fi

echo ""
echo "=== VALIDATION RESULTS ==="
echo "Total checks: $total_checks"
echo "Passed: $passed_checks"
echo "Failed: $failed_checks"
echo "Warnings: $warnings"
echo ""

# Calculate success rate
if [ $total_checks -gt 0 ]; then
    success_rate=$(( (passed_checks * 100) / total_checks ))
    echo "Success Rate: $success_rate%"
else
    success_rate=0
    echo "Success Rate: 0% (no checks performed)"
fi

echo ""
if [ $failed_checks -eq 0 ]; then
    echo "🎉 VALIDATION PASSED - Device sync setup is complete and ready!"
    echo ""
    echo "Next steps for device synchronization:"
    echo "1. Push both files to git repository"
    echo "2. Clone repository on new device"
    echo "3. Extract aclue-setup-files.zip"
    echo "4. Follow DEVICE_SYNC_SETUP.md instructions"
    echo "5. Execute 'start project management' to activate context-manager"
    exit 0
elif [ $failed_checks -le 2 ] && [ $success_rate -ge 85 ]; then
    echo "✅ VALIDATION MOSTLY PASSED - Minor issues detected but setup should work"
    echo "Review the failed checks above and address critical issues"
    exit 0
else
    echo "❌ VALIDATION FAILED - Critical issues prevent reliable device sync"
    echo "Address the failed critical checks before proceeding"
    exit 1
fi