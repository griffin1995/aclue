#!/usr/bin/env tsx

/**
 * React Email HTML Generator for aclue Platform
 *
 * This script generates clean standalone HTML files from React Email templates for direct use
 * in email clients. It uses @react-email/render to create production-quality email HTML
 * that can be directly copied into Thunderbird, Outlook, or any other email client.
 *
 * Features:
 * - TypeScript implementation with proper error handling
 * - Light and dark theme support
 * - Mobile and desktop layout versions
 * - British English throughout all content
 * - Production-ready email client compatibility
 * - Clean standalone HTML output only
 *
 * Usage:
 *   npm run email:preview
 *   or directly: npx tsx scripts/generate-email-previews.ts
 *
 * Output:
 *   Saves standalone HTML files to web/email-previews/ directory:
 *   - welcome-email-{user}-{source}-light.html
 *   - welcome-email-{user}-{source}-dark.html
 *   - welcome-email-{user}-{source}-mobile.html
 */

import { render } from '@react-email/render';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { createElement } from 'react';

// Import our React Email component
import WelcomeEmail from '../src/components/emails/WelcomeEmail';

interface EmailTemplate {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  description: string;
}


class ReactEmailHtmlGenerator {
  private readonly outputDir: string;
  private readonly timestamp: string;

  constructor() {
    this.outputDir = resolve(process.cwd(), 'email-previews');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  /**
   * Generate all standalone email HTML files
   */
  async generateAllEmails(): Promise<void> {
    console.log('📧 Generating Standalone Email HTML Files...');
    console.log('=' .repeat(50));

    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();

      // Generate welcome email HTML files
      await this.generateWelcomeEmailFiles();

      console.log('\n✅ All standalone email HTML files generated successfully!');
      console.log(`📁 Email files saved to: ${this.outputDir}`);
      console.log('🌐 Files are ready for direct use in email clients:');
      console.log('   • Copy HTML content directly into Thunderbird, Outlook, etc.');
      console.log('   • No preview wrappers - just clean email HTML');

    } catch (error) {
      console.error('❌ Error generating email HTML files:', error);
      throw error;
    }
  }

  /**
   * Ensure the output directory exists
   */
  private async ensureOutputDirectory(): Promise<void> {
    try {
      await mkdir(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}`);
    } catch (error) {
      console.error('Failed to create output directory:', error);
      throw error;
    }
  }

  /**
   * Generate welcome email standalone HTML files
   */
  private async generateWelcomeEmailFiles(): Promise<void> {
    console.log('📧 Generating welcome email HTML files...');

    const sampleEmails = [
      'john.doe@example.com',
      'sarah.wilson@example.co.uk',
      'alex.chen@demo.aclue.app'
    ];

    const sources = ['newsletter', 'maintenance_page', 'landing_page'];

    for (const email of sampleEmails) {
      for (const source of sources) {
        const template = await this.renderWelcomeEmailTemplate(email, source);

        // Generate standalone email files (clean HTML for email clients)
        const lightStandalone = await this.createEmailStandalone(template, 'light');
        const darkStandalone = await this.createEmailStandalone(template, 'dark');
        const mobileStandalone = await this.createEmailStandalone(template, 'light', true);

        // Save standalone files (clean email HTML)
        const emailSlug = email.split('@')[0].replace(/\./g, '-');
        const baseFilename = `welcome-email-${emailSlug}-${source}`;

        await this.saveEmailFile(`${baseFilename}-light.html`, lightStandalone);
        await this.saveEmailFile(`${baseFilename}-dark.html`, darkStandalone);
        await this.saveEmailFile(`${baseFilename}-mobile.html`, mobileStandalone);

        console.log(`  ✓ ${baseFilename}-light.html`);
        console.log(`  ✓ ${baseFilename}-dark.html`);
        console.log(`  ✓ ${baseFilename}-mobile.html`);
      }
    }
  }

  /**
   * Render welcome email template using React Email
   */
  private async renderWelcomeEmailTemplate(email: string, source: string): Promise<EmailTemplate> {
    try {
      // Create React element with props
      const emailElement = createElement(WelcomeEmail, { email, source });

      // Render HTML and text versions
      const htmlContent = await render(emailElement, { pretty: true });
      const textContent = await render(emailElement, { plainText: true });

      return {
        name: 'Welcome Email',
        subject: 'Welcome to aclue - AI-Powered Gift Discovery Awaits!',
        htmlContent,
        textContent,
        description: `Welcome email for ${email} from ${source}`
      };
    } catch (error) {
      console.error(`Failed to render welcome email template for ${email}:`, error);
      throw error;
    }
  }

  /**
   * Create a standalone email HTML file (clean version for email clients)
   */
  private async createEmailStandalone(
    template: EmailTemplate,
    theme: 'light' | 'dark',
    mobile?: boolean
  ): Promise<string> {
    // For email clients, we use a proper email DOCTYPE and structure
    // This ensures maximum compatibility across email clients
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="format-detection" content="date=no" />
  <meta name="format-detection" content="address=no" />
  <meta name="format-detection" content="email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="${theme === 'dark' ? 'dark' : 'light'}" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${template.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Email client resets */
    #outlook a { padding: 0; }
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass * { line-height: 100%; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1a1a1a !important; }
      .dark-mode-text { color: #ffffff !important; }
      .dark-mode-container { background-color: #2d2d2d !important; }
    }

    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 10px !important; }
      .mobile-font-size { font-size: 16px !important; }
      .mobile-center { text-align: center !important; }
    }

    /* High DPI displays */
    @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi) {
      /* Add high DPI styles if needed */
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; min-width: 100%; background-color: ${theme === 'dark' ? '#1a1a1a' : '#f8fafc'};" class="${theme === 'dark' ? 'dark-mode-bg' : ''}">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${theme === 'dark' ? '#1a1a1a' : '#f8fafc'};">
    <tr>
      <td>
  <![endif]-->

  <!-- Email content starts here -->
  ${template.htmlContent}

  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->

  <!-- Email client tracking pixel (optional - remove if not needed) -->
  <!-- <img src="https://your-tracking-domain.com/track.png" width="1" height="1" style="display: none;" alt="" /> -->
</body>
</html>`;
  }




  /**
   * Save an email HTML file to the output directory
   */
  private async saveEmailFile(filename: string, content: string): Promise<void> {
    try {
      const filePath = join(this.outputDir, filename);
      await writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error(`Failed to save email file ${filename}:`, error);
      throw error;
    }
  }
}

/**
 * Main function to generate all standalone email HTML files
 */
async function main(): Promise<void> {
  try {
    const generator = new ReactEmailHtmlGenerator();
    await generator.generateAllEmails();

    console.log('\n🎉 Standalone email HTML generation completed successfully!');
    console.log('\n🚀 Quick start:');
    console.log('   • Open any generated .html file to view standalone email');
    console.log('   • Copy HTML content directly into email clients');
    console.log('   • Files include light, dark, and mobile versions');
    console.log('   • No preview wrappers - just clean email HTML');
    console.log('   • Ready for use in Thunderbird, Outlook, Gmail, etc.');

  } catch (error) {
    console.error('❌ Failed to generate email HTML files:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export default ReactEmailHtmlGenerator;