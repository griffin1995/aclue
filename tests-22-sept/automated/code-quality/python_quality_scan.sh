#!/bin/bash

# Python Code Quality Scanner - Comprehensive Analysis
# Runs all Python code quality tools with maximum analysis depth

set -e

# Configuration
PROJECT_ROOT="/home/jack/Documents/aclue-preprod"
BACKEND_DIR="$PROJECT_ROOT/backend"
CONFIG_DIR="$PROJECT_ROOT/tests-22-sept/automated/code-quality/configs"
REPORTS_DIR="$PROJECT_ROOT/tests-22-sept/automated/code-quality/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Python Code Quality Analysis Suite   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Timestamp: ${TIMESTAMP}"
echo -e "Backend Directory: ${BACKEND_DIR}"
echo -e "Reports Directory: ${REPORTS_DIR}"
echo ""

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

# Change to backend directory and activate virtual environment
cd "$BACKEND_DIR"

# Check if virtual environment exists and activate it
if [ -d "venv" ]; then
    echo -e "${GREEN}Activating Python virtual environment...${NC}"
    source venv/bin/activate
else
    echo -e "${RED}Error: Virtual environment not found at $BACKEND_DIR/venv${NC}"
    exit 1
fi

# Function to run a tool and capture results
run_tool() {
    local tool_name="$1"
    local command="$2"
    local output_file="$3"
    local description="$4"

    echo -e "${YELLOW}Running ${tool_name}: ${description}${NC}"
    echo "Command: $command"
    echo "Output: $output_file"

    if eval "$command" > "$output_file" 2>&1; then
        echo -e "${GREEN}✓ ${tool_name} completed successfully${NC}"
        echo "Report saved to: $output_file"
    else
        local exit_code=$?
        echo -e "${YELLOW}⚠ ${tool_name} completed with warnings/errors (exit code: $exit_code)${NC}"
        echo "Report saved to: $output_file"
    fi
    echo ""
}

# 1. RUFF - Ultra-fast Python linting and formatting
echo -e "${BLUE}1. Running Ruff Analysis${NC}"
run_tool "Ruff Check" \
    "ruff check --config '$CONFIG_DIR/ruff.toml' --output-format=json ." \
    "$REPORTS_DIR/ruff_check_${TIMESTAMP}.json" \
    "Ultra-fast linting with 800+ rules"

run_tool "Ruff Format Check" \
    "ruff format --config '$CONFIG_DIR/ruff.toml' --check --diff ." \
    "$REPORTS_DIR/ruff_format_${TIMESTAMP}.txt" \
    "Code formatting analysis"

# 2. PYLINT - Comprehensive Python analysis
echo -e "${BLUE}2. Running Pylint Analysis${NC}"
run_tool "Pylint" \
    "pylint --rcfile='$CONFIG_DIR/pylint.cfg' --output-format=json --reports=yes app/" \
    "$REPORTS_DIR/pylint_${TIMESTAMP}.json" \
    "Comprehensive code analysis with metrics"

# 3. BLACK - Code formatting analysis
echo -e "${BLUE}3. Running Black Analysis${NC}"
run_tool "Black" \
    "black --config '$CONFIG_DIR/pyproject.toml' --check --diff --color ." \
    "$REPORTS_DIR/black_${TIMESTAMP}.txt" \
    "Code formatting consistency check"

# 4. ISORT - Import sorting analysis
echo -e "${BLUE}4. Running isort Analysis${NC}"
run_tool "isort" \
    "isort --settings-path='$CONFIG_DIR/pyproject.toml' --check-only --diff --color ." \
    "$REPORTS_DIR/isort_${TIMESTAMP}.txt" \
    "Import statement organisation"

# 5. MYPY - Static type checking
echo -e "${BLUE}5. Running mypy Type Analysis${NC}"
run_tool "mypy" \
    "mypy --config-file='$CONFIG_DIR/pyproject.toml' --no-error-summary app/" \
    "$REPORTS_DIR/mypy_${TIMESTAMP}.txt" \
    "Static type checking analysis"

# 6. BANDIT - Security analysis
echo -e "${BLUE}6. Running Bandit Security Analysis${NC}"
run_tool "Bandit" \
    "bandit -c '$CONFIG_DIR/pyproject.toml' -f json -o '$REPORTS_DIR/bandit_${TIMESTAMP}.json' -r app/" \
    "$REPORTS_DIR/bandit_output_${TIMESTAMP}.txt" \
    "Security vulnerability scanning"

# 7. Additional metrics and complexity analysis
echo -e "${BLUE}7. Running Additional Analysis${NC}"

# Radon - Code complexity metrics
if command -v radon &> /dev/null; then
    run_tool "Radon Complexity" \
        "radon cc app/ --json" \
        "$REPORTS_DIR/radon_complexity_${TIMESTAMP}.json" \
        "Cyclomatic complexity analysis"

    run_tool "Radon Maintainability" \
        "radon mi app/ --json" \
        "$REPORTS_DIR/radon_maintainability_${TIMESTAMP}.json" \
        "Maintainability index analysis"
else
    echo -e "${YELLOW}Radon not installed, skipping complexity analysis${NC}"
fi

# Vulture - Dead code detection
if command -v vulture &> /dev/null; then
    run_tool "Vulture" \
        "vulture app/ --json" \
        "$REPORTS_DIR/vulture_${TIMESTAMP}.json" \
        "Dead code detection"
else
    echo -e "${YELLOW}Vulture not installed, skipping dead code analysis${NC}"
fi

# Generate summary report
echo -e "${BLUE}8. Generating Summary Report${NC}"
cat > "$REPORTS_DIR/python_quality_summary_${TIMESTAMP}.md" << EOF
# Python Code Quality Analysis Summary

**Analysis Date:** $(date)
**Backend Directory:** $BACKEND_DIR
**Configuration Directory:** $CONFIG_DIR

## Tools Executed

1. **Ruff** - Ultra-fast Python linting (800+ rules)
   - Check report: \`ruff_check_${TIMESTAMP}.json\`
   - Format report: \`ruff_format_${TIMESTAMP}.txt\`

2. **Pylint** - Comprehensive code analysis
   - Report: \`pylint_${TIMESTAMP}.json\`

3. **Black** - Code formatting consistency
   - Report: \`black_${TIMESTAMP}.txt\`

4. **isort** - Import statement organisation
   - Report: \`isort_${TIMESTAMP}.txt\`

5. **mypy** - Static type checking
   - Report: \`mypy_${TIMESTAMP}.txt\`

6. **Bandit** - Security vulnerability scanning
   - Report: \`bandit_${TIMESTAMP}.json\`

## Analysis Scope

- **Target Directory:** \`app/\` (FastAPI backend)
- **Configuration Files:** Custom configurations with maximum rule sets
- **File Types:** \`.py\`, \`.pyi\` files
- **Exclusions:** Virtual environments, cache directories, migrations

## Next Steps

1. Review individual tool reports for detailed findings
2. Prioritise security issues from Bandit report
3. Address high-complexity functions identified by Pylint/Radon
4. Fix type checking issues from mypy report
5. Apply formatting fixes from Black and isort

## Report Files

All reports are saved in: \`$REPORTS_DIR\`

EOF

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Python Code Quality Analysis Complete ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Summary report: ${REPORTS_DIR}/python_quality_summary_${TIMESTAMP}.md"
echo -e "All reports saved to: ${REPORTS_DIR}"
echo ""

# Count total issues found
echo -e "${BLUE}Issue Summary:${NC}"
if [ -f "$REPORTS_DIR/ruff_check_${TIMESTAMP}.json" ]; then
    RUFF_ISSUES=$(jq '. | length' "$REPORTS_DIR/ruff_check_${TIMESTAMP}.json" 2>/dev/null || echo "0")
    echo -e "Ruff issues: ${RUFF_ISSUES}"
fi

if [ -f "$REPORTS_DIR/bandit_${TIMESTAMP}.json" ]; then
    BANDIT_ISSUES=$(jq '.results | length' "$REPORTS_DIR/bandit_${TIMESTAMP}.json" 2>/dev/null || echo "0")
    echo -e "Security issues: ${BANDIT_ISSUES}"
fi

echo ""
echo -e "${GREEN}Analysis completed at $(date)${NC}"