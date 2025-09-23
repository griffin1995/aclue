#!/bin/bash
# Installation Validation Script
# Validates all security tools are properly installed and configured

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="${SCRIPT_DIR}/tools"
VENV_PATH="${SCRIPT_DIR}/security-tools-venv"

echo "==============================================="
echo "🔍 Database Security Tools Installation Validation"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to check and report status
check_tool() {
    local tool_name="$1"
    local check_command="$2"
    local description="$3"

    ((TOTAL_CHECKS++))
    echo -n "🔍 Checking ${tool_name}... "

    if eval "${check_command}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC} - ${description}"
        ((PASSED_CHECKS++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} - ${description}"
        return 1
    fi
}

# 1. Check directory structure
echo ""
echo "📁 DIRECTORY STRUCTURE"
echo "----------------------------------------"

check_tool "Base Directory" "[[ -d '${SCRIPT_DIR}' ]]" "Main automation directory exists"
check_tool "Tools Directory" "[[ -d '${TOOLS_DIR}' ]]" "Security tools directory exists"
check_tool "Reports Directory" "[[ -d '${SCRIPT_DIR}/reports' ]] || mkdir -p '${SCRIPT_DIR}/reports'" "Reports directory exists or created"

# 2. Check PGDSAT
echo ""
echo "🛡️  PGDSAT (KloudDB Shield)"
echo "----------------------------------------"

check_tool "PGDSAT Binary" "[[ -x '${TOOLS_DIR}/ciscollector' ]]" "CIS collector executable exists"
check_tool "PGDSAT Version" "'${TOOLS_DIR}/ciscollector' --version" "Can execute PGDSAT version check"

# 3. Check Python tools
echo ""
echo "🐍 PYTHON SECURITY TOOLS"
echo "----------------------------------------"

check_tool "Python venv" "[[ -d '${VENV_PATH}' ]]" "Python virtual environment exists"
check_tool "pip-audit" "source '${VENV_PATH}/bin/activate' && pip-audit --version" "pip-audit is installed and working"
check_tool "Safety" "source '${VENV_PATH}/bin/activate' && safety --version" "Safety is installed and working"
check_tool "SQLFluff" "source '${VENV_PATH}/bin/activate' && sqlfluff --version" "SQLFluff is installed and working"

# 4. Check Node.js tools
echo ""
echo "📦 NODE.JS SECURITY TOOLS"
echo "----------------------------------------"

check_tool "npm audit" "npm audit --version" "npm audit is available"
check_tool "Snyk CLI" "snyk --version" "Snyk CLI is installed"
check_tool "Retire.js" "retire --version" "Retire.js is installed"

# 5. Check OSV-Scanner
echo ""
echo "🔍 OPEN SOURCE VULNERABILITY SCANNER"
echo "----------------------------------------"

check_tool "OSV-Scanner Binary" "[[ -x '${TOOLS_DIR}/osv-scanner_linux_amd64' ]]" "OSV-Scanner binary is executable"
check_tool "OSV-Scanner Version" "'${TOOLS_DIR}/osv-scanner_linux_amd64' --version" "OSV-Scanner can execute version check"

# 6. Check scripts
echo ""
echo "📜 SECURITY SCANNING SCRIPTS"
echo "----------------------------------------"

scripts=(
    "pgdsat-scan.sh:PostgreSQL CIS benchmark scanning"
    "python-security-scan.sh:Python dependency vulnerability scanning"
    "nodejs-security-scan.sh:Node.js dependency vulnerability scanning"
    "sql-security-scan.sh:SQL code security and quality analysis"
    "master-security-scan.sh:Master orchestration script"
)

for script_spec in "${scripts[@]}"; do
    IFS=':' read -r script_name script_desc <<< "${script_spec}"
    check_tool "${script_name}" "[[ -x '${SCRIPT_DIR}/${script_name}' ]]" "${script_desc} script is executable"
done

# 7. Check configuration
echo ""
echo "⚙️  CONFIGURATION FILES"
echo "----------------------------------------"

check_tool "Security Config" "[[ -f '${SCRIPT_DIR}/security-config.env' ]]" "Security configuration file exists"
check_tool "Documentation" "[[ -f '${SCRIPT_DIR}/README.md' ]]" "README documentation exists"

# 8. Test basic functionality
echo ""
echo "🧪 BASIC FUNCTIONALITY TESTS"
echo "----------------------------------------"

# Test Python tools in virtual environment
if source "${VENV_PATH}/bin/activate" 2>/dev/null; then
    check_tool "pip-audit test" "echo 'requests==2.0.0' | pip-audit --requirement /dev/stdin --format json" "pip-audit can scan simple requirement"
    check_tool "SQLFluff test" "echo 'select * from test;' | sqlfluff lint --dialect postgres -" "SQLFluff can lint simple SQL"
    deactivate 2>/dev/null || true
else
    echo -e "${RED}❌ FAIL${NC} - Cannot activate Python virtual environment"
    ((TOTAL_CHECKS += 2))
fi

# Test Node.js tools
if command -v npm >/dev/null 2>&1; then
    cd "${SCRIPT_DIR}" && check_tool "npm audit test" "npm audit --audit-level info" "npm audit can scan current directory"
else
    echo -e "${RED}❌ FAIL${NC} - npm is not available"
    ((TOTAL_CHECKS++))
fi

# 9. Check for common issues
echo ""
echo "⚠️  COMMON ISSUES CHECK"
echo "----------------------------------------"

check_tool "Database host resolution" "nslookup db.usdgihyvmwxtbspkdmuj.supabase.co" "Can resolve Supabase database hostname"
check_tool "Python version" "[[ $(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2) == '3.12' ]]" "Python 3.12 is available"
check_tool "Node.js version" "node --version" "Node.js is installed and accessible"

# Final summary
echo ""
echo "==============================================="
echo "📊 VALIDATION SUMMARY"
echo "==============================================="

PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo -e "${BLUE}Total Checks: ${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}Passed: ${PASSED_CHECKS}${NC}"
echo -e "${RED}Failed: $((TOTAL_CHECKS - PASSED_CHECKS))${NC}"
echo -e "${BLUE}Success Rate: ${PERCENTAGE}%${NC}"

if [[ ${PERCENTAGE} -ge 90 ]]; then
    echo ""
    echo -e "${GREEN}🎉 EXCELLENT! Installation validation successful.${NC}"
    echo -e "${GREEN}✅ All critical security tools are properly installed and configured.${NC}"
    echo -e "${GREEN}🚀 Ready to run comprehensive database security assessments.${NC}"
elif [[ ${PERCENTAGE} -ge 75 ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  GOOD! Most tools are working, but some issues need attention.${NC}"
    echo -e "${YELLOW}🔧 Review failed checks above and resolve any missing components.${NC}"
else
    echo ""
    echo -e "${RED}❌ POOR! Significant issues detected with the installation.${NC}"
    echo -e "${RED}🛠️  Multiple tools need to be installed or configured properly.${NC}"
    echo -e "${RED}📋 Review the failed checks and re-run installation steps.${NC}"
fi

echo ""
echo "==============================================="
echo "🚀 NEXT STEPS"
echo "==============================================="

if [[ ${PERCENTAGE} -ge 90 ]]; then
    echo "1. ✅ Set database credentials: export SUPABASE_DB_PASSWORD='your_password'"
    echo "2. ✅ Source configuration: source security-config.env"
    echo "3. ✅ Run security scan: ./master-security-scan.sh"
    echo "4. ✅ Review reports in: ./reports/"
    echo "5. ✅ Set up automated scanning schedule"
else
    echo "1. 🔧 Fix failed tool installations"
    echo "2. 🔧 Re-run validation: ./validate-installation.sh"
    echo "3. 🔧 Check individual tool documentation"
    echo "4. 🔧 Verify network connectivity and permissions"
    echo "5. 🔧 Contact support if issues persist"
fi

echo ""
echo "==============================================="

# Exit with appropriate code
if [[ ${PERCENTAGE} -ge 75 ]]; then
    exit 0
else
    exit 1
fi