#!/bin/bash

# Email Template Preview and Test Script for Aclue
# This script provides easy commands for generating email previews and sending test emails

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if virtual environment exists and activate it
activate_venv() {
    if [ -d "$BACKEND_DIR/venv" ]; then
        print_info "Activating virtual environment..."
        source "$BACKEND_DIR/venv/bin/activate"
        print_success "Virtual environment activated"
    else
        print_error "Virtual environment not found at $BACKEND_DIR/venv"
        print_info "Please run: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
}

# Function to generate email previews
generate_previews() {
    print_info "Generating email template previews..."
    cd "$BACKEND_DIR"
    activate_venv

    if python scripts/generate_email_previews.py; then
        print_success "Email previews generated successfully!"
        print_info "Preview files saved to: $BACKEND_DIR/email_previews/"
        print_info "Open 'combined_preview.html' in your browser to see all templates"

        # Try to open the combined preview automatically
        if command -v xdg-open > /dev/null; then
            print_info "Opening preview in default browser..."
            xdg-open "$BACKEND_DIR/email_previews/combined_preview.html" 2>/dev/null || true
        elif command -v open > /dev/null; then
            print_info "Opening preview in default browser..."
            open "$BACKEND_DIR/email_previews/combined_preview.html" 2>/dev/null || true
        else
            print_info "To view previews, open: $BACKEND_DIR/email_previews/combined_preview.html"
        fi
    else
        print_error "Failed to generate email previews"
        exit 1
    fi
}

# Function to send test email
send_test_email() {
    local email="$1"
    local type="$2"

    if [ -z "$email" ]; then
        print_error "Email address is required"
        echo "Usage: $0 send-test your.email@example.com [welcome|admin|both]"
        exit 1
    fi

    if [ -z "$type" ]; then
        type="welcome"
    fi

    print_info "Sending test email to: $email (type: $type)"
    cd "$BACKEND_DIR"
    activate_venv

    if python scripts/send_test_email.py --email "$email" --type "$type"; then
        print_success "Test email sent successfully!"
        print_info "Check your email client to see how the template appears"
    else
        print_error "Failed to send test email"
        exit 1
    fi
}

# Function to check email configuration
check_config() {
    print_info "Checking email service configuration..."
    cd "$BACKEND_DIR"
    activate_venv

    if python scripts/send_test_email.py --check-config; then
        print_success "Email configuration is valid!"
    else
        print_error "Email configuration has issues"
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}📧 Aclue Email Template Preview and Test Utility${NC}"
    echo
    echo "Usage:"
    echo "  $0 <command> [options]"
    echo
    echo "Commands:"
    echo -e "  ${GREEN}preview${NC}                           Generate HTML previews of email templates"
    echo -e "  ${GREEN}send-test <email> [type]${NC}         Send test email to specified address"
    echo -e "  ${GREEN}check-config${NC}                     Validate email service configuration"
    echo -e "  ${GREEN}open-previews${NC}                    Open the preview directory in file manager"
    echo -e "  ${GREEN}help${NC}                             Show this help message"
    echo
    echo "Test Email Types:"
    echo "  welcome                         Send welcome email template (default)"
    echo "  admin                          Send admin notification template"
    echo "  both                           Send both templates"
    echo
    echo "Examples:"
    echo "  $0 preview                     # Generate all email previews"
    echo "  $0 send-test john@example.com  # Send welcome email test"
    echo "  $0 send-test admin@company.com admin  # Send admin notification test"
    echo "  $0 check-config               # Verify email configuration"
    echo
    echo "Generated Files:"
    echo "  email_previews/combined_preview.html     # All templates in one file"
    echo "  email_previews/welcome_email_light.html  # Welcome email light theme"
    echo "  email_previews/welcome_email_dark.html   # Welcome email dark theme"
    echo "  email_previews/admin_notification_*.html # Admin notification templates"
    echo
    echo -e "${YELLOW}Note: Test emails require valid Resend API configuration in .env file${NC}"
}

# Function to open previews directory
open_previews() {
    local preview_dir="$BACKEND_DIR/email_previews"

    if [ ! -d "$preview_dir" ]; then
        print_warning "Preview directory not found. Generating previews first..."
        generate_previews
        return
    fi

    print_info "Opening previews directory..."

    if command -v xdg-open > /dev/null; then
        xdg-open "$preview_dir" 2>/dev/null || true
    elif command -v open > /dev/null; then
        open "$preview_dir" 2>/dev/null || true
    elif command -v explorer > /dev/null; then
        explorer "$preview_dir" 2>/dev/null || true
    else
        print_info "Preview directory: $preview_dir"
        ls -la "$preview_dir"
    fi
}

# Main script logic
case "${1:-help}" in
    "preview")
        generate_previews
        ;;
    "send-test")
        send_test_email "$2" "$3"
        ;;
    "check-config")
        check_config
        ;;
    "open-previews")
        open_previews
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_usage
        exit 1
        ;;
esac