#!/usr/bin/env python3
"""
aclue Platform - Branding Consistency Fix Script

This script identifies and fixes remaining legacy branding references
in the codebase after the comprehensive rebranding from GiftSync/prznt to aclue.

Usage:
    python fix_branding_issues.py [--dry-run] [--verbose]
"""

import os
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

class BrandingFixer:
    """Fixes legacy branding references in the codebase"""

    def __init__(self, project_root: str, dry_run: bool = False, verbose: bool = False):
        self.project_root = Path(project_root)
        self.dry_run = dry_run
        self.verbose = verbose

        # Branding replacement patterns
        self.replacements = {
            # Case-sensitive replacements
            'GiftSync': 'aclue',
            'GIFTSYNC': 'ACLUE',
            'giftsync': 'aclue',
            'prznt': 'aclue',
            'PRZNT': 'ACLUE',
            'Prznt': 'aclue',

            # URL and domain replacements
            'prznt.app': 'aclue.app',
            'giftsync.app': 'aclue.app',
            'giftsync-': 'aclue-',
            'prznt-': 'aclue-',

            # Service names
            'giftsync_': 'aclue_',
            'prznt_': 'aclue_',
            'GIFTSYNC_': 'ACLUE_',
            'PRZNT_': 'ACLUE_',

            # Database and bucket names
            'giftsync-assets': 'aclue-assets',
            'prznt-assets': 'aclue-assets',
            'giftsync-dev': 'aclue-dev',
            'prznt-dev': 'aclue-dev',

            # API endpoints
            'giftsync-backend': 'aclue-backend',
            'prznt-backend': 'aclue-backend',

            # AWS/Service identifiers
            'giftsync-recommendations': 'aclue-recommendations',
            'prznt-recommendations': 'aclue-recommendations',

            # Affiliate tags
            'giftsync-21': 'aclue-21',
            'prznt-21': 'aclue-21',
        }

        # Files to exclude from branding fixes
        self.exclude_patterns = [
            '*.pyc',
            '__pycache__',
            '.git',
            'node_modules',
            'venv',
            'backend_env',
            '.env',
            '*.log',
            '*.db',
            '*.sqlite',
            'fix_branding_issues.py',  # Don't modify this script
            'config_verification_suite.py',  # Don't modify verification script
        ]

        # File extensions to process
        self.include_extensions = [
            '.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt',
            '.yml', '.yaml', '.toml', '.ini', '.conf', '.cfg', '.env.example'
        ]

    def should_process_file(self, file_path: Path) -> bool:
        """Check if file should be processed for branding fixes"""
        # Check if file matches exclude patterns
        for pattern in self.exclude_patterns:
            if pattern in str(file_path):
                return False

        # Check file extension
        if file_path.suffix not in self.include_extensions:
            return False

        # Skip binary files
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                f.read(100)  # Try to read first 100 chars
            return True
        except (UnicodeDecodeError, PermissionError):
            return False

    def find_branding_issues(self, content: str) -> List[Tuple[str, str, int]]:
        """Find branding issues in content"""
        issues = []
        lines = content.split('\n')

        for line_num, line in enumerate(lines, 1):
            for old_brand, new_brand in self.replacements.items():
                if old_brand in line:
                    issues.append((old_brand, new_brand, line_num))

        return issues

    def fix_branding_in_content(self, content: str) -> Tuple[str, int]:
        """Fix branding issues in content and return updated content and fix count"""
        original_content = content
        fix_count = 0

        for old_brand, new_brand in self.replacements.items():
            if old_brand in content:
                old_count = content.count(old_brand)
                content = content.replace(old_brand, new_brand)
                fix_count += old_count

        return content, fix_count

    def process_file(self, file_path: Path) -> Dict[str, any]:
        """Process a single file for branding fixes"""
        result = {
            'file': str(file_path),
            'processed': False,
            'issues_found': [],
            'fixes_applied': 0,
            'error': None
        }

        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()

            # Find issues
            issues = self.find_branding_issues(original_content)
            result['issues_found'] = issues

            if issues:
                # Apply fixes
                fixed_content, fix_count = self.fix_branding_in_content(original_content)
                result['fixes_applied'] = fix_count

                if not self.dry_run and fixed_content != original_content:
                    # Write fixed content back to file
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(fixed_content)
                    result['processed'] = True

                if self.verbose and issues:
                    print(f"📄 {file_path.relative_to(self.project_root)}")
                    for old_brand, new_brand, line_num in issues:
                        action = "WOULD FIX" if self.dry_run else "FIXED"
                        print(f"   Line {line_num}: {old_brand} → {new_brand} ({action})")

        except Exception as e:
            result['error'] = str(e)
            if self.verbose:
                print(f"❌ Error processing {file_path}: {e}")

        return result

    def scan_and_fix(self) -> Dict[str, any]:
        """Scan project and fix branding issues"""
        print(f"🔍 Scanning {self.project_root} for branding issues...")
        if self.dry_run:
            print("🧪 DRY RUN MODE - No files will be modified")

        results = {
            'files_scanned': 0,
            'files_with_issues': 0,
            'files_processed': 0,
            'total_issues_found': 0,
            'total_fixes_applied': 0,
            'errors': [],
            'file_results': []
        }

        # Walk through project directory
        for root, dirs, files in os.walk(self.project_root):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if not any(pattern in d for pattern in self.exclude_patterns)]

            for file in files:
                file_path = Path(root) / file

                if self.should_process_file(file_path):
                    results['files_scanned'] += 1
                    file_result = self.process_file(file_path)
                    results['file_results'].append(file_result)

                    if file_result['issues_found']:
                        results['files_with_issues'] += 1
                        results['total_issues_found'] += len(file_result['issues_found'])

                    if file_result['processed']:
                        results['files_processed'] += 1

                    if file_result['fixes_applied']:
                        results['total_fixes_applied'] += file_result['fixes_applied']

                    if file_result['error']:
                        results['errors'].append(file_result['error'])

        return results

    def generate_report(self, results: Dict[str, any]) -> str:
        """Generate a summary report"""
        report = []
        report.append("=" * 60)
        report.append("ACLUE BRANDING CONSISTENCY FIX REPORT")
        report.append("=" * 60)

        # Summary statistics
        report.append(f"Files Scanned: {results['files_scanned']}")
        report.append(f"Files with Issues: {results['files_with_issues']}")
        report.append(f"Total Issues Found: {results['total_issues_found']}")

        if self.dry_run:
            report.append(f"Fixes That Would Be Applied: {results['total_fixes_applied']}")
            report.append("Status: DRY RUN - No changes made")
        else:
            report.append(f"Files Modified: {results['files_processed']}")
            report.append(f"Total Fixes Applied: {results['total_fixes_applied']}")
            report.append("Status: Changes applied to files")

        if results['errors']:
            report.append(f"Errors: {len(results['errors'])}")

        # Most common issues
        if results['file_results']:
            brand_counts = {}
            for file_result in results['file_results']:
                for old_brand, new_brand, line_num in file_result['issues_found']:
                    brand_counts[old_brand] = brand_counts.get(old_brand, 0) + 1

            if brand_counts:
                report.append("\nMost Common Legacy References:")
                for brand, count in sorted(brand_counts.items(), key=lambda x: x[1], reverse=True):
                    report.append(f"  {brand}: {count} occurrences")

        # Recommendations
        report.append("\nRecommendations:")
        if results['total_issues_found'] == 0:
            report.append("✅ No branding issues found - codebase is consistent")
        elif self.dry_run:
            report.append("🔧 Run without --dry-run to apply fixes")
            report.append("📋 Review the issues listed above before applying fixes")
        else:
            report.append("✅ Branding fixes have been applied")
            report.append("🧪 Run configuration verification again to confirm fixes")
            if results['errors']:
                report.append("⚠️  Review errors and fix manually if needed")

        report.append("=" * 60)
        return "\n".join(report)

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="Fix legacy branding references in aclue codebase"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be fixed without making changes"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed information about fixes"
    )
    parser.add_argument(
        "--project-root",
        default="/home/jack/Documents/aclue-preprod",
        help="Path to project root directory"
    )

    args = parser.parse_args()

    # Initialize fixer
    fixer = BrandingFixer(
        project_root=args.project_root,
        dry_run=args.dry_run,
        verbose=args.verbose
    )

    # Run scan and fix
    results = fixer.scan_and_fix()

    # Generate and display report
    report = fixer.generate_report(results)
    print("\n" + report)

    # Exit with appropriate code
    if results['errors']:
        return 1
    elif results['total_issues_found'] > 0 and args.dry_run:
        return 2  # Issues found but not fixed (dry run)
    else:
        return 0  # Success or no issues

if __name__ == "__main__":
    exit(main())