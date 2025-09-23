#!/bin/bash
# SQL Security and Quality Scanner
# Uses SQLFluff for SQL linting, formatting, and security analysis

set -euo pipefail

# Configuration
BASE_DIR="/home/jack/Documents/aclue-preprod"
VENV_PATH="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/security-tools-venv"
REPORTS_DIR="/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

echo "==============================================="
echo "SQL Security and Quality Assessment"
echo "Timestamp: $(date)"
echo "Project: ${BASE_DIR}"
echo "==============================================="

# Ensure reports directory exists
mkdir -p "${REPORTS_DIR}"

# Activate virtual environment
source "${VENV_PATH}/bin/activate"

# Create SQLFluff configuration for PostgreSQL (Supabase)
SQLFLUFF_CONFIG="/tmp/sqlfluff_config_${TIMESTAMP}.cfg"
cat > "${SQLFLUFF_CONFIG}" << 'EOF'
[sqlfluff]
dialect = postgres
templater = jinja
sql_file_exts = .sql,.SQL,.pgsql,.psql
max_line_length = 120
indent_unit = space

[sqlfluff:indentation]
indented_joins = true
indented_ctes = true
indented_using_on = true
template_blocks_indent = true

[sqlfluff:rules]
# Enforce security and quality rules
capitalisation.keywords = upper
capitalisation.functions = upper
capitalisation.literals = lower
structure.subquery = true
ambiguous.column_references = true
convention.not_equal = consistent
convention.count_rows = consistent

# Security-focused rules
convention.select_trailing_comma = forbid
structure.unused_cte = true
references.consistent = true
references.keywords = consistent

[sqlfluff:rules:capitalisation.keywords]
capitalisation_policy = upper

[sqlfluff:rules:capitalisation.functions]
extended_capitalisation_policy = upper

[sqlfluff:rules:layout.long_lines]
ignore_comment_lines = true
EOF

# Function to scan SQL files in a directory
scan_sql_directory() {
    local scan_dir="$1"
    local scan_name="$2"

    echo ""
    echo "🔍 Scanning SQL files in: ${scan_name}"
    echo "📂 Directory: ${scan_dir}"

    # Find all SQL files
    local sql_files
    sql_files=$(find "${scan_dir}" -type f \( -name "*.sql" -o -name "*.pgsql" -o -name "*.psql" \) 2>/dev/null | head -50)

    if [[ -z "${sql_files}" ]]; then
        echo "ℹ️  No SQL files found in ${scan_dir}"
        return 0
    fi

    local file_count
    file_count=$(echo "${sql_files}" | wc -l)
    echo "📄 Found ${file_count} SQL files"

    # Run SQLFluff lint on all SQL files
    echo "🛡️  Running SQLFluff security and quality analysis..."

    # Detailed JSON report
    sqlfluff lint \
        --config "${SQLFLUFF_CONFIG}" \
        --format json \
        ${sql_files} \
        > "${REPORTS_DIR}/sqlfluff_${scan_name}_${TIMESTAMP}.json" 2>/dev/null || echo "⚠️  SQLFluff lint completed with findings"

    # Human-readable report
    sqlfluff lint \
        --config "${SQLFLUFF_CONFIG}" \
        --format human \
        ${sql_files} \
        > "${REPORTS_DIR}/sqlfluff_${scan_name}_${TIMESTAMP}.txt" 2>/dev/null || echo "⚠️  SQLFluff text report completed with findings"

    # Check for SQL injection vulnerabilities and security issues
    echo "🛡️  Analyzing SQL for security vulnerabilities..."

    # Create security-focused analysis
    python3 << EOF
import os
import re
import json

sql_files = '''${sql_files}'''.strip().split('\n')
security_issues = []

# Security patterns to detect
security_patterns = {
    'sql_injection_risk': [
        r'EXECUTE\s+[\'"].*\+.*[\'"]',  # Dynamic SQL execution
        r'EXECUTE\s+.*\|\|',  # String concatenation in EXECUTE
        r'FORMAT\s*\([^,]*,[^)]*\+',  # Unsafe FORMAT usage
    ],
    'privilege_escalation': [
        r'GRANT\s+ALL',  # Overly broad permissions
        r'GRANT\s+SUPERUSER',  # Superuser grants
        r'ALTER\s+USER.*SUPERUSER',  # User privilege escalation
    ],
    'data_exposure': [
        r'SELECT\s+\*\s+FROM\s+pg_shadow',  # Password exposure
        r'SELECT\s+.*password.*FROM',  # Potential password queries
        r'COPY.*TO\s+[\'"]\/.*[\'"]',  # File system access
    ],
    'unsafe_operations': [
        r'DROP\s+DATABASE',  # Database deletion
        r'DROP\s+TABLE.*CASCADE',  # Cascading drops
        r'TRUNCATE.*CASCADE',  # Cascading truncates
        r'DELETE\s+FROM.*WITHOUT\s+WHERE',  # Unfiltered deletes
    ],
    'authentication_bypass': [
        r'WHERE\s+.*=\s*[\'"].*OR.*=.*[\'"]',  # Potential OR injection
        r'WHERE\s+1\s*=\s*1',  # Always true conditions
        r'WHERE.*--',  # Comment-based bypass
    ]
}

for sql_file in sql_files:
    if not sql_file.strip():
        continue

    try:
        with open(sql_file.strip(), 'r', encoding='utf-8') as f:
            content = f.read()

        for category, patterns in security_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    line_num = content[:match.start()].count('\n') + 1
                    security_issues.append({
                        'file': sql_file.strip(),
                        'line': line_num,
                        'category': category,
                        'pattern': pattern,
                        'match': match.group(0),
                        'severity': 'HIGH' if category in ['sql_injection_risk', 'privilege_escalation'] else 'MEDIUM'
                    })

    except Exception as e:
        print(f"⚠️  Error analyzing {sql_file}: {e}")

# Save security analysis results
security_report_path = "${REPORTS_DIR}/sql_security_analysis_${scan_name}_${TIMESTAMP}.json"
with open(security_report_path, 'w') as f:
    json.dump({
        'scan_timestamp': '${TIMESTAMP}',
        'scan_directory': '${scan_dir}',
        'total_files': len([f for f in sql_files if f.strip()]),
        'security_issues': security_issues,
        'summary': {
            'total_issues': len(security_issues),
            'high_severity': len([i for i in security_issues if i['severity'] == 'HIGH']),
            'medium_severity': len([i for i in security_issues if i['severity'] == 'MEDIUM']),
            'categories': list(set([i['category'] for i in security_issues]))
        }
    }, indent=2)

print(f"📊 Security analysis complete: {len(security_issues)} potential issues found")
if security_issues:
    print("🚨 High priority security issues:")
    for issue in [i for i in security_issues if i['severity'] == 'HIGH'][:5]:
        print(f"   - {issue['file']}:{issue['line']} ({issue['category']})")
EOF

    echo "✅ SQL security analysis completed for ${scan_name}"
}

# Scan common SQL directories
directories_to_scan=(
    "${BASE_DIR}/backend/sql:backend-sql"
    "${BASE_DIR}/backend/migrations:backend-migrations"
    "${BASE_DIR}/database:database-scripts"
    "${BASE_DIR}/db:database-db"
    "${BASE_DIR}/sql:project-sql"
    "${BASE_DIR}/migrations:project-migrations"
    "${BASE_DIR}:project-root"
)

for dir_spec in "${directories_to_scan[@]}"; do
    IFS=':' read -r scan_dir scan_name <<< "${dir_spec}"
    if [[ -d "${scan_dir}" ]]; then
        scan_sql_directory "${scan_dir}" "${scan_name}"
    fi
done

# Generate consolidated SQL security summary
echo ""
echo "📊 Generating consolidated SQL security summary..."

python3 << 'EOF'
import json
import glob
import os
from datetime import datetime

reports_dir = "/home/jack/Documents/aclue-preprod/tests-22-sept/automated/database/reports"
timestamp = os.environ.get('TIMESTAMP', datetime.now().strftime('%Y%m%d_%H%M%S'))

print("=" * 60)
print("SQL SECURITY AND QUALITY ASSESSMENT SUMMARY")
print("=" * 60)

# Process SQLFluff reports
sqlfluff_files = glob.glob(f"{reports_dir}/sqlfluff_*_{timestamp}.json")
total_sql_issues = 0

for file_path in sqlfluff_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        scan_name = os.path.basename(file_path).replace(f'sqlfluff_', '').replace(f'_{timestamp}.json', '')
        violations = data if isinstance(data, list) else []

        print(f"\n📊 SQLFluff Analysis - {scan_name}")
        print(f"   Total violations: {len(violations)}")

        # Categorize violations
        rule_counts = {}
        for violation in violations:
            rule = violation.get('code', 'unknown')
            rule_counts[rule] = rule_counts.get(rule, 0) + 1

        # Show top 5 rule violations
        top_rules = sorted(rule_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        for rule, count in top_rules:
            print(f"   {rule}: {count} issues")

        total_sql_issues += len(violations)

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process security analysis reports
security_files = glob.glob(f"{reports_dir}/sql_security_analysis_*_{timestamp}.json")

print(f"\n🛡️  SQL SECURITY ANALYSIS")
total_security_issues = 0

for file_path in security_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        scan_name = file_path.split('sql_security_analysis_')[1].replace(f'_{timestamp}.json', '')
        summary = data.get('summary', {})

        print(f"\n🔍 Security scan - {scan_name}")
        print(f"   Files scanned: {data.get('total_files', 0)}")
        print(f"   Security issues: {summary.get('total_issues', 0)}")
        print(f"   High severity: {summary.get('high_severity', 0)}")
        print(f"   Medium severity: {summary.get('medium_severity', 0)}")

        if summary.get('categories'):
            print(f"   Issue categories: {', '.join(summary['categories'])}")

        total_security_issues += summary.get('total_issues', 0)

    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

print("\n" + "=" * 60)
print("OVERALL SQL ASSESSMENT SUMMARY")
print("=" * 60)
print(f"📊 Total SQL quality issues: {total_sql_issues}")
print(f"🛡️  Total security issues: {total_security_issues}")

if total_security_issues > 0:
    print("\n🚨 SQL SECURITY RECOMMENDATIONS:")
    print("• Review high-severity security issues immediately")
    print("• Validate all dynamic SQL construction")
    print("• Review database privilege grants")
    print("• Implement parameterized queries where needed")
    print("• Consider using stored procedures for complex operations")
else:
    print("\n✅ No SQL security issues detected!")

if total_sql_issues > 0:
    print("\n📋 SQL QUALITY RECOMMENDATIONS:")
    print("• Fix formatting and style violations")
    print("• Review complex queries for optimization")
    print("• Ensure consistent naming conventions")
    print("• Add appropriate indexes for performance")

print("=" * 60)
EOF

deactivate

# Cleanup temporary config
rm -f "${SQLFLUFF_CONFIG}"

echo ""
echo "==============================================="
echo "SQL Security Assessment Complete"
echo "Time: $(date)"
echo "Reports available in: ${REPORTS_DIR}/"
echo "==============================================="