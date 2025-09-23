# Python Code Quality Analysis Summary

**Analysis Date:** Tue Sep 23 08:45:59 AM BST 2025
**Backend Directory:** /home/jack/Documents/aclue-preprod/backend
**Configuration Directory:** /home/jack/Documents/aclue-preprod/tests-22-sept/automated/code-quality/configs

## Tools Executed

1. **Ruff** - Ultra-fast Python linting (800+ rules)
   - Check report: `ruff_check_20250923_084107.json`
   - Format report: `ruff_format_20250923_084107.txt`

2. **Pylint** - Comprehensive code analysis
   - Report: `pylint_20250923_084107.json`

3. **Black** - Code formatting consistency
   - Report: `black_20250923_084107.txt`

4. **isort** - Import statement organisation
   - Report: `isort_20250923_084107.txt`

5. **mypy** - Static type checking
   - Report: `mypy_20250923_084107.txt`

6. **Bandit** - Security vulnerability scanning
   - Report: `bandit_20250923_084107.json`

## Analysis Scope

- **Target Directory:** `app/` (FastAPI backend)
- **Configuration Files:** Custom configurations with maximum rule sets
- **File Types:** `.py`, `.pyi` files
- **Exclusions:** Virtual environments, cache directories, migrations

## Next Steps

1. Review individual tool reports for detailed findings
2. Prioritise security issues from Bandit report
3. Address high-complexity functions identified by Pylint/Radon
4. Fix type checking issues from mypy report
5. Apply formatting fixes from Black and isort

## Report Files

All reports are saved in: `/home/jack/Documents/aclue-preprod/tests-22-sept/automated/code-quality/reports`

