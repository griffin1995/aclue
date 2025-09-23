#!/usr/bin/env tsx

/**
 * Test Email Sender for aclue Platform
 *
 * This script sends test emails using the React Email templates to verify
 * how emails appear in real email clients. Uses Resend for reliable delivery
 * and includes comprehensive error handling and validation.
 *
 * Features:
 * - TypeScript implementation with proper error handling
 * - Real email sending via Resend API
 * - Multiple test scenarios and sample data
 * - Configuration validation and safety checks
 * - British English throughout all communications
 *
 * Usage:
 *   npm run email:send-test <recipient@example.com>
 *   or directly: npx tsx scripts/send-test-email.ts <recipient@example.com>
 *
 * Environment Variables Required:
 *   RESEND_API_KEY - Your Resend API key
 *   FROM_EMAIL - Sender email address (optional, defaults to noreply@aclue.app)
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';
import { createElement } from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Import our React Email component
import WelcomeEmail from '../src/components/emails/WelcomeEmail';

interface EmailTestConfig {
  recipientEmail: string;
  fromEmail: string;
  resendApiKey: string;
  testMode: boolean;
}

interface TestEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

class TestEmailSender {
  private resend: Resend;
  private config: EmailTestConfig;

  constructor(config: EmailTestConfig) {
    this.config = config;
    this.resend = new Resend(config.resendApiKey);
  }

  /**
   * Send welcome email test
   */
  async sendWelcomeEmailTest(): Promise<TestEmailResult> {
    console.log('📧 Sending welcome email test...');

    try {
      // Create React element with test data
      const emailElement = createElement(WelcomeEmail, {
        email: this.config.recipientEmail,
        source: 'email_test_script'
      });

      // Render HTML and text versions
      const htmlContent = await render(emailElement, { pretty: true });
      const textContent = await render(emailElement, { plainText: true });

      const subject = 'Welcome to aclue - AI-Powered Gift Discovery Awaits! 🎁 [TEST EMAIL]';

      console.log('📝 Email details:');
      console.log(`   To: ${this.config.recipientEmail}`);
      console.log(`   From: ${this.config.fromEmail}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   HTML Size: ${Math.round(htmlContent.length / 1024)}KB`);
      console.log(`   Text Size: ${Math.round(textContent.length / 1024)}KB`);

      if (this.config.testMode) {
        console.log('🧪 TEST MODE: Email would be sent with the above configuration');
        return {
          success: true,
          messageId: 'test-mode-' + Date.now(),
          timestamp: new Date().toISOString()
        };
      }

      // Send via Resend
      const result = await this.resend.emails.send({
        from: this.config.fromEmail,
        to: [this.config.recipientEmail],
        subject,
        html: htmlContent,
        text: textContent,
        tags: [
          { name: 'type', value: 'welcome_email' },
          { name: 'source', value: 'test_script' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' }
        ]
      });

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      console.log('✅ Welcome email sent successfully!');
      console.log(`📬 Message ID: ${result.data?.id}`);

      return {
        success: true,
        messageId: result.data?.id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Send multiple test emails with different configurations
   */
  async sendTestSuite(): Promise<TestEmailResult[]> {
    console.log('🧪 Running complete email test suite...');
    console.log('=' .repeat(50));

    const results: TestEmailResult[] = [];

    // Test different email sources
    const testSources = ['newsletter', 'maintenance_page', 'landing_page'];

    for (const source of testSources) {
      console.log(`\n📧 Testing welcome email with source: ${source}`);

      try {
        const emailElement = createElement(WelcomeEmail, {
          email: this.config.recipientEmail,
          source
        });

        const htmlContent = await render(emailElement, { pretty: true });
        const textContent = await render(emailElement, { plainText: true });
        const subject = `aclue Welcome Email Test - Source: ${source} [TEST]`;

        console.log(`   Subject: ${subject}`);
        console.log(`   Source: ${source}`);

        if (this.config.testMode) {
          console.log('   🧪 TEST MODE: Email rendered successfully');
          results.push({
            success: true,
            messageId: `test-${source}-${Date.now()}`,
            timestamp: new Date().toISOString()
          });
          continue;
        }

        const result = await this.resend.emails.send({
          from: this.config.fromEmail,
          to: [this.config.recipientEmail],
          subject,
          html: htmlContent,
          text: textContent,
          tags: [
            { name: 'type', value: 'welcome_email_test' },
            { name: 'source', value: source },
            { name: 'test_suite', value: 'true' }
          ]
        });

        if (result.error) {
          throw new Error(`Resend API error: ${result.error.message}`);
        }

        console.log(`   ✅ Sent successfully! Message ID: ${result.data?.id}`);

        results.push({
          success: true,
          messageId: result.data?.id,
          timestamp: new Date().toISOString()
        });

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ Failed to send test for source ${source}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }

    return results;
  }

  /**
   * Validate email configuration
   */
  static validateConfiguration(): EmailTestConfig | null {
    console.log('🔍 Validating email configuration...');

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is required');
      console.error('   Please set your Resend API key in your .env file');
      return null;
    }

    if (!resendApiKey.startsWith('re_')) {
      console.error('❌ Invalid RESEND_API_KEY format');
      console.error('   Resend API keys should start with "re_"');
      return null;
    }

    const fromEmail = process.env.FROM_EMAIL || 'aclue <noreply@aclue.app>';

    console.log('✅ Configuration validated');
    console.log(`   Resend API Key: ${resendApiKey.substring(0, 10)}...`);
    console.log(`   From Email: ${fromEmail}`);

    return {
      recipientEmail: '', // Will be set by command line argument
      fromEmail,
      resendApiKey,
      testMode: process.env.NODE_ENV === 'test' || process.argv.includes('--test-mode')
    };
  }

  /**
   * Validate email address format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Display usage information
 */
function displayUsage(): void {
  console.log(`
📧 aclue Test Email Sender

Usage:
  npm run email:send-test <recipient@example.com> [options]
  npx tsx scripts/send-test-email.ts <recipient@example.com> [options]

Options:
  --test-mode    Don't send actual emails, just validate rendering
  --suite        Send complete test suite with multiple scenarios

Examples:
  npm run email:send-test john.doe@example.com
  npm run email:send-test test@aclue.app --suite
  npm run email:send-test demo@example.com --test-mode

Environment Variables Required:
  RESEND_API_KEY  Your Resend API key
  FROM_EMAIL      Sender email (optional, defaults to noreply@aclue.app)

For more information, visit: https://docs.aclue.app/email-testing
  `);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🚀 aclue Email Test System');
  console.log('=' .repeat(50));

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    displayUsage();
    return;
  }

  const recipientEmail = args[0];
  const runSuite = args.includes('--suite');
  const testMode = args.includes('--test-mode');

  // Validate recipient email
  if (!TestEmailSender.isValidEmail(recipientEmail)) {
    console.error('❌ Invalid email address format');
    console.error(`   Provided: ${recipientEmail}`);
    console.error('   Expected format: user@domain.com');
    process.exit(1);
  }

  // Validate configuration
  const config = TestEmailSender.validateConfiguration();
  if (!config) {
    console.error('❌ Configuration validation failed');
    process.exit(1);
  }

  config.recipientEmail = recipientEmail;
  config.testMode = config.testMode || testMode;

  if (config.testMode) {
    console.log('🧪 Running in TEST MODE - no emails will be sent');
  }

  // Create test sender
  const sender = new TestEmailSender(config);

  try {
    if (runSuite) {
      console.log(`\n📬 Running test suite for: ${recipientEmail}`);
      const results = await sender.sendTestSuite();

      console.log('\n📊 Test Suite Results:');
      console.log('=' .repeat(30));

      let successCount = 0;
      results.forEach((result, index) => {
        if (result.success) {
          console.log(`✅ Test ${index + 1}: Success (${result.messageId})`);
          successCount++;
        } else {
          console.log(`❌ Test ${index + 1}: Failed (${result.error})`);
        }
      });

      console.log(`\n📈 Summary: ${successCount}/${results.length} tests passed`);

      if (successCount === results.length) {
        console.log('🎉 All tests passed successfully!');
      } else {
        console.log('⚠️  Some tests failed - check the logs above');
        process.exit(1);
      }

    } else {
      console.log(`\n📬 Sending single welcome email test to: ${recipientEmail}`);
      const result = await sender.sendWelcomeEmailTest();

      if (result.success) {
        console.log('\n🎉 Email test completed successfully!');
        if (result.messageId) {
          console.log(`📬 Message ID: ${result.messageId}`);
        }
        if (!config.testMode) {
          console.log('📱 Check your email inbox to see how the email appears');
          console.log('💡 Test both light and dark mode if your email client supports it');
        }
      } else {
        console.log('\n❌ Email test failed');
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    }

  } catch (error) {
    console.error('\n❌ Unexpected error during email testing:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default TestEmailSender;