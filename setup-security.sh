#!/bin/bash

# aclue Security Setup Script
# This script sets up pre-commit hooks and security tools for the aclue platform

set -e

echo "🔒 Setting up aclue Security Tools..."

# Install pre-commit if not already installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    pip install pre-commit
fi

# Install the git hooks
echo "🔧 Installing git hooks..."
pre-commit install
pre-commit install --hook-type commit-msg

# Create secrets baseline
echo "🔍 Creating secrets baseline..."
detect-secrets scan --baseline .secrets.baseline

# Run initial security scan
echo "🛡️ Running initial security checks..."
pre-commit run --all-files || true

echo "✅ Security setup complete!"
echo ""
echo "Pre-commit hooks installed. They will run automatically on git commit."
echo "To run manually: pre-commit run --all-files"
echo ""
echo "🔒 Security tools configured:"
echo "  - Secret detection (detect-secrets, gitleaks)"
echo "  - Code quality (black, ruff, eslint)"
echo "  - Security scanning (bandit, safety)"
echo "  - Commit message validation (commitizen)"