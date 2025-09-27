"""
GDPR Compliance Test for Email Template
Checks the email template for GDPR violations and privacy compliance

Test Coverage:
- Unsubscribe functionality presence
- Privacy policy links
- Data collection notices
- Marketing consent tracking
- Legal compliance statements
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add parent directories to path to import modules
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "web"))

# Color codes for output
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

class GDPRComplianceChecker:
    """
    GDPR and email marketing compliance checker
    Tests email templates against legal requirements
    """

    def __init__(self, template_path: str):
        self.template_path = template_path
        self.violations = []
        self.warnings = []
        self.passed_checks = []
        self.template_content = ""

    def load_template(self) -> bool:
        """Load the email template file"""
        try:
            with open(self.template_path, 'r', encoding='utf-8') as f:
                self.template_content = f.read()
            return True
        except Exception as e:
            print(f"{RED}Error loading template: {e}{RESET}")
            return False

    def check_unsubscribe_link(self) -> None:
        """
        CRITICAL: Check for unsubscribe functionality
        GDPR Article 21: Right to object to processing
        CAN-SPAM Act requirement
        """
        unsubscribe_patterns = [
            r'unsubscribe',
            r'opt[-\s]?out',
            r'manage[-\s]?preferences',
            r'email[-\s]?preferences',
            r'stop[-\s]?receiving',
            r'remove[-\s]?from[-\s]?list',
            r'update[-\s]?subscription'
        ]

        found = False
        for pattern in unsubscribe_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.violations.append({
                'severity': 'CRITICAL',
                'violation': 'Missing unsubscribe link',
                'regulation': 'GDPR Article 21 & CAN-SPAM Act',
                'requirement': 'All marketing emails MUST include a clear unsubscribe mechanism',
                'penalty': 'Up to €20 million or 4% of annual global turnover'
            })
        else:
            self.passed_checks.append('Unsubscribe link present')

    def check_privacy_policy_link(self) -> None:
        """
        Check for privacy policy link
        GDPR Article 13: Information to be provided
        """
        privacy_patterns = [
            r'privacy[-\s]?policy',
            r'data[-\s]?protection',
            r'privacy[-\s]?notice',
            r'privacy[-\s]?statement'
        ]

        found = False
        for pattern in privacy_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.violations.append({
                'severity': 'HIGH',
                'violation': 'Missing privacy policy link',
                'regulation': 'GDPR Article 13',
                'requirement': 'Must provide clear information about data processing',
                'penalty': 'Regulatory fines and loss of user trust'
            })
        else:
            self.passed_checks.append('Privacy policy link present')

    def check_sender_identification(self) -> None:
        """
        Check for clear sender identification
        CAN-SPAM requirement for sender information
        """
        sender_patterns = [
            r'aclue[-\s]?team',
            r'from[-\s]?aclue',
            r'aclue\.app',
            r'aclue\.co\.uk'
        ]

        found = False
        for pattern in sender_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if found:
            self.passed_checks.append('Clear sender identification present')
        else:
            self.warnings.append({
                'severity': 'MEDIUM',
                'warning': 'Sender identification could be clearer',
                'recommendation': 'Include clear company name and contact information'
            })

    def check_physical_address(self) -> None:
        """
        Check for physical mailing address
        CAN-SPAM Act requirement
        """
        # Check for address patterns
        address_patterns = [
            r'\d+\s+\w+\s+(street|st|avenue|ave|road|rd|boulevard|blvd)',
            r'(po|p\.o\.)\s+box',
            r'\w+,\s+\w+\s+\d{5}',  # City, State ZIP
            r'registered\s+office',
            r'company\s+address'
        ]

        found = False
        for pattern in address_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.violations.append({
                'severity': 'HIGH',
                'violation': 'Missing physical mailing address',
                'regulation': 'CAN-SPAM Act',
                'requirement': 'Must include valid physical postal address',
                'penalty': 'Up to $51,744 per email violation'
            })
        else:
            self.passed_checks.append('Physical address present')

    def check_consent_reference(self) -> None:
        """
        Check for reference to how consent was obtained
        GDPR Article 7: Conditions for consent
        """
        consent_patterns = [
            r'subscribed',
            r'signed[-\s]?up',
            r'opted[-\s]?in',
            r'requested',
            r'joined',
            r'registered'
        ]

        found = False
        for pattern in consent_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if found:
            self.passed_checks.append('Consent reference present')
        else:
            self.warnings.append({
                'severity': 'MEDIUM',
                'warning': 'No clear reference to how consent was obtained',
                'recommendation': 'Include reminder of how/when user subscribed'
            })

    def check_data_retention_info(self) -> None:
        """
        Check for data retention information
        GDPR Article 13(2)(a): Storage period
        """
        retention_patterns = [
            r'data[-\s]?retention',
            r'how[-\s]?long',
            r'storage[-\s]?period',
            r'keep[-\s]?your[-\s]?data'
        ]

        found = False
        for pattern in retention_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.warnings.append({
                'severity': 'LOW',
                'warning': 'No data retention information',
                'recommendation': 'Consider adding information about data storage period'
            })

    def check_third_party_sharing(self) -> None:
        """
        Check for third-party data sharing disclosure
        GDPR Article 13(1)(e): Recipients of personal data
        """
        sharing_patterns = [
            r'third[-\s]?part',
            r'share[-\s]?your[-\s]?data',
            r'partners',
            r'data[-\s]?sharing'
        ]

        found = False
        for pattern in sharing_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.warnings.append({
                'severity': 'LOW',
                'warning': 'No third-party sharing disclosure',
                'recommendation': 'If data is shared with third parties, this must be disclosed'
            })

    def check_data_rights_info(self) -> None:
        """
        Check for information about data subject rights
        GDPR Articles 15-22: Data subject rights
        """
        rights_patterns = [
            r'your[-\s]?rights',
            r'data[-\s]?rights',
            r'right[-\s]?to[-\s]?access',
            r'right[-\s]?to[-\s]?delete',
            r'right[-\s]?to[-\s]?rectif',
            r'right[-\s]?to[-\s]?portability'
        ]

        found = False
        for pattern in rights_patterns:
            if re.search(pattern, self.template_content, re.IGNORECASE):
                found = True
                break

        if not found:
            self.warnings.append({
                'severity': 'MEDIUM',
                'warning': 'No information about data subject rights',
                'recommendation': 'Include information about user rights under GDPR'
            })

    def run_all_checks(self) -> None:
        """Run all GDPR compliance checks"""
        print(f"\n{BOLD}{BLUE}🔍 GDPR & Email Marketing Compliance Analysis{RESET}")
        print(f"{BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        print(f"Testing: {self.template_path}\n")

        if not self.load_template():
            return

        # Run all compliance checks
        self.check_unsubscribe_link()
        self.check_privacy_policy_link()
        self.check_sender_identification()
        self.check_physical_address()
        self.check_consent_reference()
        self.check_data_retention_info()
        self.check_third_party_sharing()
        self.check_data_rights_info()

        # Display results
        self.display_results()

    def display_results(self) -> None:
        """Display compliance test results"""

        # Critical Violations
        if self.violations:
            print(f"\n{BOLD}{RED}❌ CRITICAL VIOLATIONS FOUND{RESET}")
            print(f"{RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}\n")

            for violation in self.violations:
                print(f"{RED}[{violation['severity']}]{RESET} {violation['violation']}")
                print(f"  📜 Regulation: {violation['regulation']}")
                print(f"  📋 Requirement: {violation['requirement']}")
                print(f"  ⚠️  Penalty: {violation['penalty']}\n")

        # Warnings
        if self.warnings:
            print(f"\n{BOLD}{YELLOW}⚠️  WARNINGS & RECOMMENDATIONS{RESET}")
            print(f"{YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}\n")

            for warning in self.warnings:
                print(f"{YELLOW}[{warning['severity']}]{RESET} {warning['warning']}")
                print(f"  💡 Recommendation: {warning['recommendation']}\n")

        # Passed Checks
        if self.passed_checks:
            print(f"\n{BOLD}{GREEN}✅ PASSED CHECKS{RESET}")
            print(f"{GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}\n")

            for check in self.passed_checks:
                print(f"{GREEN}✓{RESET} {check}")

        # Summary
        print(f"\n{BOLD}📊 COMPLIANCE SUMMARY{RESET}")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        total_checks = len(self.violations) + len(self.warnings) + len(self.passed_checks)
        compliance_score = (len(self.passed_checks) / total_checks * 100) if total_checks > 0 else 0

        print(f"Critical Violations: {RED}{len(self.violations)}{RESET}")
        print(f"Warnings: {YELLOW}{len(self.warnings)}{RESET}")
        print(f"Passed: {GREEN}{len(self.passed_checks)}{RESET}")
        print(f"Compliance Score: {self._get_score_color(compliance_score)}{compliance_score:.1f}%{RESET}")

        # Overall Status
        print(f"\n{BOLD}🎯 OVERALL STATUS:{RESET} ", end="")
        if self.violations:
            print(f"{RED}FAIL - IMMEDIATE ACTION REQUIRED{RESET}")
            print(f"\n{RED}The email template has critical GDPR violations that must be fixed{RESET}")
            print(f"{RED}before sending any marketing emails to avoid legal penalties.{RESET}")
        elif self.warnings:
            print(f"{YELLOW}PASS WITH WARNINGS{RESET}")
            print(f"\n{YELLOW}The email template meets minimum requirements but could be improved.{RESET}")
        else:
            print(f"{GREEN}FULLY COMPLIANT{RESET}")
            print(f"\n{GREEN}The email template meets all GDPR and email marketing requirements.{RESET}")

        # Recommendations
        if self.violations or self.warnings:
            print(f"\n{BOLD}🔧 REQUIRED FIXES:{RESET}")
            print("1. Add an unsubscribe link at the bottom of the email")
            print("2. Include your company's physical mailing address")
            print("3. Add a link to your privacy policy")
            print("4. Consider adding information about data subject rights")
            print("5. Include information about why the user is receiving this email")

    def _get_score_color(self, score: float) -> str:
        """Get color based on compliance score"""
        if score >= 80:
            return GREEN
        elif score >= 60:
            return YELLOW
        else:
            return RED


def main():
    """Main function to run GDPR compliance tests"""

    # Check if we should test secure template
    if len(sys.argv) > 1 and sys.argv[1] == '--secure':
        template_path = "/home/jack/Documents/aclue-preprod/web/src/app/email-preview/secure-email-template.tsx"
        print(f"{GREEN}Testing SECURE email template...{RESET}\n")
    else:
        template_path = "/home/jack/Documents/aclue-preprod/web/src/app/email-preview/page.tsx"
        print(f"{YELLOW}Testing ORIGINAL email template...{RESET}\n")

    # Create and run compliance checker
    checker = GDPRComplianceChecker(template_path)
    checker.run_all_checks()

    # Return exit code based on violations
    if checker.violations:
        sys.exit(1)  # Fail with violations
    else:
        sys.exit(0)  # Pass


if __name__ == "__main__":
    main()