#!/usr/bin/env python3
"""
Newsletter End-to-End Testing Suite using Playwright

This test suite provides end-to-end testing for the newsletter signup functionality
using Playwright for browser automation. Tests the complete user journey from
frontend form interaction to backend API calls.

Test Categories:
1. Frontend Form Interaction
2. Form Validation Testing
3. Success/Error States
4. Mobile Responsiveness
5. Accessibility Testing

Usage:
    pip install playwright pytest-playwright
    playwright install
    python tests/newsletter_e2e_tests.py
    
Requirements:
    - Frontend running on localhost:3000
    - Backend running on production URL
    - Playwright browser binaries installed
"""

import asyncio
import pytest
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
import time
import logging
from typing import Dict, List, Any
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class E2ETestConfig:
    """End-to-end test configuration"""
    frontend_url: str = "https://aclue.app"  # Production URL
    backend_url: str = "https://aclue-backend-production.up.railway.app"
    timeout: int = 30000  # 30 seconds
    headless: bool = True
    slow_mo: int = 100  # Slow down for better visibility

class NewsletterE2ETestSuite:
    """End-to-end newsletter testing suite using Playwright"""
    
    def __init__(self, config: E2ETestConfig = None):
        self.config = config or E2ETestConfig()
        self.test_results = []
    
    async def setup_browser(self):
        """Set up Playwright browser"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=self.config.headless,
            slow_mo=self.config.slow_mo
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='aclue-E2E-Test-Suite/1.0'
        )
        self.page = await self.context.new_page()
        
        # Set default timeout
        self.page.set_default_timeout(self.config.timeout)
        
        logger.info("✅ Browser setup complete")
    
    async def teardown_browser(self):
        """Clean up browser resources"""
        await self.browser.close()
        await self.playwright.stop()
        logger.info("🧹 Browser cleanup complete")
    
    async def navigate_to_newsletter_page(self) -> bool:
        """Navigate to the newsletter signup page"""
        try:
            logger.info(f"🌐 Navigating to {self.config.frontend_url}")
            await self.page.goto(self.config.frontend_url)
            
            # Wait for page to load
            await self.page.wait_for_load_state('networkidle')
            
            # Check if newsletter form is present
            newsletter_form = self.page.locator('form[role="form"]')
            await newsletter_form.wait_for(state='visible', timeout=10000)
            
            logger.info("✅ Newsletter page loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to navigate to newsletter page: {str(e)}")
            return False
    
    async def test_newsletter_form_elements(self) -> Dict[str, Any]:
        """Test that all newsletter form elements are present and accessible"""
        logger.info("🧪 Testing newsletter form elements")
        start_time = time.time()
        
        try:
            # Check email input field
            email_input = self.page.locator('input[type="email"]')
            await email_input.wait_for(state='visible')
            
            # Check submit button
            submit_button = self.page.locator('button[type="submit"]')
            await submit_button.wait_for(state='visible')
            
            # Check form labels and accessibility
            email_label = await email_input.get_attribute('aria-label')
            if not email_label:
                email_label = await email_input.get_attribute('placeholder')
            
            # Check if form has proper ARIA attributes
            form = self.page.locator('form[role="form"]')
            form_labelledby = await form.get_attribute('aria-labelledby')
            
            result = {
                "test_name": "Newsletter Form Elements",
                "passed": True,
                "duration": time.time() - start_time,
                "details": {
                    "email_input_present": True,
                    "submit_button_present": True,
                    "email_label": email_label,
                    "form_accessibility": bool(form_labelledby),
                    "form_role": await form.get_attribute('role')
                }
            }
            
            logger.info("✅ Newsletter form elements test passed")
            return result
            
        except Exception as e:
            result = {
                "test_name": "Newsletter Form Elements",
                "passed": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
            logger.error(f"❌ Newsletter form elements test failed: {str(e)}")
            return result
    
    async def test_newsletter_form_validation(self) -> Dict[str, Any]:
        """Test form validation for various email inputs"""
        logger.info("🧪 Testing newsletter form validation")
        start_time = time.time()
        
        try:
            email_input = self.page.locator('input[type="email"]')
            submit_button = self.page.locator('button[type="submit"]')
            
            validation_tests = [
                {
                    "email": "",
                    "expected": "required_validation",
                    "description": "Empty email"
                },
                {
                    "email": "invalid-email",
                    "expected": "format_validation", 
                    "description": "Invalid format"
                },
                {
                    "email": "test@",
                    "expected": "format_validation",
                    "description": "Incomplete email"
                },
                {
                    "email": "@example.com",
                    "expected": "format_validation",
                    "description": "Missing username"
                }
            ]
            
            validation_results = []
            
            for test_case in validation_tests:
                logger.info(f"  📧 Testing: {test_case['description']} - '{test_case['email']}'")
                
                # Clear and fill email input
                await email_input.clear()
                if test_case['email']:
                    await email_input.fill(test_case['email'])
                
                # Try to submit
                await submit_button.click()
                
                # Wait a moment for validation to trigger
                await self.page.wait_for_timeout(500)
                
                # Check if form was submitted or validation triggered
                # Look for HTML5 validation or custom error messages
                validation_message = await email_input.evaluate('el => el.validationMessage')
                is_valid = await email_input.evaluate('el => el.validity.valid')
                
                validation_results.append({
                    "email": test_case['email'],
                    "description": test_case['description'],
                    "validation_message": validation_message,
                    "is_valid": is_valid,
                    "validation_triggered": not is_valid or bool(validation_message)
                })
            
            # All invalid emails should trigger validation
            invalid_tests = [r for r in validation_results if r['email'] != 'valid@example.com']
            validation_working = all(r['validation_triggered'] for r in invalid_tests)
            
            result = {
                "test_name": "Newsletter Form Validation",
                "passed": validation_working,
                "duration": time.time() - start_time,
                "details": {
                    "validation_tests": validation_results,
                    "all_invalid_caught": validation_working
                }
            }
            
            if validation_working:
                logger.info("✅ Newsletter form validation test passed")
            else:
                logger.error("❌ Newsletter form validation test failed")
            
            return result
            
        except Exception as e:
            result = {
                "test_name": "Newsletter Form Validation",
                "passed": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
            logger.error(f"❌ Newsletter form validation test failed: {str(e)}")
            return result
    
    async def test_newsletter_successful_signup(self) -> Dict[str, Any]:
        """Test successful newsletter signup flow"""
        logger.info("🧪 Testing successful newsletter signup")
        start_time = time.time()
        
        try:
            email_input = self.page.locator('input[type="email"]')
            submit_button = self.page.locator('button[type="submit"]')
            
            # Generate unique test email
            timestamp = int(time.time())
            test_email = f"e2etest+{timestamp}@example.com"
            
            logger.info(f"  📧 Testing signup with: {test_email}")
            
            # Fill form
            await email_input.clear()
            await email_input.fill(test_email)
            
            # Submit form
            await submit_button.click()
            
            # Wait for form submission and response
            # Look for success indicators
            success_indicators = [
                'text="Welcome to the Future!"',  # Success message from component
                'text="Thank you"',  # Generic success message
                '[data-testid="success-message"]',  # Test ID if present
                '.success',  # Success class
                '[aria-live="polite"]'  # Accessibility success announcement
            ]
            
            success_found = False
            success_message = None
            
            for indicator in success_indicators:
                try:
                    success_element = self.page.locator(indicator)
                    await success_element.wait_for(state='visible', timeout=5000)
                    success_message = await success_element.inner_text()
                    success_found = True
                    logger.info(f"  ✅ Success indicator found: {indicator}")
                    break
                except:
                    continue
            
            # Also check if form disappears or changes state
            form_state_changed = False
            try:
                # Check if the submit button is no longer visible or disabled
                await self.page.wait_for_timeout(2000)  # Wait for potential state change
                
                # Check if form has been replaced with success content
                success_content = self.page.locator('text="Welcome to the Future!"')
                if await success_content.count() > 0:
                    form_state_changed = True
                    logger.info("  ✅ Form replaced with success content")
                
            except:
                pass
            
            signup_successful = success_found or form_state_changed
            
            result = {
                "test_name": "Newsletter Successful Signup",
                "passed": signup_successful,
                "duration": time.time() - start_time,
                "details": {
                    "test_email": test_email,
                    "success_found": success_found,
                    "success_message": success_message,
                    "form_state_changed": form_state_changed
                }
            }
            
            if signup_successful:
                logger.info("✅ Newsletter successful signup test passed")
            else:
                logger.error("❌ Newsletter successful signup test failed - no success indicators found")
            
            return result
            
        except Exception as e:
            result = {
                "test_name": "Newsletter Successful Signup",
                "passed": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
            logger.error(f"❌ Newsletter successful signup test failed: {str(e)}")
            return result
    
    async def test_newsletter_mobile_responsiveness(self) -> Dict[str, Any]:
        """Test newsletter form on mobile viewport"""
        logger.info("🧪 Testing newsletter mobile responsiveness")
        start_time = time.time()
        
        try:
            # Set mobile viewport
            await self.page.set_viewport_size({'width': 375, 'height': 667})  # iPhone SE size
            
            # Reload page with mobile viewport
            await self.page.reload()
            await self.page.wait_for_load_state('networkidle')
            
            # Check if form elements are visible and properly sized
            email_input = self.page.locator('input[type="email"]')
            submit_button = self.page.locator('button[type="submit"]')
            
            # Check visibility
            await email_input.wait_for(state='visible')
            await submit_button.wait_for(state='visible')
            
            # Check element dimensions
            email_box = await email_input.bounding_box()
            button_box = await submit_button.bounding_box()
            
            # Mobile accessibility checks
            mobile_friendly = (
                email_box['height'] >= 44 and  # Minimum touch target size
                button_box['height'] >= 44 and
                email_box['width'] > 200 and  # Reasonable input width
                button_box['width'] > 100   # Reasonable button width
            )
            
            # Check for horizontal scrolling
            page_width = await self.page.evaluate('document.documentElement.scrollWidth')
            viewport_width = 375
            no_horizontal_scroll = page_width <= viewport_width
            
            result = {
                "test_name": "Newsletter Mobile Responsiveness",
                "passed": mobile_friendly and no_horizontal_scroll,
                "duration": time.time() - start_time,
                "details": {
                    "email_input_size": email_box,
                    "submit_button_size": button_box,
                    "mobile_friendly_sizes": mobile_friendly,
                    "page_width": page_width,
                    "viewport_width": viewport_width,
                    "no_horizontal_scroll": no_horizontal_scroll
                }
            }
            
            # Reset to desktop viewport
            await self.page.set_viewport_size({'width': 1280, 'height': 720})
            
            if mobile_friendly and no_horizontal_scroll:
                logger.info("✅ Newsletter mobile responsiveness test passed")
            else:
                logger.error("❌ Newsletter mobile responsiveness test failed")
            
            return result
            
        except Exception as e:
            # Reset viewport on error
            await self.page.set_viewport_size({'width': 1280, 'height': 720})
            
            result = {
                "test_name": "Newsletter Mobile Responsiveness",
                "passed": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
            logger.error(f"❌ Newsletter mobile responsiveness test failed: {str(e)}")
            return result
    
    async def test_newsletter_loading_states(self) -> Dict[str, Any]:
        """Test newsletter form loading and disabled states"""
        logger.info("🧪 Testing newsletter loading states")
        start_time = time.time()
        
        try:
            email_input = self.page.locator('input[type="email"]')
            submit_button = self.page.locator('button[type="submit"]')
            
            # Fill valid email
            test_email = f"loadingtest+{int(time.time())}@example.com"
            await email_input.fill(test_email)
            
            # Check initial state
            initial_disabled = await submit_button.is_disabled()
            initial_button_text = await submit_button.inner_text()
            
            # Submit form and immediately check loading state
            await submit_button.click()
            
            # Check for loading indicators
            loading_states = {
                "button_disabled": False,
                "loading_text": False,
                "loading_spinner": False,
                "loading_class": False
            }
            
            try:
                # Wait briefly and check if button shows loading state
                await self.page.wait_for_timeout(100)
                
                # Check if button is disabled during submission
                loading_states["button_disabled"] = await submit_button.is_disabled()
                
                # Check for loading text changes
                current_button_text = await submit_button.inner_text()
                loading_states["loading_text"] = "loading" in current_button_text.lower() or "joining" in current_button_text.lower()
                
                # Check for loading spinner
                spinner = self.page.locator('[class*="animate-spin"], .spinner, [data-loading="true"]')
                loading_states["loading_spinner"] = await spinner.count() > 0
                
                # Check for loading class on button
                button_classes = await submit_button.get_attribute('class') or ''
                loading_states["loading_class"] = 'loading' in button_classes or 'disabled' in button_classes
                
            except:
                pass
            
            # Check if any loading indicators are present
            has_loading_indicators = any(loading_states.values())
            
            result = {
                "test_name": "Newsletter Loading States",
                "passed": has_loading_indicators,
                "duration": time.time() - start_time,
                "details": {
                    "initial_button_text": initial_button_text,
                    "initial_disabled": initial_disabled,
                    "loading_states": loading_states,
                    "has_loading_indicators": has_loading_indicators
                }
            }
            
            if has_loading_indicators:
                logger.info("✅ Newsletter loading states test passed")
            else:
                logger.info("⚠️ Newsletter loading states test - no loading indicators found (may be too fast)")
            
            return result
            
        except Exception as e:
            result = {
                "test_name": "Newsletter Loading States",
                "passed": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
            logger.error(f"❌ Newsletter loading states test failed: {str(e)}")
            return result
    
    async def run_all_e2e_tests(self) -> Dict[str, Any]:
        """Run all end-to-end tests"""
        logger.info("🚀 Starting Newsletter E2E Test Suite")
        logger.info(f"📍 Frontend URL: {self.config.frontend_url}")
        logger.info("=" * 80)
        
        suite_start_time = time.time()
        
        try:
            # Setup browser
            await self.setup_browser()
            
            # Navigate to newsletter page
            navigation_success = await self.navigate_to_newsletter_page()
            if not navigation_success:
                return {
                    "total_tests": 0,
                    "passed_tests": 0,
                    "failed_tests": 1,
                    "error": "Failed to navigate to newsletter page"
                }
            
            # Run all tests
            tests = [
                self.test_newsletter_form_elements(),
                self.test_newsletter_form_validation(),
                self.test_newsletter_successful_signup(),
                self.test_newsletter_mobile_responsiveness(),
                self.test_newsletter_loading_states()
            ]
            
            results = []
            for test_coro in tests:
                try:
                    result = await test_coro
                    results.append(result)
                    self.test_results.append(result)
                except Exception as e:
                    logger.error(f"❌ Test failed with exception: {str(e)}")
                    results.append({
                        "test_name": "Unknown Test",
                        "passed": False,
                        "duration": 0,
                        "error": str(e)
                    })
            
        finally:
            # Always cleanup browser
            await self.teardown_browser()
        
        # Generate summary
        total_tests = len(results)
        passed_tests = len([r for r in results if r.get('passed', False)])
        failed_tests = total_tests - passed_tests
        suite_duration = time.time() - suite_start_time
        
        summary = {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0,
            "total_duration": suite_duration,
            "results": results
        }
        
        # Print summary
        logger.info("\n" + "=" * 80)
        logger.info("📊 E2E TEST SUMMARY")
        logger.info("=" * 80)
        logger.info(f"Total Tests: {total_tests}")
        logger.info(f"Passed: {passed_tests}")
        logger.info(f"Failed: {failed_tests}")
        logger.info(f"Success Rate: {summary['success_rate']:.1f}%")
        logger.info(f"Total Duration: {suite_duration:.2f}s")
        
        if failed_tests > 0:
            logger.info("\n❌ FAILED TESTS:")
            for result in results:
                if not result.get('passed', False):
                    logger.info(f"  • {result.get('test_name', 'Unknown')}: {result.get('error', 'No error details')}")
        
        return summary


async def main():
    """Main function to run E2E tests"""
    config = E2ETestConfig()
    
    # Check if we should run in non-headless mode for debugging
    import sys
    if '--debug' in sys.argv:
        config.headless = False
        config.slow_mo = 500
    
    # Run test suite
    test_suite = NewsletterE2ETestSuite(config)
    summary = await test_suite.run_all_e2e_tests()
    
    # Exit with appropriate code
    exit_code = 0 if summary["failed_tests"] == 0 else 1
    return exit_code


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)