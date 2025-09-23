#!/bin/bash
# aclue Project - Setup Package Extraction Script
# This script automatically extracts and places all configuration files in the correct locations

echo "=== aclue Project Setup Package Extraction ==="

# Check if we're in the correct directory
if [ ! -f "CLAUDE.md" ] || [ ! -d "backend" ] || [ ! -d "web" ]; then
    echo "Error: Please run this script from the aclue project root directory"
    echo "Expected files: CLAUDE.md, backend/, web/"
    exit 1
fi

echo "✓ Project root directory detected"

# Extract environment files
echo "Extracting environment configuration files..."

# Backend environment files
if [ -f "backend_env" ]; then
    cp backend_env backend/.env
    echo "✓ backend/.env restored"
else
    echo "Warning: backend_env not found in package"
fi

if [ -f "backend_env_production" ]; then
    cp backend_env_production backend/.env.production
    echo "✓ backend/.env.production restored"
fi

# Frontend environment files  
if [ -f "web_env_local" ]; then
    cp web_env_local web/.env.local
    echo "✓ web/.env.local restored"
else
    echo "Warning: web_env_local not found in package"
fi

if [ -f "web_env_production" ]; then
    cp web_env_production web/.env.production
    echo "✓ web/.env.production restored"
fi

# Set up Python virtual environment
if [ -f "venv_setup.sh" ]; then
    echo "Setting up Python virtual environment..."
    chmod +x venv_setup.sh
    ./venv_setup.sh
    
    if [ $? -eq 0 ]; then
        echo "✓ Python virtual environment setup complete"
    else
        echo "Warning: Virtual environment setup encountered issues"
    fi
else
    echo "Warning: venv_setup.sh not found"
fi

# Verification
echo ""
echo "=== Verification ==="

# Check environment files
missing_files=()

if [ ! -f "backend/.env" ]; then
    missing_files+=("backend/.env")
fi

if [ ! -f "web/.env.local" ]; then
    missing_files+=("web/.env.local")
fi

if [ ! -d "backend/venv" ]; then
    missing_files+=("backend/venv/")
fi

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✓ All critical files restored successfully"
else
    echo "Warning: Missing files detected:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
fi

# Clean up extracted files
echo ""
echo "Cleaning up extraction files..."
rm -f backend_env backend_env_production web_env_local web_env_production venv_setup.sh

echo ""
echo "=== Extraction Complete ==="
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "2. Start frontend: cd web && npm install && npm run dev"
echo "3. Execute: 'start project management' to activate context-manager as PROJECT LEAD"
echo ""
echo "Refer to DEVICE_SYNC_SETUP.md for complete setup instructions."