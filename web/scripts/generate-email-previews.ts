#!/usr/bin/env tsx

/**
 * React Email Preview Generator for aclue Platform
 *
 * This script generates HTML previews of React Email templates for development and testing.
 * It uses @react-email/render to create production-quality email previews that can be
 * opened in browsers to see exactly how emails will appear to recipients.
 *
 * Features:
 * - TypeScript implementation with proper error handling
 * - Light and dark theme support with automatic detection
 * - Mobile and desktop layout previews
 * - HTML and text versions for each template
 * - British English throughout all content
 * - Production-ready email client compatibility
 *
 * Usage:
 *   npm run email:preview
 *   or directly: npx tsx scripts/generate-email-previews.ts
 *
 * Output:
 *   Saves preview files to web/email-previews/ directory
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

interface PreviewTheme {
  name: string;
  class: string;
  description: string;
  styles: {
    background: string;
    textColor: string;
    containerBg: string;
  };
}

class ReactEmailPreviewGenerator {
  private readonly outputDir: string;
  private readonly timestamp: string;

  constructor() {
    this.outputDir = resolve(process.cwd(), 'email-previews');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  /**
   * Generate all email preview files
   */
  async generateAllPreviews(): Promise<void> {
    console.log('🎨 Generating React Email Previews...');
    console.log('=' .repeat(50));

    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();

      // Generate welcome email previews
      await this.generateWelcomeEmailPreviews();

      // Generate combined preview file
      await this.generateCombinedPreview();

      console.log('\n✅ All React Email previews generated successfully!');
      console.log(`📁 Preview files saved to: ${this.outputDir}`);
      console.log('🌐 Open any .html file in your browser to view the previews');

    } catch (error) {
      console.error('❌ Error generating email previews:', error);
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
   * Generate welcome email template previews
   */
  private async generateWelcomeEmailPreviews(): Promise<void> {
    console.log('📧 Generating welcome email previews...');

    const sampleEmails = [
      'john.doe@example.com',
      'sarah.wilson@example.co.uk',
      'alex.chen@demo.aclue.app'
    ];

    const sources = ['newsletter', 'maintenance_page', 'landing_page'];

    for (const email of sampleEmails) {
      for (const source of sources) {
        const template = await this.renderWelcomeEmailTemplate(email, source);

        // Generate light theme preview
        const lightPreview = await this.createStandalonePreview(
          template,
          'light',
          false,
          `Welcome Email - Light Theme (${email})`
        );

        // Generate dark theme preview
        const darkPreview = await this.createStandalonePreview(
          template,
          'dark',
          false,
          `Welcome Email - Dark Theme (${email})`
        );

        // Generate mobile preview
        const mobilePreview = await this.createStandalonePreview(
          template,
          'light',
          true,
          `Welcome Email - Mobile Preview (${email})`
        );

        // Save preview files
        const emailSlug = email.split('@')[0].replace(/\./g, '-');
        const baseFilename = `welcome-email-${emailSlug}-${source}`;

        await this.savePreviewFile(`${baseFilename}-light.html`, lightPreview);
        await this.savePreviewFile(`${baseFilename}-dark.html`, darkPreview);
        await this.savePreviewFile(`${baseFilename}-mobile.html`, mobilePreview);

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
   * Create a standalone preview file with theme and mobile controls
   */
  private async createStandalonePreview(
    template: EmailTemplate,
    theme: 'light' | 'dark',
    mobile: boolean,
    title: string
  ): Promise<string> {
    const themeStyles = this.getThemeStyles(theme);
    const containerClass = mobile ? 'mobile-preview' : 'desktop-preview';

    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - aclue Email Preview</title>
  <style>
    /* Preview container styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: ${themeStyles.background};
      color: ${themeStyles.textColor};
      line-height: 1.6;
    }

    .preview-header {
      text-align: center;
      margin-bottom: 30px;
      background: ${themeStyles.containerBg};
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .preview-container {
      max-width: 700px;
      margin: 0 auto;
      background: ${themeStyles.containerBg};
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .mobile-preview {
      max-width: 375px;
    }

    .desktop-preview {
      max-width: 700px;
    }

    .email-frame {
      background: white;
      min-height: 500px;
    }

    .preview-controls {
      padding: 20px;
      background: rgba(59, 130, 246, 0.05);
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);
      text-align: center;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .control-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .control-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .control-button:active {
      transform: translateY(0);
    }

    .preview-info {
      background: rgba(240, 61, 255, 0.05);
      border: 1px solid rgba(240, 61, 255, 0.2);
      padding: 16px 20px;
      margin: 20px;
      border-radius: 8px;
      font-size: 14px;
    }

    .template-metadata {
      background: rgba(59, 130, 246, 0.05);
      border-left: 4px solid #3b82f6;
      padding: 16px 20px;
      margin: 20px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
    }

    .footer {
      background: rgba(107, 114, 128, 0.05);
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid rgba(107, 114, 128, 0.1);
    }

    /* Dark theme adjustments */
    .dark-theme body {
      background: #0f172a;
      color: #e2e8f0;
    }

    .dark-theme .preview-header,
    .dark-theme .preview-container {
      background: #1e293b;
      border-color: #334155;
    }

    .dark-theme .preview-controls {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .dark-theme .footer {
      background: rgba(71, 85, 105, 0.1);
      border-color: rgba(71, 85, 105, 0.2);
      color: #94a3b8;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 480px) {
      body {
        padding: 12px;
      }

      .preview-container {
        margin: 0;
      }

      .preview-controls {
        padding: 16px;
        gap: 8px;
      }

      .control-button {
        padding: 10px 16px;
        font-size: 13px;
      }
    }

    /* Print styles */
    @media print {
      .preview-controls,
      .footer {
        display: none;
      }

      body {
        background: white;
        color: black;
      }
    }
  </style>
</head>
<body class="${theme === 'dark' ? 'dark-theme' : ''}">
  <div class="preview-header">
    <h1>📧 ${title}</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>

  <div class="preview-container ${containerClass}">
    <div class="preview-controls">
      <button class="control-button" onclick="toggleTheme()">
        🌓 Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <button class="control-button" onclick="toggleMobile()">
        📱 Toggle ${mobile ? 'Desktop' : 'Mobile'} View
      </button>
      <button class="control-button" onclick="showTextVersion()">
        📝 Show Text Version
      </button>
      <button class="control-button" onclick="window.print()">
        🖨️ Print Preview
      </button>
    </div>

    <div class="template-metadata">
      <strong>Template:</strong> ${template.name}<br>
      <strong>Subject:</strong> ${template.subject}<br>
      <strong>Theme:</strong> ${theme.charAt(0).toUpperCase() + theme.slice(1)}<br>
      <strong>Layout:</strong> ${mobile ? 'Mobile' : 'Desktop'}<br>
      <strong>Generated:</strong> ${this.timestamp}
    </div>

    <div class="preview-info">
      💡 <strong>Preview Features:</strong> This preview includes theme switching, mobile/desktop toggle,
      and text version viewing. Use the controls above to test different viewing modes.
    </div>

    <div class="email-frame" id="email-content">
      ${template.htmlContent}
    </div>

    <div class="footer">
      <p><strong>aclue Email Preview System</strong> • Generated with React Email • ${new Date().getFullYear()}</p>
      <p>British English • Production-ready templates • Cross-client compatibility</p>
    </div>
  </div>

  <!-- Hidden text version -->
  <div id="text-version" style="display: none; background: #f8fafc; padding: 20px; margin: 20px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; line-height: 1.5; border-left: 4px solid #10b981;">
    ${template.textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </div>

  <script>
    let currentTheme = '${theme}';
    let currentLayout = '${mobile ? 'mobile' : 'desktop'}';

    function toggleTheme() {
      const body = document.body;
      const button = event.target;

      if (currentTheme === 'light') {
        body.classList.add('dark-theme');
        button.textContent = '🌞 Toggle Light Mode';
        currentTheme = 'dark';
      } else {
        body.classList.remove('dark-theme');
        button.textContent = '🌓 Toggle Dark Mode';
        currentTheme = 'light';
      }
    }

    function toggleMobile() {
      const container = document.querySelector('.preview-container');
      const button = event.target;

      if (currentLayout === 'desktop') {
        container.classList.remove('desktop-preview');
        container.classList.add('mobile-preview');
        button.textContent = '🖥️ Toggle Desktop View';
        currentLayout = 'mobile';
      } else {
        container.classList.remove('mobile-preview');
        container.classList.add('desktop-preview');
        button.textContent = '📱 Toggle Mobile View';
        currentLayout = 'desktop';
      }
    }

    function showTextVersion() {
      const emailContent = document.getElementById('email-content');
      const textVersion = document.getElementById('text-version');
      const button = event.target;

      if (textVersion.style.display === 'none') {
        emailContent.style.display = 'none';
        textVersion.style.display = 'block';
        button.textContent = '📧 Show HTML Version';
      } else {
        emailContent.style.display = 'block';
        textVersion.style.display = 'none';
        button.textContent = '📝 Show Text Version';
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case 'm':
            e.preventDefault();
            toggleMobile();
            break;
          case 't':
            e.preventDefault();
            showTextVersion();
            break;
        }
      }
    });

    console.log('📧 aclue Email Preview System');
    console.log('Keyboard shortcuts: Ctrl/Cmd + D (theme), Ctrl/Cmd + M (mobile), Ctrl/Cmd + T (text)');
  </script>
</body>
</html>`;
  }

  /**
   * Get theme styles based on theme type
   */
  private getThemeStyles(theme: 'light' | 'dark') {
    const themes = {
      light: {
        background: '#f8fafc',
        textColor: '#1f2937',
        containerBg: '#ffffff'
      },
      dark: {
        background: '#0f172a',
        textColor: '#e2e8f0',
        containerBg: '#1e293b'
      }
    };

    return themes[theme];
  }

  /**
   * Generate a combined preview showing all templates
   */
  private async generateCombinedPreview(): Promise<void> {
    console.log('📊 Generating combined preview...');

    const sampleEmail = 'demo@aclue.app';
    const welcomeTemplate = await this.renderWelcomeEmailTemplate(sampleEmail, 'newsletter');

    const combinedHtml = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aclue Email Templates - Complete Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      line-height: 1.6;
    }

    .preview-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .main-header {
      text-align: center;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      padding: 40px 20px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
    }

    .template-section {
      margin-bottom: 50px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .section-header {
      background: linear-gradient(135deg, #f03dff 0%, #59006d 100%);
      color: white;
      padding: 20px 30px;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .template-preview {
      padding: 30px;
    }

    .theme-controls {
      text-align: center;
      margin: 20px 0;
    }

    .theme-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      margin: 0 8px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .theme-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .email-frame {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      margin: 20px 0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .template-info {
      background: rgba(240, 61, 255, 0.05);
      border: 1px solid rgba(240, 61, 255, 0.2);
      padding: 20px;
      margin: 20px 0;
      border-radius: 12px;
    }

    .footer {
      text-align: center;
      padding: 40px 20px;
      background: #1f2937;
      color: #e5e7eb;
      border-radius: 16px;
      margin-top: 50px;
    }

    /* Dark theme styles */
    .dark-theme body {
      background: #0f172a;
      color: #e2e8f0;
    }

    .dark-theme .template-section {
      background: #1e293b;
      border-color: #334155;
    }

    .dark-theme .email-frame {
      border-color: #475569;
    }

    @media (max-width: 768px) {
      body {
        padding: 12px;
      }

      .main-header {
        padding: 30px 20px;
      }

      .template-preview {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <header class="main-header">
      <h1>📧 aclue Email Templates</h1>
      <p>Complete Preview System • Generated ${new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <div style="margin-top: 20px;">
        <button class="theme-button" onclick="toggleGlobalTheme()">🌓 Toggle Dark Mode</button>
        <button class="theme-button" onclick="toggleAllMobile()">📱 Mobile View</button>
      </div>
    </header>

    <section class="template-section">
      <h2 class="section-header">💌 Welcome Email Template</h2>
      <div class="template-preview">
        <div class="template-info">
          <strong>📋 Template Details:</strong><br>
          <strong>Subject:</strong> ${welcomeTemplate.subject}<br>
          <strong>Purpose:</strong> Welcome new newsletter subscribers<br>
          <strong>Features:</strong> Responsive design, theme support, glassmorphism effects<br>
          <strong>Brand:</strong> aclue identity with purple gradient branding
        </div>

        <div class="theme-controls">
          <button class="theme-button" onclick="toggleWelcomeTheme()">🌙 Toggle Theme</button>
          <button class="theme-button" onclick="toggleWelcomeMobile()">📱 Toggle Mobile</button>
          <button class="theme-button" onclick="showWelcomeText()">📝 Show Text Version</button>
        </div>

        <div class="email-frame" id="welcome-frame">
          ${welcomeTemplate.htmlContent}
        </div>

        <div id="welcome-text" style="display: none; background: #f8fafc; padding: 20px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; margin-top: 20px; border-left: 4px solid #10b981;">
          ${welcomeTemplate.textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
      </div>
    </section>

    <footer class="footer">
      <h3>🚀 aclue Email Preview System</h3>
      <p>Built with React Email • TypeScript • Production-ready templates</p>
      <p>British English • Cross-client compatibility • ${new Date().getFullYear()}</p>
      <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
        Generated: ${this.timestamp} • Last updated: ${new Date().toISOString()}
      </div>
    </footer>
  </div>

  <script>
    let globalTheme = 'light';
    let welcomeMobile = false;

    function toggleGlobalTheme() {
      const body = document.body;
      const button = event.target;

      if (globalTheme === 'light') {
        body.classList.add('dark-theme');
        button.textContent = '🌞 Toggle Light Mode';
        globalTheme = 'dark';
      } else {
        body.classList.remove('dark-theme');
        button.textContent = '🌓 Toggle Dark Mode';
        globalTheme = 'light';
      }
    }

    function toggleWelcomeTheme() {
      const frame = document.getElementById('welcome-frame');
      frame.style.filter = frame.style.filter ? '' : 'invert(0.9) hue-rotate(180deg)';
    }

    function toggleWelcomeMobile() {
      const frame = document.getElementById('welcome-frame');
      const button = event.target;

      if (!welcomeMobile) {
        frame.style.maxWidth = '375px';
        frame.style.margin = '20px auto';
        button.textContent = '🖥️ Desktop View';
        welcomeMobile = true;
      } else {
        frame.style.maxWidth = '100%';
        frame.style.margin = '20px 0';
        button.textContent = '📱 Toggle Mobile';
        welcomeMobile = false;
      }
    }

    function showWelcomeText() {
      const frame = document.getElementById('welcome-frame');
      const text = document.getElementById('welcome-text');
      const button = event.target;

      if (text.style.display === 'none') {
        frame.style.display = 'none';
        text.style.display = 'block';
        button.textContent = '📧 Show HTML';
      } else {
        frame.style.display = 'block';
        text.style.display = 'none';
        button.textContent = '📝 Show Text Version';
      }
    }

    function toggleAllMobile() {
      toggleWelcomeMobile();
    }

    // Initialize
    console.log('📧 aclue Email Preview System - Combined View');
    console.log('Features: Theme switching, mobile/desktop toggle, text versions');
  </script>
</body>
</html>`;

    await this.savePreviewFile('combined-preview.html', combinedHtml);
    console.log('  ✓ combined-preview.html');
  }

  /**
   * Save a preview file to the output directory
   */
  private async savePreviewFile(filename: string, content: string): Promise<void> {
    try {
      const filePath = join(this.outputDir, filename);
      await writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error(`Failed to save preview file ${filename}:`, error);
      throw error;
    }
  }
}

/**
 * Main function to generate all email previews
 */
async function main(): Promise<void> {
  try {
    const generator = new ReactEmailPreviewGenerator();
    await generator.generateAllPreviews();

    console.log('\n🎉 React Email preview generation completed successfully!');
    console.log('\n🚀 Quick start:');
    console.log('   • Open "combined-preview.html" for all templates');
    console.log('   • Open individual files for specific templates and themes');
    console.log('   • Use browser dev tools to test responsive design');
    console.log('   • Test both light and dark theme versions');
    console.log('   • Preview includes HTML and text versions');

  } catch (error) {
    console.error('❌ Failed to generate email previews:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export default ReactEmailPreviewGenerator;