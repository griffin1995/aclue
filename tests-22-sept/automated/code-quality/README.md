# aclue Platform - Automated Code Quality Suite

## Quick Start Guide

This directory contains comprehensive automated code quality tools for the aclue platform, covering both Python backend and TypeScript/React frontend with maximum analysis depth.

## 🚀 Execute Full Analysis

```bash
# Run comprehensive analysis of entire platform
./master_quality_scan.sh
```

## 🐍 Python Backend Analysis Only

```bash
# Analyse Python backend with all tools
./python_quality_scan.sh
```

## 🌐 Frontend Analysis Only

```bash
# Analyse TypeScript/React frontend
./typescript_quality_scan.sh
```

## 📊 Tools Included

### Python Backend (6 Core Tools)
- **Ruff** - Ultra-fast linting (800+ rules)
- **Pylint** - Comprehensive analysis
- **Black** - Code formatting
- **isort** - Import organisation
- **mypy** - Type checking
- **Bandit** - Security scanning

### Frontend (10+ Tools)
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Next.js Lint** - Framework rules
- **npm audit** - Security scanning
- **Bundle Analysis** - Performance

## 📁 Report Locations

All reports are saved to: `./reports/`

### Key Reports
- `MASTER_QUALITY_REPORT_[timestamp].md` - Complete overview
- `python_quality_summary_[timestamp].md` - Python analysis
- `typescript_quality_summary_[timestamp].md` - Frontend analysis

## ⚡ Integration Options

### Pre-commit Hooks
```bash
# Setup pre-commit integration
cp configs/commitlint.config.js ../../.commitlintrc.js
```

### CI/CD Pipeline
Add to your GitHub Actions or CI system:
```yaml
- name: Run Code Quality Analysis
  run: ./tests-22-sept/automated/code-quality/master_quality_scan.sh
```

## 🔧 Configuration Files

All tools are pre-configured with maximum analysis depth:
- `configs/ruff.toml` - Ruff configuration
- `configs/pylint.cfg` - Pylint settings
- `configs/pyproject.toml` - Python tools config
- `configs/.eslintrc.js` - ESLint rules
- `configs/.prettierrc.js` - Prettier settings
- `configs/commitlint.config.js` - Commit validation

## 🎯 Usage Examples

### Fix Python Formatting Issues
```bash
cd ../../backend
source venv/bin/activate
black .
isort .
```

### Fix TypeScript Formatting
```bash
cd ../../web
npx prettier --write "**/*.{js,jsx,ts,tsx,json,md,css,scss}"
```

### Check Security Issues
```bash
# Python security scan
cd ../../backend
bandit -r app/

# Frontend security scan
cd ../../web
npm audit
```

## 📈 Interpreting Results

### Priority Levels
1. **HIGH** - Security vulnerabilities, compilation errors
2. **MEDIUM** - Code quality issues, complexity warnings
3. **LOW** - Style inconsistencies, minor improvements

### Quick Wins
1. Run Black/Prettier to fix formatting
2. Run isort to organise imports
3. Address npm audit security issues
4. Fix TypeScript compilation errors

## 🛠️ Troubleshooting

### Python Virtual Environment
Ensure the backend virtual environment is activated:
```bash
cd ../../backend
source venv/bin/activate
```

### Node.js Dependencies
Ensure frontend dependencies are installed:
```bash
cd ../../web
npm install
```

### Report Files Too Large
Some reports may be large. Key files to review:
- JSON reports for programmatic analysis
- Markdown summaries for human review
- Security reports for immediate action

## 📚 Documentation

For detailed information, see:
- `CODE_QUALITY_DEPLOYMENT_SUMMARY.md` - Complete deployment details
- Individual report files in `./reports/`
- Tool-specific documentation in `./configs/`

---

**Ready to maintain enterprise-grade code quality at aclue! 🚀**