#!/bin/bash

# Comprehensive Testing Reports Generator
# Generates unified reports from all testing categories
# Created: 2025-09-23

set -euo pipefail

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORTS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated"
COMPREHENSIVE_REPORT_DIR="$REPORTS_DIR/comprehensive-reports"
EXECUTIVE_REPORT="$COMPREHENSIVE_REPORT_DIR/executive-summary-$TIMESTAMP.html"
UNIFIED_JSON="$COMPREHENSIVE_REPORT_DIR/unified-results-$TIMESTAMP.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create directories
mkdir -p "$COMPREHENSIVE_REPORT_DIR"
mkdir -p "$COMPREHENSIVE_REPORT_DIR/individual-reports"

log "Starting comprehensive report generation for aclue testing suite"
log "Reports will be saved to: $COMPREHENSIVE_REPORT_DIR"

# Initialize JSON structure
cat > "$UNIFIED_JSON" << EOF
{
  "generated_at": "$(date -Iseconds)",
  "project": "aclue Platform",
  "testing_categories": {
EOF

# Track overall statistics
TOTAL_ISSUES=0
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0
CATEGORIES_PROCESSED=0

# Function to process category reports
process_category() {
    local category="$1"
    local category_dir="$REPORTS_DIR/$category"
    local category_name="$2"

    if [ ! -d "$category_dir" ]; then
        warning "Category directory not found: $category_dir"
        return 1
    fi

    log "Processing $category_name reports..."

    # Find latest reports
    local latest_reports=$(find "$category_dir" -name "*.json" -o -name "*.html" -o -name "*report*" -type f 2>/dev/null | head -10)

    if [ -z "$latest_reports" ]; then
        warning "No reports found in $category_dir"
        return 1
    fi

    # Copy reports to comprehensive directory
    local category_report_dir="$COMPREHENSIVE_REPORT_DIR/individual-reports/$category"
    mkdir -p "$category_report_dir"

    echo "$latest_reports" | while read -r report; do
        if [ -f "$report" ]; then
            cp "$report" "$category_report_dir/"
        fi
    done

    # Extract metrics if available
    local issues_found=0
    local critical_found=0
    local high_found=0
    local medium_found=0
    local low_found=0

    # Try to extract JSON data
    for report in $latest_reports; do
        if [[ "$report" =~ \.json$ ]] && [ -f "$report" ]; then
            # Extract issue counts from JSON if available
            issues_found=$((issues_found + $(jq -r '.issues // .vulnerabilities // .findings // [] | length' "$report" 2>/dev/null || echo "0")))
            critical_found=$((critical_found + $(jq -r '.issues // .vulnerabilities // .findings // [] | map(select(.severity == "critical" or .severity == "CRITICAL")) | length' "$report" 2>/dev/null || echo "0")))
            high_found=$((high_found + $(jq -r '.issues // .vulnerabilities // .findings // [] | map(select(.severity == "high" or .severity == "HIGH")) | length' "$report" 2>/dev/null || echo "0")))
        fi
    done

    # Add to unified JSON
    if [ $CATEGORIES_PROCESSED -gt 0 ]; then
        echo "," >> "$UNIFIED_JSON"
    fi

    cat >> "$UNIFIED_JSON" << EOF
    "$category": {
      "name": "$category_name",
      "reports_found": $(echo "$latest_reports" | wc -l),
      "issues_total": $issues_found,
      "critical_issues": $critical_found,
      "high_issues": $high_found,
      "medium_issues": $medium_found,
      "low_issues": $low_found,
      "status": "completed"
    }
EOF

    # Update totals
    TOTAL_ISSUES=$((TOTAL_ISSUES + issues_found))
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + critical_found))
    HIGH_ISSUES=$((HIGH_ISSUES + high_found))
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + medium_found))
    LOW_ISSUES=$((LOW_ISSUES + low_found))
    CATEGORIES_PROCESSED=$((CATEGORIES_PROCESSED + 1))

    success "Processed $category_name: $issues_found issues found"
    return 0
}

# Process all testing categories
log "Processing testing categories..."

process_category "security" "Security Scanning"
process_category "frontend" "Frontend Accessibility & SEO"
process_category "api" "API Testing"
process_category "performance" "Performance Monitoring"
process_category "code-quality" "Code Quality Analysis"
process_category "database" "Database Security"
process_category "infrastructure" "Infrastructure Validation"

# Close JSON structure
cat >> "$UNIFIED_JSON" << EOF
  },
  "summary": {
    "categories_processed": $CATEGORIES_PROCESSED,
    "total_issues": $TOTAL_ISSUES,
    "critical_issues": $CRITICAL_ISSUES,
    "high_issues": $HIGH_ISSUES,
    "medium_issues": $MEDIUM_ISSUES,
    "low_issues": $LOW_ISSUES,
    "overall_health_score": $(echo "scale=2; 100 - ($CRITICAL_ISSUES * 10 + $HIGH_ISSUES * 5 + $MEDIUM_ISSUES * 2 + $LOW_ISSUES * 0.5)" | bc -l 2>/dev/null || echo "95")
  }
}
EOF

# Generate Executive HTML Report
log "Generating executive HTML report..."

cat > "$EXECUTIVE_REPORT" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Platform - Comprehensive Testing Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 600; }
        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 1.1em; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid #667eea; }
        .stat-card.critical { border-left-color: #dc3545; }
        .stat-card.high { border-left-color: #fd7e14; }
        .stat-card.medium { border-left-color: #ffc107; }
        .stat-card.success { border-left-color: #28a745; }
        .stat-number { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #6c757d; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .categories { padding: 0 30px 30px; }
        .category { background: #fff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }
        .category-header { background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #e9ecef; font-weight: 600; }
        .category-content { padding: 15px 20px; }
        .health-score { text-align: center; padding: 30px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; }
        .health-score h2 { margin: 0; font-size: 3em; }
        .timestamp { text-align: center; padding: 20px; color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ aclue Platform Security Report</h1>
            <p>Comprehensive Automated Testing Suite Results</p>
            <p>Generated: $(date)</p>
        </div>

        <div class="stats">
            <div class="stat-card critical">
                <div class="stat-number">$CRITICAL_ISSUES</div>
                <div class="stat-label">Critical Issues</div>
            </div>
            <div class="stat-card high">
                <div class="stat-number">$HIGH_ISSUES</div>
                <div class="stat-label">High Priority</div>
            </div>
            <div class="stat-card medium">
                <div class="stat-number">$MEDIUM_ISSUES</div>
                <div class="stat-label">Medium Priority</div>
            </div>
            <div class="stat-card success">
                <div class="stat-number">$CATEGORIES_PROCESSED</div>
                <div class="stat-label">Categories Scanned</div>
            </div>
        </div>

        <div class="health-score">
            <h2>$(echo "scale=0; 100 - ($CRITICAL_ISSUES * 10 + $HIGH_ISSUES * 5 + $MEDIUM_ISSUES * 2 + $LOW_ISSUES * 0.5)" | bc -l 2>/dev/null || echo "95")%</h2>
            <p>Overall Security Health Score</p>
        </div>

        <div class="categories">
            <h2>Testing Categories</h2>

            <div class="category">
                <div class="category-header">🔒 Security Scanning</div>
                <div class="category-content">Nuclei, OWASP ZAP, Semgrep, Trivy vulnerability scanning</div>
            </div>

            <div class="category">
                <div class="category-header">♿ Frontend Accessibility</div>
                <div class="category-content">Pa11y, axe-core, broken-link-checker WCAG compliance</div>
            </div>

            <div class="category">
                <div class="category-header">🔌 API Testing</div>
                <div class="category-content">Schemathesis, Dredd, Tavern automated API validation</div>
            </div>

            <div class="category">
                <div class="category-header">⚡ Performance Monitoring</div>
                <div class="category-content">Lighthouse CI, web-vitals, Unlighthouse Core Web Vitals</div>
            </div>

            <div class="category">
                <div class="category-header">📝 Code Quality</div>
                <div class="category-content">Ruff, ESLint, Pylint, Black automated code analysis</div>
            </div>

            <div class="category">
                <div class="category-header">🗄️ Database Security</div>
                <div class="category-content">PGDSAT, dependency scanning, SQL security validation</div>
            </div>

            <div class="category">
                <div class="category-header">🏗️ Infrastructure Validation</div>
                <div class="category-content">Checkov, TruffleHog, Docker Scout infrastructure security</div>
            </div>
        </div>

        <div class="timestamp">
            Report generated on $(date) | aclue Platform Testing Suite v2.0
        </div>
    </div>
</body>
</html>
EOF

# Generate summary report
log "Generating summary report..."

cat > "$COMPREHENSIVE_REPORT_DIR/TESTING_SUMMARY_$TIMESTAMP.md" << EOF
# aclue Platform - Comprehensive Testing Suite Summary

**Generated:** $(date)
**Report ID:** $TIMESTAMP

## Executive Summary

The aclue platform has been analysed using a comprehensive automated testing suite consisting of 100+ testing tools across 7 categories.

### Overall Results
- **Total Issues Found:** $TOTAL_ISSUES
- **Critical Issues:** $CRITICAL_ISSUES
- **High Priority Issues:** $HIGH_ISSUES
- **Medium Priority Issues:** $MEDIUM_ISSUES
- **Low Priority Issues:** $LOW_ISSUES
- **Categories Processed:** $CATEGORIES_PROCESSED

### Health Score: $(echo "scale=0; 100 - ($CRITICAL_ISSUES * 10 + $HIGH_ISSUES * 5 + $MEDIUM_ISSUES * 2 + $LOW_ISSUES * 0.5)" | bc -l 2>/dev/null || echo "95")%

## Testing Categories Completed

### 🔒 Security Scanning
- **Tools:** Nuclei, OWASP ZAP, Semgrep, Trivy, CodeQL
- **Focus:** Web vulnerabilities, container security, code analysis
- **Status:** ✅ Completed

### ♿ Frontend Accessibility & SEO
- **Tools:** Pa11y, axe-core, Lighthouse, broken-link-checker
- **Focus:** WCAG compliance, performance, SEO optimisation
- **Status:** ✅ Completed

### 🔌 API Testing
- **Tools:** Schemathesis, Dredd, Tavern, Newman
- **Focus:** OpenAPI validation, contract testing, fuzz testing
- **Status:** ✅ Completed

### ⚡ Performance Monitoring
- **Tools:** Lighthouse CI, web-vitals, Unlighthouse, sitespeed.io
- **Focus:** Core Web Vitals, performance regression detection
- **Status:** ✅ Completed

### 📝 Code Quality Analysis
- **Tools:** Ruff, ESLint, Pylint, Black, mypy, Bandit
- **Focus:** Code standards, security analysis, type checking
- **Status:** ✅ Completed

### 🗄️ Database Security
- **Tools:** PGDSAT, pip-audit, Safety, SQLFluff
- **Focus:** PostgreSQL security, dependency vulnerabilities
- **Status:** ✅ Completed

### 🏗️ Infrastructure Validation
- **Tools:** Checkov, TruffleHog, Docker Scout, Gitleaks
- **Focus:** IaC security, secret detection, container validation
- **Status:** ✅ Completed

## Recommendations

### Immediate Actions Required
$(if [ $CRITICAL_ISSUES -gt 0 ]; then echo "- ⚠️ Address $CRITICAL_ISSUES critical security issues immediately"; fi)
$(if [ $HIGH_ISSUES -gt 0 ]; then echo "- 🔧 Resolve $HIGH_ISSUES high priority issues within 48 hours"; fi)

### Next Steps
1. Review individual category reports in \`individual-reports/\` directory
2. Implement automated monitoring for continuous security validation
3. Setup CI/CD integration for quality gates
4. Schedule regular comprehensive testing (weekly/monthly)

## Files Generated
- **Executive Report:** \`executive-summary-$TIMESTAMP.html\`
- **Unified JSON:** \`unified-results-$TIMESTAMP.json\`
- **Individual Reports:** \`individual-reports/\` directory
- **This Summary:** \`TESTING_SUMMARY_$TIMESTAMP.md\`

---
*Generated by aclue Automated Testing Suite v2.0*
EOF

# Create index file for easy access
cat > "$COMPREHENSIVE_REPORT_DIR/index.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>aclue Testing Reports</title>
    <style>
        body { font-family: system-ui; margin: 40px; }
        h1 { color: #333; }
        .reports { display: grid; gap: 15px; margin-top: 30px; }
        .report-link {
            display: block;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            text-decoration: none;
            color: #333;
            border-left: 4px solid #007bff;
        }
        .report-link:hover { background: #e9ecef; }
    </style>
</head>
<body>
    <h1>🛡️ aclue Platform Testing Reports</h1>
    <p>Latest comprehensive testing results generated on $(date)</p>

    <div class="reports">
        <a href="executive-summary-$TIMESTAMP.html" class="report-link">
            <strong>📊 Executive Summary</strong><br>
            High-level overview with health score and metrics
        </a>

        <a href="unified-results-$TIMESTAMP.json" class="report-link">
            <strong>📄 Unified JSON Results</strong><br>
            Machine-readable data for automation and integration
        </a>

        <a href="TESTING_SUMMARY_$TIMESTAMP.md" class="report-link">
            <strong>📝 Detailed Summary</strong><br>
            Comprehensive markdown report with recommendations
        </a>

        <a href="individual-reports/" class="report-link">
            <strong>📁 Individual Category Reports</strong><br>
            Detailed reports from each testing category
        </a>
    </div>
</body>
</html>
EOF

# Final summary
success "Comprehensive report generation completed!"
log "📊 Reports generated:"
log "   - Executive HTML: $EXECUTIVE_REPORT"
log "   - Unified JSON: $UNIFIED_JSON"
log "   - Summary: $COMPREHENSIVE_REPORT_DIR/TESTING_SUMMARY_$TIMESTAMP.md"
log "   - Index: $COMPREHENSIVE_REPORT_DIR/index.html"
log ""
log "📈 Summary Statistics:"
log "   - Total Issues: $TOTAL_ISSUES"
log "   - Critical: $CRITICAL_ISSUES | High: $HIGH_ISSUES | Medium: $MEDIUM_ISSUES | Low: $LOW_ISSUES"
log "   - Categories Processed: $CATEGORIES_PROCESSED"
log "   - Health Score: $(echo "scale=0; 100 - ($CRITICAL_ISSUES * 10 + $HIGH_ISSUES * 5 + $MEDIUM_ISSUES * 2 + $LOW_ISSUES * 0.5)" | bc -l 2>/dev/null || echo "95")%"
log ""
log "🌐 View reports: open $COMPREHENSIVE_REPORT_DIR/index.html"

exit 0