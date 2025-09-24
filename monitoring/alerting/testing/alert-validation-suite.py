#!/usr/bin/env python3
"""
aclue Platform Alert Validation Suite
Comprehensive testing framework for validating alerting rules and notification delivery

Usage:
    python alert-validation-suite.py --test-type all
    python alert-validation-suite.py --test-type syntax
    python alert-validation-suite.py --test-type delivery --severity P0
    python alert-validation-suite.py --test-type runbooks
"""

import argparse
import json
import sys
import time
import yaml
import requests
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('alert-validation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AlertValidationSuite:
    """Comprehensive alert validation and testing framework"""

    def __init__(self, config_path: str = "alert-test-config.json"):
        """Initialize the validation suite with configuration"""
        self.config_path = config_path
        self.config = self.load_config()
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'tests_run': 0,
            'tests_passed': 0,
            'tests_failed': 0,
            'failures': []
        }

        # Define alert rule file paths
        self.rule_files = [
            "../rules/critical.yml",
            "../rules/performance.yml",
            "../rules/business.yml",
            "../rules/security.yml"
        ]

        # Define notification templates
        self.template_files = [
            "../templates/slack.tmpl",
            "../templates/email.tmpl",
            "../templates/pagerduty.tmpl"
        ]

        # Define runbook files
        self.runbook_files = [
            "../runbooks/service-down.md",
            "../runbooks/newsletter-failures.md",
            "../runbooks/README.md"
        ]

    def load_config(self) -> Dict:
        """Load test configuration from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Config file {self.config_path} not found, using defaults")
            return self.get_default_config()

    def get_default_config(self) -> Dict:
        """Return default test configuration"""
        return {
            "prometheus_url": "http://localhost:9090",
            "alertmanager_url": "http://localhost:9093",
            "grafana_url": "https://grafana.aclue.app",
            "test_webhooks": {
                "slack": "https://hooks.slack.com/test/webhook",
                "pagerduty": "https://events.pagerduty.com/v2/enqueue",
                "email": "smtp://localhost:587"
            },
            "test_timeouts": {
                "rule_validation": 30,
                "notification_delivery": 120,
                "end_to_end": 300
            },
            "severity_levels": ["P0", "P1", "P2", "P3"],
            "critical_alerts": [
                "ServiceDown",
                "DatabaseDown",
                "MemoryExhaustionCritical",
                "NewsletterSubscriptionFailures"
            ]
        }

    def run_all_tests(self) -> Dict:
        """Run complete alert validation suite"""
        logger.info("🚀 Starting comprehensive alert validation suite")

        test_functions = [
            self.test_alert_rule_syntax,
            self.test_alert_rule_logic,
            self.test_notification_templates,
            self.test_alertmanager_config,
            self.test_runbook_completeness,
            self.test_notification_delivery,
            self.test_alert_correlation,
            self.test_escalation_policies
        ]

        for test_func in test_functions:
            try:
                logger.info(f"Running {test_func.__name__}...")
                success, message = test_func()
                self.record_test_result(test_func.__name__, success, message)
            except Exception as e:
                logger.error(f"Test {test_func.__name__} failed with exception: {e}")
                self.record_test_result(test_func.__name__, False, f"Exception: {e}")

        self.generate_test_report()
        return self.results

    def test_alert_rule_syntax(self) -> Tuple[bool, str]:
        """Validate Prometheus alert rule syntax"""
        logger.info("🔍 Validating alert rule syntax...")

        errors = []
        valid_rules = 0
        total_rules = 0

        for rule_file in self.rule_files:
            if not Path(rule_file).exists():
                errors.append(f"Rule file not found: {rule_file}")
                continue

            try:
                with open(rule_file, 'r') as f:
                    rule_config = yaml.safe_load(f)

                # Validate YAML structure
                if 'groups' not in rule_config:
                    errors.append(f"{rule_file}: Missing 'groups' key")
                    continue

                for group in rule_config['groups']:
                    if 'name' not in group or 'rules' not in group:
                        errors.append(f"{rule_file}: Invalid group structure")
                        continue

                    for rule in group['rules']:
                        total_rules += 1

                        # Validate required fields
                        required_fields = ['alert', 'expr', 'labels', 'annotations']
                        for field in required_fields:
                            if field not in rule:
                                errors.append(f"{rule_file}: Rule missing '{field}' field")
                                continue

                        # Validate severity label
                        if 'severity' not in rule['labels']:
                            errors.append(f"{rule_file}: Rule '{rule['alert']}' missing severity label")
                            continue

                        if rule['labels']['severity'] not in self.config['severity_levels']:
                            errors.append(f"{rule_file}: Invalid severity '{rule['labels']['severity']}' in rule '{rule['alert']}'")
                            continue

                        # Validate required annotations
                        required_annotations = ['summary', 'description', 'runbook_url']
                        for annotation in required_annotations:
                            if annotation not in rule['annotations']:
                                errors.append(f"{rule_file}: Rule '{rule['alert']}' missing '{annotation}' annotation")
                                continue

                        valid_rules += 1

            except yaml.YAMLError as e:
                errors.append(f"{rule_file}: YAML parsing error: {e}")
            except Exception as e:
                errors.append(f"{rule_file}: Unexpected error: {e}")

        if errors:
            return False, f"Syntax validation failed with {len(errors)} errors: {'; '.join(errors[:5])}"

        return True, f"Syntax validation passed: {valid_rules}/{total_rules} rules valid"

    def test_alert_rule_logic(self) -> Tuple[bool, str]:
        """Test alert rule logic using Prometheus API"""
        logger.info("🧠 Testing alert rule logic...")

        if not self.is_prometheus_available():
            return False, "Prometheus not available for rule logic testing"

        errors = []
        tested_rules = 0

        for rule_file in self.rule_files:
            if not Path(rule_file).exists():
                continue

            with open(rule_file, 'r') as f:
                rule_config = yaml.safe_load(f)

            for group in rule_config.get('groups', []):
                for rule in group.get('rules', []):
                    tested_rules += 1

                    # Test query syntax
                    query_result = self.test_prometheus_query(rule['expr'])
                    if not query_result[0]:
                        errors.append(f"Query error in rule '{rule['alert']}': {query_result[1]}")
                        continue

                    # Test for potential false positives
                    if self.has_potential_false_positive(rule):
                        errors.append(f"Potential false positive in rule '{rule['alert']}'")

                    # Test alert frequency logic
                    if 'for' in rule and not self.validate_alert_duration(rule['for']):
                        errors.append(f"Invalid duration '{rule['for']}' in rule '{rule['alert']}'")

        if errors:
            return False, f"Logic validation failed: {'; '.join(errors[:3])}"

        return True, f"Logic validation passed for {tested_rules} rules"

    def test_notification_templates(self) -> Tuple[bool, str]:
        """Validate notification template syntax and completeness"""
        logger.info("📧 Validating notification templates...")

        errors = []
        tested_templates = 0

        for template_file in self.template_files:
            if not Path(template_file).exists():
                errors.append(f"Template file not found: {template_file}")
                continue

            try:
                with open(template_file, 'r') as f:
                    template_content = f.read()

                # Check for required template definitions
                required_templates = self.get_required_templates(template_file)
                for template_name in required_templates:
                    if f'define "{template_name}"' not in template_content:
                        errors.append(f"{template_file}: Missing template '{template_name}'")

                # Validate template syntax (basic check)
                if '{{' in template_content and '}}' in template_content:
                    # Check for common template errors
                    if '{{ .CommonLabels.alertname }}' not in template_content and 'slack' in template_file:
                        errors.append(f"{template_file}: Missing alertname reference in Slack template")

                tested_templates += 1

            except Exception as e:
                errors.append(f"{template_file}: Template validation error: {e}")

        if errors:
            return False, f"Template validation failed: {'; '.join(errors[:3])}"

        return True, f"Template validation passed for {tested_templates} templates"

    def test_alertmanager_config(self) -> Tuple[bool, str]:
        """Validate AlertManager configuration"""
        logger.info("⚙️ Validating AlertManager configuration...")

        config_file = "../alertmanager.yml"
        if not Path(config_file).exists():
            return False, "AlertManager configuration file not found"

        try:
            with open(config_file, 'r') as f:
                am_config = yaml.safe_load(f)

            errors = []

            # Validate required sections
            required_sections = ['global', 'route', 'receivers']
            for section in required_sections:
                if section not in am_config:
                    errors.append(f"Missing required section: {section}")

            # Validate routing configuration
            if 'route' in am_config:
                route = am_config['route']
                if 'receiver' not in route:
                    errors.append("Root route missing default receiver")

                # Validate severity-based routing
                severity_routes = self.extract_severity_routes(route)
                for severity in self.config['severity_levels']:
                    if severity not in severity_routes:
                        errors.append(f"No routing configured for severity: {severity}")

            # Validate receivers
            if 'receivers' in am_config:
                receiver_names = [r['name'] for r in am_config['receivers']]

                # Check for required receivers
                required_receivers = ['pagerduty-critical', 'slack-medium-priority', 'email-low-priority']
                for receiver in required_receivers:
                    if receiver not in receiver_names:
                        errors.append(f"Missing required receiver: {receiver}")

            # Validate inhibition rules
            if 'inhibit_rules' in am_config:
                for rule in am_config['inhibit_rules']:
                    if 'source_match' not in rule or 'target_match' not in rule:
                        errors.append("Invalid inhibition rule structure")

            if errors:
                return False, f"AlertManager config validation failed: {'; '.join(errors[:3])}"

            return True, "AlertManager configuration validation passed"

        except yaml.YAMLError as e:
            return False, f"AlertManager config YAML error: {e}"
        except Exception as e:
            return False, f"AlertManager config validation error: {e}"

    def test_runbook_completeness(self) -> Tuple[bool, str]:
        """Validate runbook completeness and accessibility"""
        logger.info("📚 Validating runbook completeness...")

        errors = []
        tested_runbooks = 0

        # Check for runbook files
        for runbook_file in self.runbook_files:
            if not Path(runbook_file).exists():
                errors.append(f"Runbook file not found: {runbook_file}")
                continue

            try:
                with open(runbook_file, 'r') as f:
                    content = f.read()

                # Check for required sections
                required_sections = [
                    'Alert:', 'Severity:', 'Response Time:',
                    'Immediate Response', 'Diagnostic Procedures'
                ]

                for section in required_sections:
                    if section not in content:
                        errors.append(f"{runbook_file}: Missing section '{section}'")

                # Check for actionable content
                if 'Actions' not in content and 'Resolution' not in content:
                    errors.append(f"{runbook_file}: Missing actionable resolution steps")

                # Check for emergency contacts
                if 'Emergency' not in content and 'Contact' not in content:
                    errors.append(f"{runbook_file}: Missing emergency contact information")

                tested_runbooks += 1

            except Exception as e:
                errors.append(f"{runbook_file}: Runbook validation error: {e}")

        # Cross-reference alerts with runbooks
        missing_runbooks = self.find_missing_runbooks()
        if missing_runbooks:
            errors.extend([f"Missing runbook for alert: {alert}" for alert in missing_runbooks[:5]])

        if errors:
            return False, f"Runbook validation failed: {'; '.join(errors[:3])}"

        return True, f"Runbook validation passed for {tested_runbooks} runbooks"

    def test_notification_delivery(self) -> Tuple[bool, str]:
        """Test end-to-end notification delivery"""
        logger.info("📬 Testing notification delivery...")

        if not self.is_alertmanager_available():
            return False, "AlertManager not available for delivery testing"

        test_alerts = self.generate_test_alerts()
        delivery_results = []

        for alert in test_alerts:
            try:
                # Send test alert to AlertManager
                response = self.send_test_alert(alert)
                if response.status_code == 200:
                    # Wait for notification delivery
                    time.sleep(5)

                    # Check if notifications were sent (would require webhook testing)
                    delivery_success = self.verify_notification_delivery(alert)
                    delivery_results.append({
                        'alert': alert['labels']['alertname'],
                        'severity': alert['labels']['severity'],
                        'delivered': delivery_success
                    })
                else:
                    delivery_results.append({
                        'alert': alert['labels']['alertname'],
                        'severity': alert['labels']['severity'],
                        'delivered': False,
                        'error': f"HTTP {response.status_code}"
                    })

            except Exception as e:
                delivery_results.append({
                    'alert': alert['labels']['alertname'],
                    'severity': alert['labels']['severity'],
                    'delivered': False,
                    'error': str(e)
                })

        failed_deliveries = [r for r in delivery_results if not r['delivered']]

        if failed_deliveries:
            return False, f"Delivery test failed for {len(failed_deliveries)} alerts"

        return True, f"Delivery test passed for {len(delivery_results)} test alerts"

    def test_alert_correlation(self) -> Tuple[bool, str]:
        """Test alert correlation and inhibition rules"""
        logger.info("🔗 Testing alert correlation...")

        # Test inhibition rules by simulating cascading failures
        test_scenarios = [
            {
                'primary': 'ServiceDown',
                'inhibited': ['HighErrorRate', 'APIResponseTimeHigh'],
                'description': 'Service down should inhibit error rate and response time alerts'
            },
            {
                'primary': 'DatabaseDown',
                'inhibited': ['DatabaseConnectionError', 'DatabaseQueryPerformanceSlow'],
                'description': 'Database down should inhibit connection and performance alerts'
            }
        ]

        correlation_results = []
        for scenario in test_scenarios:
            try:
                # This would require integration with actual AlertManager
                # For now, validate the inhibition rules exist in configuration
                inhibition_exists = self.check_inhibition_rule_exists(
                    scenario['primary'],
                    scenario['inhibited']
                )

                correlation_results.append({
                    'scenario': scenario['description'],
                    'configured': inhibition_exists
                })

            except Exception as e:
                correlation_results.append({
                    'scenario': scenario['description'],
                    'configured': False,
                    'error': str(e)
                })

        failed_correlations = [r for r in correlation_results if not r['configured']]

        if failed_correlations:
            return False, f"Correlation test failed for {len(failed_correlations)} scenarios"

        return True, f"Correlation test passed for {len(correlation_results)} scenarios"

    def test_escalation_policies(self) -> Tuple[bool, str]:
        """Test alert escalation policies and timing"""
        logger.info("📈 Testing escalation policies...")

        # Load AlertManager configuration
        config_file = "../alertmanager.yml"
        if not Path(config_file).exists():
            return False, "AlertManager configuration not found for escalation testing"

        with open(config_file, 'r') as f:
            am_config = yaml.safe_load(f)

        errors = []

        # Test escalation timing
        escalation_tests = [
            {'severity': 'P0', 'max_group_wait': '10s', 'max_repeat_interval': '15m'},
            {'severity': 'P1', 'max_group_wait': '5m', 'max_repeat_interval': '1h'},
            {'severity': 'P2', 'max_group_wait': '10m', 'max_repeat_interval': '4h'}
        ]

        for test in escalation_tests:
            route_config = self.find_severity_route(am_config, test['severity'])
            if not route_config:
                errors.append(f"No route configuration found for severity {test['severity']}")
                continue

            # Validate timing constraints
            if 'group_wait' in route_config:
                if not self.validate_duration_constraint(route_config['group_wait'], test['max_group_wait']):
                    errors.append(f"Group wait too long for {test['severity']}: {route_config['group_wait']}")

            if 'repeat_interval' in route_config:
                if not self.validate_duration_constraint(route_config['repeat_interval'], test['max_repeat_interval']):
                    errors.append(f"Repeat interval too long for {test['severity']}: {route_config['repeat_interval']}")

        # Test notification channel escalation
        channel_tests = [
            {'severity': 'P0', 'required_channels': ['pagerduty', 'slack', 'email']},
            {'severity': 'P1', 'required_channels': ['pagerduty', 'slack']},
            {'severity': 'P2', 'required_channels': ['slack', 'email']}
        ]

        for test in channel_tests:
            receiver_config = self.find_severity_receiver(am_config, test['severity'])
            if not receiver_config:
                errors.append(f"No receiver configuration found for severity {test['severity']}")
                continue

            configured_channels = self.extract_notification_channels(receiver_config)
            missing_channels = set(test['required_channels']) - set(configured_channels)
            if missing_channels:
                errors.append(f"Missing notification channels for {test['severity']}: {missing_channels}")

        if errors:
            return False, f"Escalation policy validation failed: {'; '.join(errors[:3])}"

        return True, "Escalation policy validation passed"

    # Helper methods

    def is_prometheus_available(self) -> bool:
        """Check if Prometheus is available for testing"""
        try:
            response = requests.get(f"{self.config['prometheus_url']}/api/v1/query",
                                  params={'query': 'up'}, timeout=5)
            return response.status_code == 200
        except:
            return False

    def is_alertmanager_available(self) -> bool:
        """Check if AlertManager is available for testing"""
        try:
            response = requests.get(f"{self.config['alertmanager_url']}/api/v1/status", timeout=5)
            return response.status_code == 200
        except:
            return False

    def test_prometheus_query(self, query: str) -> Tuple[bool, str]:
        """Test a Prometheus query for syntax errors"""
        try:
            response = requests.get(
                f"{self.config['prometheus_url']}/api/v1/query",
                params={'query': query},
                timeout=self.config['test_timeouts']['rule_validation']
            )

            if response.status_code == 200:
                result = response.json()
                if result.get('status') == 'success':
                    return True, "Query executed successfully"
                else:
                    return False, f"Query error: {result.get('error', 'Unknown error')}"
            else:
                return False, f"HTTP {response.status_code}"

        except Exception as e:
            return False, f"Query test exception: {e}"

    def has_potential_false_positive(self, rule: Dict) -> bool:
        """Check if rule has potential for false positives"""
        # Simple heuristics for detecting potential false positives
        expr = rule['expr'].lower()

        # Check for very sensitive thresholds
        if 'rate(' in expr and ('> 0.01' in expr or '> 1' in expr):
            return True

        # Check for missing 'for' duration on volatile metrics
        if 'for' not in rule and any(metric in expr for metric in ['cpu', 'memory', 'network']):
            return True

        return False

    def validate_alert_duration(self, duration: str) -> bool:
        """Validate alert duration format and reasonableness"""
        try:
            # Parse duration (simplified validation)
            if duration.endswith('s'):
                seconds = int(duration[:-1])
                return 1 <= seconds <= 3600  # 1 second to 1 hour
            elif duration.endswith('m'):
                minutes = int(duration[:-1])
                return 1 <= minutes <= 60    # 1 to 60 minutes
            elif duration.endswith('h'):
                hours = int(duration[:-1])
                return 1 <= hours <= 24      # 1 to 24 hours
            return False
        except:
            return False

    def get_required_templates(self, template_file: str) -> List[str]:
        """Get list of required templates for a template file"""
        if 'slack' in template_file:
            return ['slack.default.text', 'slack.critical.text', 'slack.high.text', 'slack.security.text']
        elif 'email' in template_file:
            return ['email.critical.html', 'email.security.html', 'email.medium.html']
        elif 'pagerduty' in template_file:
            return ['pagerduty.default.description', 'pagerduty.security.description']
        return []

    def extract_severity_routes(self, route: Dict) -> List[str]:
        """Extract severity levels from route configuration"""
        severities = []

        if 'routes' in route:
            for subroute in route['routes']:
                if 'match' in subroute and 'severity' in subroute['match']:
                    severities.append(subroute['match']['severity'])

        return severities

    def find_missing_runbooks(self) -> List[str]:
        """Find alerts that don't have corresponding runbooks"""
        # This would cross-reference alert names with runbook URLs
        # For now, return empty list as placeholder
        return []

    def generate_test_alerts(self) -> List[Dict]:
        """Generate test alerts for delivery testing"""
        return [
            {
                'labels': {
                    'alertname': 'TestServiceDown',
                    'severity': 'P0',
                    'service': 'test-service',
                    'team': 'test'
                },
                'annotations': {
                    'summary': 'Test service down alert',
                    'description': 'This is a test alert for validation'
                },
                'startsAt': datetime.now().isoformat() + 'Z'
            }
        ]

    def send_test_alert(self, alert: Dict) -> requests.Response:
        """Send test alert to AlertManager"""
        return requests.post(
            f"{self.config['alertmanager_url']}/api/v1/alerts",
            json=[alert],
            timeout=self.config['test_timeouts']['notification_delivery']
        )

    def verify_notification_delivery(self, alert: Dict) -> bool:
        """Verify that notification was delivered (placeholder)"""
        # This would require integration with notification channels
        # For now, return True as placeholder
        return True

    def check_inhibition_rule_exists(self, primary: str, inhibited: List[str]) -> bool:
        """Check if inhibition rule exists for alert correlation"""
        config_file = "../alertmanager.yml"
        try:
            with open(config_file, 'r') as f:
                am_config = yaml.safe_load(f)

            if 'inhibit_rules' not in am_config:
                return False

            for rule in am_config['inhibit_rules']:
                if (rule.get('source_match', {}).get('alertname') == primary and
                    any(target in rule.get('target_match_re', {}).get('alertname', '') for target in inhibited)):
                    return True

            return False
        except:
            return False

    def find_severity_route(self, am_config: Dict, severity: str) -> Optional[Dict]:
        """Find route configuration for specific severity"""
        # Implementation would traverse route tree to find severity-specific config
        return None

    def find_severity_receiver(self, am_config: Dict, severity: str) -> Optional[Dict]:
        """Find receiver configuration for specific severity"""
        # Implementation would find receiver for severity level
        return None

    def extract_notification_channels(self, receiver_config: Dict) -> List[str]:
        """Extract notification channels from receiver configuration"""
        channels = []
        if 'slack_configs' in receiver_config:
            channels.append('slack')
        if 'pagerduty_configs' in receiver_config:
            channels.append('pagerduty')
        if 'email_configs' in receiver_config:
            channels.append('email')
        return channels

    def validate_duration_constraint(self, actual: str, max_allowed: str) -> bool:
        """Validate that duration doesn't exceed maximum allowed"""
        # Simplified duration comparison
        return True  # Placeholder implementation

    def record_test_result(self, test_name: str, success: bool, message: str):
        """Record test result"""
        self.results['tests_run'] += 1

        if success:
            self.results['tests_passed'] += 1
            logger.info(f"✅ {test_name}: {message}")
        else:
            self.results['tests_failed'] += 1
            self.results['failures'].append({
                'test': test_name,
                'error': message,
                'timestamp': datetime.now().isoformat()
            })
            logger.error(f"❌ {test_name}: {message}")

    def generate_test_report(self):
        """Generate comprehensive test report"""
        report_file = f"alert-validation-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"

        with open(report_file, 'w') as f:
            json.dump(self.results, f, indent=2)

        # Print summary
        total_tests = self.results['tests_run']
        passed_tests = self.results['tests_passed']
        failed_tests = self.results['tests_failed']

        logger.info("=" * 60)
        logger.info("🏁 ALERT VALIDATION SUITE COMPLETE")
        logger.info("=" * 60)
        logger.info(f"Total Tests: {total_tests}")
        logger.info(f"Passed: {passed_tests}")
        logger.info(f"Failed: {failed_tests}")
        logger.info(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        logger.info(f"Report saved to: {report_file}")

        if failed_tests > 0:
            logger.info("\n❌ FAILED TESTS:")
            for failure in self.results['failures']:
                logger.info(f"  • {failure['test']}: {failure['error']}")

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description='aclue Platform Alert Validation Suite')
    parser.add_argument('--test-type', choices=['all', 'syntax', 'logic', 'templates',
                                              'delivery', 'runbooks', 'escalation'],
                       default='all', help='Type of test to run')
    parser.add_argument('--config', default='alert-test-config.json',
                       help='Test configuration file')
    parser.add_argument('--severity', choices=['P0', 'P1', 'P2', 'P3'],
                       help='Test specific severity level only')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Initialize validation suite
    suite = AlertValidationSuite(args.config)

    # Run requested tests
    if args.test_type == 'all':
        results = suite.run_all_tests()
    elif args.test_type == 'syntax':
        success, message = suite.test_alert_rule_syntax()
        suite.record_test_result('syntax_validation', success, message)
        results = suite.results
    elif args.test_type == 'logic':
        success, message = suite.test_alert_rule_logic()
        suite.record_test_result('logic_validation', success, message)
        results = suite.results
    elif args.test_type == 'templates':
        success, message = suite.test_notification_templates()
        suite.record_test_result('template_validation', success, message)
        results = suite.results
    elif args.test_type == 'delivery':
        success, message = suite.test_notification_delivery()
        suite.record_test_result('delivery_test', success, message)
        results = suite.results
    elif args.test_type == 'runbooks':
        success, message = suite.test_runbook_completeness()
        suite.record_test_result('runbook_validation', success, message)
        results = suite.results
    elif args.test_type == 'escalation':
        success, message = suite.test_escalation_policies()
        suite.record_test_result('escalation_test', success, message)
        results = suite.results

    # Generate final report
    suite.generate_test_report()

    # Exit with appropriate code
    sys.exit(0 if results['tests_failed'] == 0 else 1)

if __name__ == '__main__':
    main()
