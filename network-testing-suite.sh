#!/bin/bash

# aclue Network Testing Suite
# Comprehensive DNS, SSL, and connectivity testing

echo "=== aclue Network Testing Suite ==="
echo "Testing both aclue.app and aclue.co.uk"
echo "====================================="

DOMAINS=("aclue.app" "aclue.co.uk")

for domain in "${DOMAINS[@]}"; do
    echo ""
    echo "🔍 Testing: $domain"
    echo "========================"
    
    # DNS Resolution Test
    echo "📋 DNS Resolution:"
    echo "A Record: $(dig +short $domain)"
    echo "WWW CNAME: $(dig +short www.$domain)"
    echo "Nameservers: $(dig +short NS $domain)"
    
    # SSL Certificate Test
    echo ""
    echo "🔒 SSL Certificate:"
    ssl_info=$(openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "$ssl_info"
        echo "SSL Status: ✅ Valid"
    else
        echo "SSL Status: ❌ Invalid"
    fi
    
    # HTTPS Connectivity Test
    echo ""
    echo "🌐 HTTPS Connectivity:"
    response=$(curl -s -o /dev/null -w "%{http_code}" https://$domain)
    if [ "$response" = "200" ]; then
        echo "HTTPS Status: ✅ $response OK"
    else
        echo "HTTPS Status: ❌ $response"
    fi
    
    # WWW Redirect Test
    echo ""
    echo "🔄 WWW Redirect:"
    www_response=$(curl -s -o /dev/null -w "%{http_code}" https://www.$domain)
    if [ "$www_response" = "200" ]; then
        echo "WWW Status: ✅ $www_response OK"
    else
        echo "WWW Status: ❌ $www_response"
    fi
    
    # Performance Test
    echo ""
    echo "⚡ Performance:"
    perf=$(curl -s -o /dev/null -w "Connect: %{time_connect}s\nTLS: %{time_appconnect}s\nTotal: %{time_total}s" https://$domain)
    echo "$perf"
    
    echo "========================"
done

# Backend API Test
echo ""
echo "🔌 Backend API Test:"
api_response=$(curl -s -o /dev/null -w "%{http_code}" https://aclue-backend-production.up.railway.app/health)
if [ "$api_response" = "200" ]; then
    echo "Backend API: ✅ $api_response OK"
else
    echo "Backend API: ❌ $api_response"
fi

echo ""
echo "=== Testing Complete ==="