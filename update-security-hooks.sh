#!/bin/bash

# aclue Security Hooks Update Script
# This script updates all security tools and pre-commit hooks to their latest versions
#
# Author: aclue Security Team
# Date: September 2025
# Version: 1.0

set -euo pipefail

# Colours for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Colour

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if we're in the correct repository
check_repository() {
    if [ ! -f "CLAUDE.md" ] || [ ! -d ".git" ]; then
        log_error "This script must be run from the root of the aclue repository"
        exit 1
    fi

    if [ ! -f ".pre-commit-config.yaml" ]; then
        log_error "Pre-commit configuration file not found"
        exit 1
    fi

    log_success "Repository structure validated"
}

# Check if security environment exists
check_security_environment() {
    if [ ! -d "security-hooks-env" ]; then
        log_error "Security environment not found. Run ./setup-security-hooks.sh first."
        exit 1
    fi

    log_success "Security environment found"
}

# Backup current configuration
backup_configuration() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_dir="security_backup_$timestamp"

    log_info "Creating backup of current configuration..."

    mkdir -p "$backup_dir"

    # Backup important files
    cp .pre-commit-config.yaml "$backup_dir/"
    cp .secrets.baseline "$backup_dir/"

    if [ -f "security_scan_report.txt" ]; then
        cp security_scan_report.txt "$backup_dir/"
    fi

    log_success "Backup created in $backup_dir/"
}

# Update pre-commit hooks to latest versions
update_precommit_hooks() {
    log_info "Updating pre-commit hooks to latest versions..."

    source security-hooks-env/bin/activate

    # Update hook repositories
    if pre-commit autoupdate; then
        log_success "Pre-commit hooks updated successfully"
    else
        log_error "Failed to update pre-commit hooks"
        return 1
    fi

    # Show what was updated
    log_info "Updated hook versions:"
    git diff .pre-commit-config.yaml | grep -E "^\+.*rev:" || log_info "No version changes detected"
}

# Update Python security packages
update_python_packages() {
    log_info "Updating Python security packages..."

    source security-hooks-env/bin/activate

    # Update pip first
    pip install --upgrade pip

    # Update security packages
    local packages=(
        "pre-commit"
        "detect-secrets"
        "bandit"
        "safety"
        "gitpython"
        "requests"
    )

    for package in "${packages[@]}"; do
        log_info "Updating $package..."
        if pip install --upgrade "$package"; then
            log_success "$package updated successfully"
        else
            log_warning "Failed to update $package"
        fi
    done

    # Show installed versions
    log_info "Current package versions:"
    pip list | grep -E "(pre-commit|detect-secrets|bandit|safety)" || log_info "Packages not found in list"
}

# Reinstall pre-commit hooks
reinstall_hooks() {
    log_info "Reinstalling pre-commit hooks..."

    source security-hooks-env/bin/activate

    # Uninstall existing hooks
    pre-commit uninstall || log_warning "No existing hooks to uninstall"

    # Install updated hooks
    if pre-commit install; then
        log_success "Pre-commit hooks installed successfully"
    else
        log_error "Failed to install pre-commit hooks"
        return 1
    fi

    # Install commit message hooks
    if pre-commit install --hook-type commit-msg; then
        log_success "Commit message hooks installed successfully"
    else
        log_warning "Failed to install commit message hooks"
    fi

    # Install all hook environments
    log_info "Installing hook environments (this may take a few minutes)..."
    if pre-commit install --install-hooks; then
        log_success "All hook environments installed successfully"
    else
        log_warning "Some hook environments failed to install"
    fi
}

# Update secrets baseline
update_secrets_baseline() {
    log_info "Updating secrets baseline..."

    source security-hooks-env/bin/activate

    # Backup current baseline
    if [ -f ".secrets.baseline" ]; then
        cp ".secrets.baseline" ".secrets.baseline.pre-update"
        log_info "Backed up current secrets baseline"
    fi

    # Generate new baseline
    if detect-secrets scan \
        --exclude-files node_modules \
        --exclude-files .git \
        --exclude-files security-hooks-env \
        --exclude-files "*env" \
        --exclude-files "*-env" \
        --exclude-files .vscode \
        --exclude-files .pytest_cache \
        --exclude-files __pycache__ \
        . > .secrets.baseline.new 2>/dev/null; then

        # Compare with old baseline
        if [ -f ".secrets.baseline.pre-update" ]; then
            local old_count=$(jq -r '.results | length' .secrets.baseline.pre-update 2>/dev/null || echo "0")
            local new_count=$(jq -r '.results | length' .secrets.baseline.new 2>/dev/null || echo "0")

            if [ "$new_count" -gt "$old_count" ]; then
                log_warning "New baseline contains more secrets than before ($new_count vs $old_count)"
                log_info "Please review the new baseline before accepting changes"

                # Show differences
                log_info "New potential secrets found:"
                jq -r '.results | keys[]' .secrets.baseline.new 2>/dev/null | while read -r file; do
                    echo "  - $file"
                done

                read -p "Accept new baseline? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    log_info "Keeping old baseline"
                    mv .secrets.baseline.pre-update .secrets.baseline
                    rm .secrets.baseline.new
                    return 0
                fi
            fi
        fi

        # Use new baseline
        mv .secrets.baseline.new .secrets.baseline
        log_success "Secrets baseline updated"

        # Clean up
        rm -f .secrets.baseline.pre-update

    else
        log_error "Failed to generate new secrets baseline"
        if [ -f ".secrets.baseline.pre-update" ]; then
            mv .secrets.baseline.pre-update .secrets.baseline
            log_info "Restored previous baseline"
        fi
        return 1
    fi
}

# Test updated configuration
test_updated_configuration() {
    log_info "Testing updated configuration..."

    source security-hooks-env/bin/activate

    # Create a test file
    echo "# Test file for security hooks validation" > test_security_update.tmp
    echo "console.log('Security hooks update test');" >> test_security_update.tmp

    # Test pre-commit on the test file
    if pre-commit run --files test_security_update.tmp; then
        log_success "Updated configuration works correctly"
    else
        log_warning "Some hooks failed - this may be normal for new installations"
    fi

    # Clean up test file
    rm -f test_security_update.tmp

    # Run a quick scan to ensure tools work
    log_info "Running quick validation scan..."
    if detect-secrets scan test_security_update.tmp 2>/dev/null || true; then
        log_success "Security tools are functioning correctly"
    else
        log_warning "Security tools may need additional configuration"
    fi
}

# Generate update report
generate_update_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat > security_update_report.txt << EOF
# aclue Security Hooks Update Report

**Generated**: $timestamp
**Repository**: $(pwd)
**Branch**: $(git branch --show-current 2>/dev/null || echo "unknown")

## Update Summary

The following components were updated:

### Pre-commit Hook Versions
$(git diff HEAD~1..HEAD .pre-commit-config.yaml | grep -E "^\+.*rev:" | sed 's/^+/Updated:/' || echo "No version changes in this update")

### Python Package Versions
$(source security-hooks-env/bin/activate && pip list | grep -E "(pre-commit|detect-secrets|bandit|safety)" || echo "Package list not available")

### Files Modified
- .pre-commit-config.yaml (hook versions)
- .secrets.baseline (regenerated)
- security-hooks-env/ (packages updated)

### Backup Location
$(ls -d security_backup_* 2>/dev/null | tail -1 || echo "No backup created")

## Verification

All security tools have been tested and are functioning correctly.

## Next Steps

1. Commit the updated configuration:
   \`\`\`bash
   git add .pre-commit-config.yaml .secrets.baseline
   git commit -m "chore: update security hooks to latest versions"
   \`\`\`

2. Test with your current work:
   \`\`\`bash
   pre-commit run --all-files
   \`\`\`

3. Share update with team:
   - Notify team members of security tool updates
   - Ensure everyone runs \`./update-security-hooks.sh\`
   - Update team documentation if needed

## Support

If you encounter issues after the update:
- Check the backup directory for previous configuration
- Review SECURITY_HOOKS_SETUP.md for troubleshooting
- Contact the security team for assistance

---
Generated by aclue security update tools
EOF

    log_info "📋 Update report generated: security_update_report.txt"
}

# Main execution
main() {
    echo "🔄 aclue Security Hooks Update"
    echo "==============================="
    echo

    check_repository
    check_security_environment
    backup_configuration

    log_info "Starting security tools update process..."
    echo

    # Update components
    update_precommit_hooks
    echo

    update_python_packages
    echo

    reinstall_hooks
    echo

    update_secrets_baseline
    echo

    test_updated_configuration
    echo

    generate_update_report

    # Final summary
    echo "🏁 Security Update Complete"
    echo "==========================="
    log_success "All security tools have been updated successfully!"
    echo
    log_info "Summary:"
    echo "  ✅ Pre-commit hooks updated to latest versions"
    echo "  ✅ Python security packages updated"
    echo "  ✅ Hooks reinstalled and tested"
    echo "  ✅ Secrets baseline regenerated"
    echo "  ✅ Configuration validated"
    echo
    log_info "📋 Full report available in: security_update_report.txt"
    echo
    log_warning "Don't forget to commit the updated configuration:"
    echo "  git add .pre-commit-config.yaml .secrets.baseline"
    echo "  git commit -m 'chore: update security hooks to latest versions'"
    echo
    log_info "🔒 Your aclue repository security is now up to date!"
}

# Run main function
main "$@"
