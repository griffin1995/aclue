#!/bin/bash
# Aclue Backend Virtual Environment Setup Script
# This script recreates the Python virtual environment with all required dependencies

echo "=== Aclue Backend Virtual Environment Setup ==="

# Check Python version
python_version=$(python3 --version 2>&1)
echo "Python version: $python_version"

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8+ before running this script"
    exit 1
fi

# Navigate to backend directory
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

cd backend

# Remove existing virtual environment if it exists
if [ -d "venv" ]; then
    echo "Removing existing virtual environment..."
    rm -rf venv
fi

# Create new virtual environment
echo "Creating new virtual environment..."
python3 -m venv venv

if [ ! -d "venv" ]; then
    echo "Error: Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Verify activation
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "Error: Failed to activate virtual environment"
    exit 1
fi

echo "Virtual environment activated: $VIRTUAL_ENV"

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
if [ -f "requirements.txt" ]; then
    echo "Installing requirements from requirements.txt..."
    pip install -r requirements.txt
else
    echo "Error: requirements.txt not found"
    exit 1
fi

# Verify key packages
echo "Verifying key package installations..."
python -c "
import sys
packages = ['fastapi', 'uvicorn', 'sqlalchemy', 'supabase', 'pydantic']
missing = []
for pkg in packages:
    try:
        __import__(pkg)
        print(f'✓ {pkg} installed')
    except ImportError:
        missing.append(pkg)
        print(f'✗ {pkg} missing')

if missing:
    print(f'Warning: Missing packages: {missing}')
    sys.exit(1)
else:
    print('All key packages installed successfully')
"

if [ $? -eq 0 ]; then
    echo "=== Virtual Environment Setup Complete ==="
    echo "To activate in future sessions, run:"
    echo "  cd backend && source venv/bin/activate"
    echo ""
    echo "To test the backend, run:"
    echo "  python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
else
    echo "Error: Package verification failed"
    exit 1
fi