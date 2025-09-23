#!/bin/bash

# TypeScript/JavaScript Code Quality Scanner - Comprehensive Analysis
# Runs all frontend code quality tools with maximum analysis depth

set -e

# Configuration
PROJECT_ROOT="/home/jack/Documents/aclue-preprod"
WEB_DIR="$PROJECT_ROOT/web"
CONFIG_DIR="$PROJECT_ROOT/tests-22-sept/automated/code-quality/configs"
REPORTS_DIR="$PROJECT_ROOT/tests-22-sept/automated/code-quality/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  TypeScript/JavaScript Quality Analysis   ${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "Timestamp: ${TIMESTAMP}"
echo -e "Web Directory: ${WEB_DIR}"
echo -e "Reports Directory: ${REPORTS_DIR}"
echo ""

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

# Change to web directory
cd "$WEB_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Error: node_modules not found. Run 'npm install' first.${NC}"
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

# 1. ESLINT - Comprehensive JavaScript/TypeScript linting
echo -e "${BLUE}1. Running ESLint Analysis${NC}"
run_tool "ESLint JSON" \
    "npx eslint --config '$CONFIG_DIR/.eslintrc.js' --format json --ext .js,.jsx,.ts,.tsx . || true" \
    "$REPORTS_DIR/eslint_${TIMESTAMP}.json" \
    "Comprehensive linting with all rules"

run_tool "ESLint HTML Report" \
    "npx eslint --config '$CONFIG_DIR/.eslintrc.js' --format html --ext .js,.jsx,.ts,.tsx . || true" \
    "$REPORTS_DIR/eslint_${TIMESTAMP}.html" \
    "HTML formatted linting report"

# 2. PRETTIER - Code formatting analysis
echo -e "${BLUE}2. Running Prettier Analysis${NC}"
run_tool "Prettier Check" \
    "npx prettier --config '$CONFIG_DIR/.prettierrc.js' --check --write=false '**/*.{js,jsx,ts,tsx,json,md,css,scss}' || true" \
    "$REPORTS_DIR/prettier_${TIMESTAMP}.txt" \
    "Code formatting consistency check"

# 3. TYPESCRIPT COMPILER - Type checking
echo -e "${BLUE}3. Running TypeScript Compiler Check${NC}"
run_tool "TypeScript tsc" \
    "npx tsc --noEmit --pretty false --incremental false" \
    "$REPORTS_DIR/typescript_${TIMESTAMP}.txt" \
    "TypeScript compilation and type checking"

# 4. NEXT.JS LINTING - Framework-specific rules
echo -e "${BLUE}4. Running Next.js Linting${NC}"
run_tool "Next.js Lint" \
    "npx next lint --format json || true" \
    "$REPORTS_DIR/nextjs_lint_${TIMESTAMP}.json" \
    "Next.js specific linting rules"

# 5. DEPENDENCY ANALYSIS - Security and outdated packages
echo -e "${BLUE}5. Running Dependency Analysis${NC}"
run_tool "npm audit" \
    "npm audit --json || true" \
    "$REPORTS_DIR/npm_audit_${TIMESTAMP}.json" \
    "Security vulnerability audit"

run_tool "npm outdated" \
    "npm outdated --json || true" \
    "$REPORTS_DIR/npm_outdated_${TIMESTAMP}.json" \
    "Outdated package analysis"

# 6. BUNDLE ANALYSIS - Build size and performance
echo -e "${BLUE}6. Running Bundle Analysis${NC}"
# Build analysis (if build exists)
if [ -d ".next" ]; then
    run_tool "Bundle Analyzer" \
        "npx @next/bundle-analyzer --format json . || true" \
        "$REPORTS_DIR/bundle_analysis_${TIMESTAMP}.json" \
        "Bundle size and dependency analysis"
else
    echo -e "${YELLOW}Next.js build not found, skipping bundle analysis${NC}"
fi

# 7. CODE COMPLEXITY ANALYSIS
echo -e "${BLUE}7. Running Complexity Analysis${NC}"

# TypeScript/JavaScript complexity analysis with plato (if available)
if command -v plato &> /dev/null; then
    run_tool "Plato Complexity" \
        "plato -r -d '$REPORTS_DIR/complexity_${TIMESTAMP}' -t 'Aclue Frontend Complexity' ." \
        "$REPORTS_DIR/plato_${TIMESTAMP}.txt" \
        "Code complexity and maintainability metrics"
else
    echo -e "${YELLOW}Plato not installed, skipping complexity analysis${NC}"
fi

# 8. ACCESSIBILITY ANALYSIS (if axe-core is available)
echo -e "${BLUE}8. Running Accessibility Analysis${NC}"
if npm list @axe-core/playwright &> /dev/null; then
    run_tool "Accessibility Check" \
        "npx playwright test --grep 'accessibility' || true" \
        "$REPORTS_DIR/accessibility_${TIMESTAMP}.txt" \
        "Accessibility compliance check"
else
    echo -e "${YELLOW}@axe-core/playwright not found, skipping accessibility analysis${NC}"
fi

# 9. PERFORMANCE ANALYSIS
echo -e "${BLUE}9. Running Performance Analysis${NC}"
# Check if Lighthouse CI is available
if npm list @lhci/cli &> /dev/null; then
    run_tool "Lighthouse CI" \
        "npx lhci autorun --config=.lighthouserc.json || true" \
        "$REPORTS_DIR/lighthouse_${TIMESTAMP}.json" \
        "Performance and SEO analysis"
else
    echo -e "${YELLOW}Lighthouse CI not configured, skipping performance analysis${NC}"
fi

# 10. CODE STYLE ANALYSIS
echo -e "${BLUE}10. Running Code Style Analysis${NC}"
# Check for consistent file naming
run_tool "File Naming Check" \
    "find . -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | grep -E '(\.|\-)' | sort" \
    "$REPORTS_DIR/file_naming_${TIMESTAMP}.txt" \
    "File naming convention analysis"

# Generate summary report
echo -e "${BLUE}11. Generating Summary Report${NC}"
cat > "$REPORTS_DIR/typescript_quality_summary_${TIMESTAMP}.md" << EOF
# TypeScript/JavaScript Code Quality Analysis Summary

**Analysis Date:** $(date)
**Web Directory:** $WEB_DIR
**Configuration Directory:** $CONFIG_DIR

## Tools Executed

1. **ESLint** - Comprehensive JavaScript/TypeScript linting
   - JSON report: \`eslint_${TIMESTAMP}.json\`
   - HTML report: \`eslint_${TIMESTAMP}.html\`

2. **Prettier** - Code formatting consistency
   - Report: \`prettier_${TIMESTAMP}.txt\`

3. **TypeScript Compiler** - Type checking and compilation
   - Report: \`typescript_${TIMESTAMP}.txt\`

4. **Next.js Lint** - Framework-specific rules
   - Report: \`nextjs_lint_${TIMESTAMP}.json\`

5. **npm audit** - Security vulnerability analysis
   - Report: \`npm_audit_${TIMESTAMP}.json\`

6. **npm outdated** - Dependency update analysis
   - Report: \`npm_outdated_${TIMESTAMP}.json\`

7. **Bundle Analysis** - Build size and performance
   - Report: \`bundle_analysis_${TIMESTAMP}.json\`

8. **Complexity Analysis** - Code maintainability metrics
   - Report: \`complexity_${TIMESTAMP}/\` (if available)

9. **Accessibility Analysis** - WCAG compliance check
   - Report: \`accessibility_${TIMESTAMP}.txt\`

10. **Performance Analysis** - Lighthouse metrics
    - Report: \`lighthouse_${TIMESTAMP}.json\`

## Analysis Scope

- **Target Files:** \`.js\`, \`.jsx\`, \`.ts\`, \`.tsx\`, \`.json\`, \`.md\` files
- **Configuration:** Custom ESLint config with comprehensive rules
- **Framework:** Next.js 14 with App Router
- **Exclusions:** \`node_modules\`, \`.next\`, build outputs

## Key Areas Analysed

### Code Quality
- Syntax errors and potential bugs
- Code complexity and maintainability
- TypeScript type safety
- React best practices
- Next.js performance patterns

### Security
- Dependency vulnerabilities
- Code security patterns
- XSS prevention
- CSRF protection

### Performance
- Bundle size optimisation
- Core Web Vitals
- Image optimisation
- Loading performance

### Accessibility
- WCAG 2.1 compliance
- Screen reader compatibility
- Keyboard navigation
- Colour contrast

## Next Steps

1. **Priority 1:** Fix security vulnerabilities from npm audit
2. **Priority 2:** Address TypeScript compilation errors
3. **Priority 3:** Resolve ESLint errors and warnings
4. **Priority 4:** Apply Prettier formatting fixes
5. **Priority 5:** Update outdated dependencies
6. **Priority 6:** Optimise bundle size and performance

## Report Files

All reports are saved in: \`$REPORTS_DIR\`

EOF

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  TypeScript/JavaScript Analysis Complete       ${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "Summary report: ${REPORTS_DIR}/typescript_quality_summary_${TIMESTAMP}.md"
echo -e "All reports saved to: ${REPORTS_DIR}"
echo ""

# Count total issues found
echo -e "${BLUE}Issue Summary:${NC}"
if [ -f "$REPORTS_DIR/eslint_${TIMESTAMP}.json" ]; then
    ESLINT_ERRORS=$(jq '[.[] | select(.errorCount > 0)] | length' "$REPORTS_DIR/eslint_${TIMESTAMP}.json" 2>/dev/null || echo "0")
    ESLINT_WARNINGS=$(jq '[.[] | select(.warningCount > 0)] | length' "$REPORTS_DIR/eslint_${TIMESTAMP}.json" 2>/dev/null || echo "0")
    echo -e "ESLint errors: ${ESLINT_ERRORS}"
    echo -e "ESLint warnings: ${ESLINT_WARNINGS}"
fi

if [ -f "$REPORTS_DIR/npm_audit_${TIMESTAMP}.json" ]; then
    AUDIT_VULNS=$(jq '.metadata.vulnerabilities | keys | length' "$REPORTS_DIR/npm_audit_${TIMESTAMP}.json" 2>/dev/null || echo "0")
    echo -e "Security vulnerabilities: ${AUDIT_VULNS}"
fi

echo ""
echo -e "${GREEN}Analysis completed at $(date)${NC}"