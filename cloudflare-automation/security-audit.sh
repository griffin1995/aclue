#!/bin/bash
# Automated Security Audit and Validation for GiftSync Domains
# Performs comprehensive security testing and validation
# OWASP compliance checking and security best practices verification

set -euo pipefail

source ~/.cloudflare-credentials

# Validation and error handling
if [ "${CLOUDFLARE_API_TOKEN:-YOUR_TOKEN_HERE}" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ SECURITY ERROR: Please set your Cloudflare API token in ~/.cloudflare-credentials"
    exit 1
fi

# Configuration
DOMAINS=("aclue.co.uk" "aclue.app")
LOG_FILE="/tmp/cloudflare-security-audit-$(date +%Y%m%d-%H%M%S).log"
AUDIT_REPORT="/tmp/security-audit-report-$(date +%Y%m%d-%H%M%S).json"

# Security test configuration
declare -A EXPECTED_HEADERS=(
    ["strict-transport-security"]="max-age=31536000; includeSubDomains; preload"
    ["x-frame-options"]="DENY"
    ["x-content-type-options"]="nosniff"
    ["referrer-policy"]="strict-origin-when-cross-origin"
    ["permissions-policy"]="geolocation=(), microphone=(), camera=()"
)

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling function
handle_error() {
    log "❌ ERROR: $1"
    return 1
}

# API request wrapper with error handling
cloudflare_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    local description="${4:-API request}"
    
    local response
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" "$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "$data" 2>/dev/null)
    else
        response=$(curl -s -X "$method" "$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" 2>/dev/null)
    fi
    
    local success=$(echo "$response" | jq -r '.success // false')
    if [ "$success" != "true" ]; then
        local errors=$(echo "$response" | jq -r '.errors[]? // "Unknown error"')
        handle_error "$description failed: $errors"
        return 1
    fi
    
    echo "$response"
}

# Function to test SSL/TLS configuration
test_ssl_configuration() {
    local domain="$1"
    local results=()
    
    log "🔒 Testing SSL/TLS configuration for $domain..."
    
    # Test SSL certificate
    local ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates -subject -issuer 2>/dev/null || echo "SSL_ERROR")
    
    if [[ "$ssl_info" != "SSL_ERROR" ]]; then
        log "✅ SSL Certificate: Valid"
        results+=("ssl_certificate:PASS")
        
        # Extract expiry date
        local expiry=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry" +%s 2>/dev/null || echo "0")
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ "$days_until_expiry" -gt 30 ]; then
            log "✅ SSL Certificate Expiry: $days_until_expiry days remaining"
            results+=("ssl_expiry:PASS")
        else
            log "⚠️ SSL Certificate Expiry: Only $days_until_expiry days remaining"
            results+=("ssl_expiry:WARNING")
        fi
    else
        log "❌ SSL Certificate: Invalid or unreachable"
        results+=("ssl_certificate:FAIL")
    fi
    
    # Test TLS versions
    local tls12_test=$(echo | openssl s_client -tls1_2 -servername "$domain" -connect "$domain:443" 2>/dev/null | grep "Protocol" || echo "FAIL")
    local tls13_test=$(echo | openssl s_client -tls1_3 -servername "$domain" -connect "$domain:443" 2>/dev/null | grep "Protocol" || echo "FAIL")
    
    if [[ "$tls12_test" != "FAIL" ]]; then
        log "✅ TLS 1.2: Supported"
        results+=("tls12:PASS")
    else
        log "❌ TLS 1.2: Not supported"
        results+=("tls12:FAIL")
    fi
    
    if [[ "$tls13_test" != "FAIL" ]]; then
        log "✅ TLS 1.3: Supported"
        results+=("tls13:PASS")
    else
        log "⚠️ TLS 1.3: Not supported"
        results+=("tls13:WARNING")
    fi
    
    # Test for weak TLS versions (should fail)
    local tls10_test=$(timeout 5 echo | openssl s_client -tls1 -servername "$domain" -connect "$domain:443" 2>&1 | grep -i "alert" || echo "BLOCKED")
    local tls11_test=$(timeout 5 echo | openssl s_client -tls1_1 -servername "$domain" -connect "$domain:443" 2>&1 | grep -i "alert" || echo "BLOCKED")
    
    if [[ "$tls10_test" == "BLOCKED" ]]; then
        log "✅ TLS 1.0: Properly blocked"
        results+=("tls10_blocked:PASS")
    else
        log "❌ TLS 1.0: Not blocked (security risk)"
        results+=("tls10_blocked:FAIL")
    fi
    
    if [[ "$tls11_test" == "BLOCKED" ]]; then
        log "✅ TLS 1.1: Properly blocked"
        results+=("tls11_blocked:PASS")
    else
        log "❌ TLS 1.1: Not blocked (security risk)"
        results+=("tls11_blocked:FAIL")
    fi
    
    printf '%s\n' "${results[@]}"
}

# Function to test HTTP security headers
test_security_headers() {
    local domain="$1"
    local results=()
    
    log "🛡️ Testing HTTP security headers for $domain..."
    
    # Get headers from the domain
    local headers=$(curl -s -I "https://$domain" 2>/dev/null || echo "CURL_ERROR")
    
    if [[ "$headers" == "CURL_ERROR" ]]; then
        log "❌ Could not fetch headers from $domain"
        results+=("headers_fetch:FAIL")
        printf '%s\n' "${results[@]}"
        return 1
    fi
    
    # Test for HSTS
    if echo "$headers" | grep -qi "strict-transport-security"; then
        local hsts_header=$(echo "$headers" | grep -i "strict-transport-security" | head -1)
        if echo "$hsts_header" | grep -q "max-age=[3-9][0-9][0-9][0-9][0-9][0-9][0-9]"; then
            log "✅ HSTS: Properly configured with long max-age"
            results+=("hsts:PASS")
        else
            log "⚠️ HSTS: Present but max-age may be too short"
            results+=("hsts:WARNING")
        fi
    else
        log "❌ HSTS: Missing"
        results+=("hsts:FAIL")
    fi
    
    # Test for X-Frame-Options or CSP frame-ancestors
    if echo "$headers" | grep -qi "x-frame-options\\|frame-ancestors"; then
        log "✅ Clickjacking Protection: Present"
        results+=("clickjacking:PASS")
    else
        log "❌ Clickjacking Protection: Missing"
        results+=("clickjacking:FAIL")
    fi
    
    # Test for X-Content-Type-Options
    if echo "$headers" | grep -qi "x-content-type-options.*nosniff"; then
        log "✅ Content Type Options: nosniff present"
        results+=("content_type:PASS")
    else
        log "❌ Content Type Options: Missing nosniff"
        results+=("content_type:FAIL")
    fi
    
    # Test for Content Security Policy
    if echo "$headers" | grep -qi "content-security-policy"; then
        log "✅ Content Security Policy: Present"
        results+=("csp:PASS")
    else
        log "⚠️ Content Security Policy: Missing"
        results+=("csp:WARNING")
    fi
    
    # Test for Referrer Policy
    if echo "$headers" | grep -qi "referrer-policy"; then
        log "✅ Referrer Policy: Present"
        results+=("referrer_policy:PASS")
    else
        log "⚠️ Referrer Policy: Missing"
        results+=("referrer_policy:WARNING")
    fi
    
    # Test HTTPS redirect
    local http_response=$(curl -s -o /dev/null -w "%{http_code}" "http://$domain" 2>/dev/null || echo "000")
    if [[ "$http_response" =~ ^30[1-8]$ ]]; then
        log "✅ HTTPS Redirect: HTTP properly redirects to HTTPS"
        results+=("https_redirect:PASS")
    else
        log "❌ HTTPS Redirect: HTTP does not redirect to HTTPS (code: $http_response)"
        results+=("https_redirect:FAIL")
    fi
    
    printf '%s\n' "${results[@]}"
}

# Function to test for common vulnerabilities
test_vulnerabilities() {
    local domain="$1"
    local results=()
    
    log "🔍 Testing for common vulnerabilities on $domain..."
    
    # Test for server information disclosure
    local server_header=$(curl -s -I "https://$domain" | grep -i "server:" || echo "")
    if [[ -z "$server_header" ]]; then
        log "✅ Server Header: Hidden (good for security)"
        results+=("server_disclosure:PASS")
    else
        log "⚠️ Server Header: Disclosed ($server_header)"
        results+=("server_disclosure:WARNING")
    fi
    
    # Test for X-Powered-By header (should be hidden)
    local powered_by=$(curl -s -I "https://$domain" | grep -i "x-powered-by:" || echo "")
    if [[ -z "$powered_by" ]]; then
        log "✅ X-Powered-By: Hidden (good for security)"
        results+=("powered_by_disclosure:PASS")
    else
        log "⚠️ X-Powered-By: Disclosed ($powered_by)"
        results+=("powered_by_disclosure:WARNING")
    fi
    
    # Test for directory traversal protection (should return 403/404)
    local traversal_test=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain/../../../etc/passwd" 2>/dev/null || echo "000")
    if [[ "$traversal_test" =~ ^40[34]$ ]]; then
        log "✅ Directory Traversal: Protected"
        results+=("directory_traversal:PASS")
    else
        log "❌ Directory Traversal: Potential vulnerability (code: $traversal_test)"
        results+=("directory_traversal:FAIL")
    fi
    
    # Test for SQL injection protection in query parameters
    local sqli_test=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain/?id=1'%20OR%20'1'='1" 2>/dev/null || echo "000")
    if [[ "$sqli_test" =~ ^40[034]$ ]]; then
        log "✅ SQL Injection: Protected"
        results+=("sql_injection:PASS")
    else
        log "⚠️ SQL Injection: May need additional testing (code: $sqli_test)"
        results+=("sql_injection:WARNING")
    fi
    
    # Test for XSS protection
    local xss_test=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain/?q=<script>alert('xss')</script>" 2>/dev/null || echo "000")
    if [[ "$xss_test" =~ ^40[034]$ ]]; then
        log "✅ XSS Protection: Active"
        results+=("xss_protection:PASS")
    else
        log "⚠️ XSS Protection: May need additional testing (code: $xss_test)"
        results+=("xss_protection:WARNING")
    fi
    
    printf '%s\n' "${results[@]}"
}

# Function to validate Cloudflare security settings
validate_cloudflare_settings() {
    local domain="$1"
    local zone_id="$2"
    local results=()
    
    log "☁️ Validating Cloudflare security settings for $domain..."
    
    # Check SSL mode
    local ssl_response=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones/$zone_id/settings/ssl" "" "SSL setting check")
    local ssl_mode=$(echo "$ssl_response" | jq -r '.result.value')
    
    if [ "$ssl_mode" = "strict" ]; then
        log "✅ SSL Mode: Full (Strict) - Secure"
        results+=("ssl_mode:PASS")
    elif [ "$ssl_mode" = "full" ]; then
        log "⚠️ SSL Mode: Full - Consider upgrading to Strict"
        results+=("ssl_mode:WARNING")
    else
        log "❌ SSL Mode: $ssl_mode - Insecure"
        results+=("ssl_mode:FAIL")
    fi
    
    # Check security level
    local security_response=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones/$zone_id/settings/security_level" "" "Security level check")
    local security_level=$(echo "$security_response" | jq -r '.result.value')
    
    if [ "$security_level" = "high" ] || [ "$security_level" = "under_attack" ]; then
        log "✅ Security Level: $security_level - Appropriate"
        results+=("security_level:PASS")
    else
        log "⚠️ Security Level: $security_level - Consider higher setting"
        results+=("security_level:WARNING")
    fi
    
    # Check WAF status
    local waf_response=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones/$zone_id/settings/waf" "" "WAF status check")
    local waf_status=$(echo "$waf_response" | jq -r '.result.value')
    
    if [ "$waf_status" = "on" ]; then
        log "✅ WAF: Enabled"
        results+=("waf:PASS")
    else
        log "❌ WAF: Disabled"
        results+=("waf:FAIL")
    fi
    
    # Check rate limiting rules
    local rate_limit_response=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones/$zone_id/rate_limits" "" "Rate limit check") || echo '{\"result\":[]}'
    local rate_limit_count=$(echo "$rate_limit_response" | jq -r '.result | length')
    
    if [ "$rate_limit_count" -gt 0 ]; then
        log "✅ Rate Limiting: $rate_limit_count rules configured"
        results+=("rate_limiting:PASS")
    else
        log "⚠️ Rate Limiting: No rules configured"
        results+=("rate_limiting:WARNING")
    fi
    
    # Check firewall rules
    local firewall_response=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones/$zone_id/firewall/rules" "" "Firewall rules check")
    local firewall_count=$(echo "$firewall_response" | jq -r '.result | length')
    
    if [ "$firewall_count" -gt 0 ]; then
        log "✅ Firewall Rules: $firewall_count rules configured"
        results+=("firewall_rules:PASS")
    else
        log "⚠️ Firewall Rules: No custom rules configured"
        results+=("firewall_rules:WARNING")
    fi
    
    printf '%s\n' "${results[@]}"
}

# Function to generate audit report
generate_audit_report() {
    local domain="$1"
    local ssl_results="$2"
    local header_results="$3"
    local vuln_results="$4"
    local cloudflare_results="$5"
    
    # Create JSON report structure
    local report=$(jq -n \
        --arg domain "$domain" \
        --arg timestamp "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
        --argjson ssl_tests "$(echo "$ssl_results" | jq -R 'split(":") | {key: .[0], status: .[1]}' | jq -s 'from_entries')" \
        --argjson header_tests "$(echo "$header_results" | jq -R 'split(":") | {key: .[0], status: .[1]}' | jq -s 'from_entries')" \
        --argjson vuln_tests "$(echo "$vuln_results" | jq -R 'split(":") | {key: .[0], status: .[1]}' | jq -s 'from_entries')" \
        --argjson cloudflare_tests "$(echo "$cloudflare_results" | jq -R 'split(":") | {key: .[0], status: .[1]}' | jq -s 'from_entries')" \
        '{\n          domain: $domain,\n          timestamp: $timestamp,\n          ssl_tls: $ssl_tests,\n          security_headers: $header_tests,\n          vulnerability_tests: $vuln_tests,\n          cloudflare_settings: $cloudflare_tests\n        }')\n    \n    echo \"$report\"\n}\n\n# Main audit execution\nlog \"🔍 Starting comprehensive security audit...\"\nlog \"📝 Security audit log: $LOG_FILE\"\n\n# Initialize audit report\necho '{\"audit_results\": []}' > \"$AUDIT_REPORT\"\n\nfor domain in \"${DOMAINS[@]}\"; do\n    log \"🌐 Auditing security for $domain...\"\n    \n    # Get zone ID\n    ZONE_RESPONSE=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones?name=$domain\" \"\" \"Zone lookup for $domain\")\n    ZONE_ID=$(echo \"$ZONE_RESPONSE\" | jq -r '.result[0].id // \"null\"')\n    \n    if [ \"$ZONE_ID\" = \"null\" ]; then\n        log \"❌ Could not find zone for $domain - skipping\"\n        continue\n    fi\n    \n    log \"✅ Found zone ID: $ZONE_ID for $domain\"\n    \n    # Run security tests\n    ssl_test_results=$(test_ssl_configuration \"$domain\")\n    header_test_results=$(test_security_headers \"$domain\")\n    vuln_test_results=$(test_vulnerabilities \"$domain\") \n    cloudflare_test_results=$(validate_cloudflare_settings \"$domain\" \"$ZONE_ID\")\n    \n    # Generate report for this domain\n    domain_report=$(generate_audit_report \"$domain\" \"$ssl_test_results\" \"$header_test_results\" \"$vuln_test_results\" \"$cloudflare_test_results\")\n    \n    # Add to main report\n    jq --argjson new_result \"$domain_report\" '.audit_results += [$new_result]' \"$AUDIT_REPORT\" > \"${AUDIT_REPORT}.tmp\" && mv \"${AUDIT_REPORT}.tmp\" \"$AUDIT_REPORT\"\n    \n    log \"✅ Security audit completed for $domain\"\ndone\n\n# Generate final summary\nlog \"\"\nlog \"🎉 Comprehensive security audit complete!\"\nlog \"📊 Audit results saved to: $AUDIT_REPORT\"\nlog \"📝 Detailed log: $LOG_FILE\"\nlog \"\"\n\n# Calculate overall security score\ntotal_tests=0\npassed_tests=0\n\nfor domain in \"${DOMAINS[@]}\"; do\n    domain_data=$(jq -r --arg domain \"$domain\" '.audit_results[] | select(.domain == $domain)' \"$AUDIT_REPORT\" 2>/dev/null || echo '{}')\n    if [ \"$domain_data\" != \"{}\" ]; then\n        domain_total=$(echo \"$domain_data\" | jq -r '[.ssl_tls, .security_headers, .vulnerability_tests, .cloudflare_settings] | map(to_entries[]) | length')\n        domain_passed=$(echo \"$domain_data\" | jq -r '[.ssl_tls, .security_headers, .vulnerability_tests, .cloudflare_settings] | map(to_entries[] | select(.value == \"PASS\")) | length')\n        \n        total_tests=$((total_tests + domain_total))\n        passed_tests=$((passed_tests + domain_passed))\n        \n        if [ \"$domain_total\" -gt 0 ]; then\n            domain_score=$(echo \"scale=1; $domain_passed * 100 / $domain_total\" | bc -l)\n            log \"📊 $domain Security Score: ${domain_score}% ($domain_passed/$domain_total tests passed)\"\n        fi\n    fi\ndone\n\nif [ \"$total_tests\" -gt 0 ]; then\n    overall_score=$(echo \"scale=1; $passed_tests * 100 / $total_tests\" | bc -l)\n    log \"🏆 Overall Security Score: ${overall_score}% ($passed_tests/$total_tests tests passed)\"\n    \n    if (( $(echo \"$overall_score >= 90\" | bc -l) )); then\n        log \"🟢 Security Status: EXCELLENT\"\n    elif (( $(echo \"$overall_score >= 75\" | bc -l) )); then\n        log \"🟡 Security Status: GOOD - Some improvements recommended\"\n    elif (( $(echo \"$overall_score >= 50\" | bc -l) )); then\n        log \"🟠 Security Status: FAIR - Several issues need attention\"\n    else\n        log \"🔴 Security Status: POOR - Immediate action required\"\n    fi\nfi\n\nlog \"\"\nlog \"🔍 AUDIT SUMMARY:\"\nlog \"✅ SSL/TLS configuration tested\"\nlog \"✅ HTTP security headers validated\"\nlog \"✅ Common vulnerabilities checked\"\nlog \"✅ Cloudflare settings verified\"\nlog \"✅ Comprehensive report generated\"\n\n# Show critical issues if any\nlog \"\"\nlog \"🚨 CRITICAL ISSUES TO ADDRESS:\"\njq -r '.audit_results[] | \"\\(.domain):\" as $domain | [.ssl_tls, .security_headers, .vulnerability_tests, .cloudflare_settings] | map(to_entries[] | select(.value == \"FAIL\") | \"  ❌ \\(.key)\") | if length > 0 then ($domain, .[]) else empty end' \"$AUDIT_REPORT\" | while read -r line; do\n    log \"$line\"\ndone\n\nlog \"\"\nlog \"⚠️  WARNINGS TO REVIEW:\"\njq -r '.audit_results[] | \"\\(.domain):\" as $domain | [.ssl_tls, .security_headers, .vulnerability_tests, .cloudflare_settings] | map(to_entries[] | select(.value == \"WARNING\") | \"  ⚠️  \\(.key)\") | if length > 0 then ($domain, .[]) else empty end' \"$AUDIT_REPORT\" | while read -r line; do\n    log \"$line\"\ndone"