#!/usr/bin/env python3

"""
GTmetrix Automation Script for aclue Platform
Configured for WAF allowlist compatibility

This script automates GTmetrix performance testing for the aclue platform
with proper headers and configuration to work with Cloudflare WAF allowlist.
"""

import requests
import json
import time
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import argparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('gtmetrix-automation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class GTmetrixAutomation:
    """GTmetrix API automation with WAF allowlist compatibility"""

    def __init__(self, api_key: str, email: str):
        """
        Initialize GTmetrix automation

        Args:
            api_key: GTmetrix API key
            email: GTmetrix account email
        """
        self.api_key = api_key
        self.email = email
        self.base_url = "https://gtmetrix.com/api/2.0"
        self.session = requests.Session()

        # WAF-compliant headers
        self.session.headers.update({
            'User-Agent': 'GTmetrix-API-Client/2.0 (aclue-monitoring; +https://aclue.app/monitoring)',
            'X-Test-Purpose': 'performance-monitoring',
            'X-Monitoring-Tool': 'gtmetrix',
            'X-Request-Source': 'aclue-performance-team',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })

        # Set authentication
        self.session.auth = (self.email, self.api_key)

        # Rate limiting compliance (WAF Tier 2: 30 requests/minute)
        self.request_interval = 2.5  # 2.5 seconds between requests = 24 req/min
        self.last_request_time = 0

        logger.info("GTmetrix automation initialized for aclue platform")
        logger.info("WAF Allowlist: Tier 2 Performance Testing")

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """
        Make rate-limited API request

        Args:
            method: HTTP method
            endpoint: API endpoint
            **kwargs: Additional request parameters

        Returns:
            JSON response data
        """
        # Respect rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.request_interval:
            sleep_time = self.request_interval - time_since_last
            logger.debug(f"Rate limiting: sleeping {sleep_time:.2f} seconds")
            time.sleep(sleep_time)

        url = f"{self.base_url}/{endpoint}"

        try:
            response = self.session.request(method, url, **kwargs)
            self.last_request_time = time.time()

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                logger.error("WAF blocking detected (403 Forbidden)")
                logger.error("Check allowlist configuration for GTmetrix IP ranges")
            raise
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
            raise

    def test_waf_access(self) -> bool:
        """
        Test WAF allowlist access

        Returns:
            True if access is granted, False otherwise
        """
        logger.info("Testing WAF allowlist access...")

        try:
            # Test direct access to aclue.app
            test_response = requests.get(
                "https://aclue.app",
                headers=self.session.headers,
                timeout=30
            )

            if test_response.status_code == 200:
                logger.info("✅ WAF allowlist access verified")
                return True
            elif test_response.status_code == 403:
                logger.error("❌ WAF blocking detected - check allowlist configuration")
                return False
            else:
                logger.warning(f"Unexpected response code: {test_response.status_code}")
                return True  # Proceed with caution

        except requests.exceptions.RequestException as e:
            logger.error(f"WAF access test failed: {e}")
            return False

    def get_account_status(self) -> Dict[str, Any]:
        """
        Get GTmetrix account status

        Returns:
            Account status information
        """
        logger.info("Retrieving account status...")
        return self._make_request('GET', 'status')

    def get_locations(self) -> List[Dict[str, Any]]:
        """
        Get available test locations

        Returns:
            List of available locations
        """
        logger.info("Retrieving available test locations...")
        response = self._make_request('GET', 'locations')
        return response.get('data', [])

    def get_browsers(self) -> List[Dict[str, Any]]:
        """
        Get available browsers

        Returns:
            List of available browsers
        """
        logger.info("Retrieving available browsers...")
        response = self._make_request('GET', 'browsers')
        return response.get('data', [])

    def start_test(self, url: str, **options) -> str:
        """
        Start a GTmetrix test

        Args:
            url: URL to test
            **options: Test configuration options

        Returns:
            Test ID
        """
        logger.info(f"Starting GTmetrix test for: {url}")

        # Default test configuration for aclue platform
        test_config = {
            'url': url,
            'location': options.get('location', 1),  # Default to Vancouver
            'browser': options.get('browser', 3),    # Default to Chrome
            'connection': options.get('connection', 'cable'),
            'video': options.get('video', False),    # Disable video to reduce load
            'retention_period': options.get('retention_period', 7),  # Keep for 7 days
            # WAF-friendly options
            'adblock': options.get('adblock', False),
            'cookies': options.get('cookies', ''),
            'http_auth_username': options.get('http_auth_username', ''),
            'http_auth_password': options.get('http_auth_password', ''),
        }

        response = self._make_request('POST', 'tests', json=test_config)
        test_id = response.get('data', {}).get('id')

        if test_id:
            logger.info(f"Test started successfully: {test_id}")
        else:
            logger.error("Failed to start test")

        return test_id

    def get_test_status(self, test_id: str) -> Dict[str, Any]:
        """
        Get test status

        Args:
            test_id: Test ID

        Returns:
            Test status information
        """
        return self._make_request('GET', f'tests/{test_id}')

    def wait_for_test_completion(self, test_id: str, timeout: int = 600) -> Dict[str, Any]:
        """
        Wait for test completion

        Args:
            test_id: Test ID
            timeout: Maximum wait time in seconds

        Returns:
            Final test results
        """
        logger.info(f"Waiting for test completion: {test_id}")
        start_time = time.time()

        while time.time() - start_time < timeout:
            status = self.get_test_status(test_id)
            state = status.get('data', {}).get('attributes', {}).get('state')

            if state == 'completed':
                logger.info(f"Test completed: {test_id}")
                return status
            elif state == 'error':
                logger.error(f"Test failed: {test_id}")
                return status
            else:
                logger.info(f"Test in progress: {state}")
                time.sleep(30)  # Check every 30 seconds

        logger.error(f"Test timeout after {timeout} seconds")
        return self.get_test_status(test_id)

    def get_test_results(self, test_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed test results

        Args:
            test_id: Test ID

        Returns:
            Test results or None if not available
        """
        try:
            return self._make_request('GET', f'tests/{test_id}')
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                logger.error(f"Test not found: {test_id}")
            else:
                logger.error(f"Failed to retrieve test results: {e}")
            return None

    def run_comprehensive_test(self, urls: List[str]) -> Dict[str, Any]:
        """
        Run comprehensive performance test for multiple URLs

        Args:
            urls: List of URLs to test

        Returns:
            Summary of all test results
        """
        logger.info("Starting comprehensive GTmetrix test suite")

        # Verify WAF access first
        if not self.test_waf_access():
            logger.error("WAF access verification failed")
            return {'error': 'WAF blocking detected'}

        results = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': len(urls),
            'completed_tests': 0,
            'failed_tests': 0,
            'test_results': {},
            'summary': {}
        }

        for url in urls:
            try:
                logger.info(f"Testing URL: {url}")

                # Start test
                test_id = self.start_test(url)
                if not test_id:
                    results['failed_tests'] += 1
                    continue

                # Wait for completion
                test_result = self.wait_for_test_completion(test_id)

                # Extract key metrics
                attributes = test_result.get('data', {}).get('attributes', {})
                if attributes.get('state') == 'completed':
                    results['completed_tests'] += 1
                    results['test_results'][url] = {
                        'test_id': test_id,
                        'gtmetrix_grade': attributes.get('gtmetrix_grade'),
                        'performance_score': attributes.get('performance_score'),
                        'structure_score': attributes.get('structure_score'),
                        'page_load_time': attributes.get('page_load_time'),
                        'page_size': attributes.get('page_size'),
                        'requests': attributes.get('requests'),
                        'html_load_time': attributes.get('html_load_time'),
                        'first_contentful_paint': attributes.get('first_contentful_paint'),
                        'largest_contentful_paint': attributes.get('largest_contentful_paint'),
                        'total_blocking_time': attributes.get('total_blocking_time'),
                        'cumulative_layout_shift': attributes.get('cumulative_layout_shift'),
                        'report_url': attributes.get('report_url')
                    }
                else:
                    results['failed_tests'] += 1
                    logger.error(f"Test failed for {url}")

                # Rate limiting between tests
                time.sleep(self.request_interval)

            except Exception as e:
                logger.error(f"Error testing {url}: {e}")
                results['failed_tests'] += 1

        # Generate summary
        if results['test_results']:
            self._generate_summary(results)

        return results

    def _generate_summary(self, results: Dict[str, Any]):
        """Generate summary statistics"""
        test_data = list(results['test_results'].values())

        if not test_data:
            return

        # Calculate averages
        metrics = ['performance_score', 'structure_score', 'page_load_time', 'page_size', 'requests']
        summary = {}

        for metric in metrics:
            values = [t.get(metric) for t in test_data if t.get(metric) is not None]
            if values:
                summary[f'avg_{metric}'] = sum(values) / len(values)
                summary[f'min_{metric}'] = min(values)
                summary[f'max_{metric}'] = max(values)

        results['summary'] = summary

    def export_results(self, results: Dict[str, Any], filename: Optional[str] = None):
        """
        Export results to JSON file

        Args:
            results: Test results
            filename: Output filename (optional)
        """
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
            filename = f'gtmetrix-results-{timestamp}.json'

        os.makedirs('gtmetrix-reports', exist_ok=True)
        filepath = os.path.join('gtmetrix-reports', filename)

        with open(filepath, 'w') as f:
            json.dump(results, f, indent=2)

        logger.info(f"Results exported to: {filepath}")

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description='GTmetrix automation for aclue platform')
    parser.add_argument('--api-key', required=True, help='GTmetrix API key')
    parser.add_argument('--email', required=True, help='GTmetrix account email')
    parser.add_argument('--urls', nargs='+',
                       default=['https://aclue.app', 'https://aclue.app/newsletter'],
                       help='URLs to test')
    parser.add_argument('--output', help='Output filename for results')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose logging')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        # Initialize GTmetrix automation
        gtmetrix = GTmetrixAutomation(args.api_key, args.email)

        # Run comprehensive test
        results = gtmetrix.run_comprehensive_test(args.urls)

        # Export results
        gtmetrix.export_results(results, args.output)

        # Print summary
        print("\n📊 GTmetrix Test Summary:")
        print(f"Total tests: {results['total_tests']}")
        print(f"Completed: {results['completed_tests']}")
        print(f"Failed: {results['failed_tests']}")

        if results.get('summary'):
            summary = results['summary']
            print(f"\nAverage Performance Score: {summary.get('avg_performance_score', 0):.1f}")
            print(f"Average Page Load Time: {summary.get('avg_page_load_time', 0):.2f}s")
            print(f"Average Page Size: {summary.get('avg_page_size', 0):.0f} bytes")

        # Set exit code based on results
        if results['failed_tests'] > 0:
            print("\n⚠️  Some tests failed - check logs for details")
            sys.exit(1)
        else:
            print("\n✅ All tests completed successfully")
            sys.exit(0)

    except Exception as e:
        logger.error(f"GTmetrix automation failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
