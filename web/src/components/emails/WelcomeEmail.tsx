import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Img,
  Link,
  Row,
  Column,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
  source?: string
}

// Centralized email theme configuration - single source of truth
const emailTheme = {
  colors: {
    light: {
      background: '#ffffff',
      contentBackground: '#f8fafc',
      text: '#333333',
      heading: '#1f2937',
      subheading: '#374151',
      paragraph: '#374151',
      signature: '#374151',
      footer: '#6b7280',
      link: '#3b82f6',
      border: '#e5e7eb',
      headerGradientFrom: '#3b82f6',
      headerGradientTo: '#8b5cf6',
    },
    dark: {
      background: '#121212',
      contentBackground: '#1a1a1a',
      text: '#f0f0f0',
      heading: '#f9fafb',
      subheading: '#e5e7eb',
      paragraph: '#d1d5db',
      signature: '#d1d5db',
      footer: '#9ca3af',
      link: '#60a5fa',
      border: '#374151',
      headerGradientFrom: '#1e40af',
      headerGradientTo: '#7c3aed',
    }
  },
  typography: {
    fontFamily: "'Arial', sans-serif",
    fontSize: {
      small: '14px',
      base: '16px',
      large: '18px',
      heading: '24px',
    },
    lineHeight: {
      normal: '1.5',
      relaxed: '1.6'
    }
  },
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '25px',
    xxl: '30px'
  },
  layout: {
    containerMaxWidth: '600px',
    logoMaxWidth: '200px',
    borderRadius: '10px',
    iconSize: '24px'
  }
} as const

/**
 * Welcome Email Template for Aclue Newsletter Subscribers
 *
 * React-based email template using @react-email/components for optimal
 * email client compatibility and responsive design.
 *
 * Features:
 * - Responsive design that works across all email clients
 * - Comprehensive dark mode support with automatic theme detection
 * - Aclue branding with logo and gradient styling
 * - Feature highlights with icons and descriptions
 * - Accessible HTML structure with proper contrast ratios
 * - Fallback text for logo display issues
 * - MSO Outlook conditional styling support
 * - Cross-client colour scheme compatibility
 *
 * Dark Mode Implementation:
 * - Uses @media (prefers-color-scheme: dark) for automatic detection
 * - Includes meta tags for colour-scheme support
 * - Uses high contrast colours (#f0f0f0 on #121212 backgrounds)
 * - Maintains brand consistency with adjusted gradient colours
 * - Logo filter adjustments for both light and dark themes
 *
 * Based on existing backend email template but optimised for React Email.
 */
export default function WelcomeEmail({ email, source = 'newsletter' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <title>Welcome to Aclue - AI-Powered Gift Discovery!</title>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          /* CSS Custom Properties for Dark Mode */
          :root {
            color-scheme: light dark;
          }

          /* Dark Mode Styles - Generated from theme */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: ${emailTheme.colors.dark.background} !important;
              color: ${emailTheme.colors.dark.text} !important;
            }

            .email-container {
              background-color: ${emailTheme.colors.dark.background} !important;
            }

            .email-header {
              background: linear-gradient(135deg, ${emailTheme.colors.dark.headerGradientFrom}, ${emailTheme.colors.dark.headerGradientTo}) !important;
            }

            .email-content {
              background-color: ${emailTheme.colors.dark.contentBackground} !important;
              color: ${emailTheme.colors.dark.text} !important;
            }

            .email-heading {
              color: ${emailTheme.colors.dark.heading} !important;
            }

            .email-subheading {
              color: ${emailTheme.colors.dark.subheading} !important;
            }

            .email-paragraph {
              color: ${emailTheme.colors.dark.paragraph} !important;
            }

            .email-feature-text {
              color: ${emailTheme.colors.dark.paragraph} !important;
            }

            .email-signature {
              color: ${emailTheme.colors.dark.signature} !important;
            }

            .email-footer {
              border-top: 1px solid ${emailTheme.colors.dark.border} !important;
            }

            .email-footer-text {
              color: ${emailTheme.colors.dark.footer} !important;
            }

            .email-link {
              color: ${emailTheme.colors.dark.link} !important;
            }

            .email-logo {
              filter: invert(1) brightness(1) !important;
            }
          }

          /* Light Mode Explicit Styles - Generated from theme */
          @media (prefers-color-scheme: light) {
            body {
              background-color: ${emailTheme.colors.light.background} !important;
              color: ${emailTheme.colors.light.text} !important;
            }

            .email-container {
              background-color: ${emailTheme.colors.light.background} !important;
            }

            .email-header {
              background: linear-gradient(135deg, ${emailTheme.colors.light.headerGradientFrom}, ${emailTheme.colors.light.headerGradientTo}) !important;
            }

            .email-content {
              background-color: ${emailTheme.colors.light.contentBackground} !important;
              color: ${emailTheme.colors.light.text} !important;
            }

            .email-heading {
              color: ${emailTheme.colors.light.heading} !important;
            }

            .email-subheading {
              color: ${emailTheme.colors.light.subheading} !important;
            }

            .email-paragraph {
              color: ${emailTheme.colors.light.paragraph} !important;
            }

            .email-feature-text {
              color: ${emailTheme.colors.light.paragraph} !important;
            }

            .email-signature {
              color: ${emailTheme.colors.light.signature} !important;
            }

            .email-footer {
              border-top: 1px solid ${emailTheme.colors.light.border} !important;
            }

            .email-footer-text {
              color: ${emailTheme.colors.light.footer} !important;
            }

            .email-link {
              color: ${emailTheme.colors.light.link} !important;
            }

            .email-logo {
              filter: invert(1) brightness(1) !important;
            }
          }

          /* MSO Outlook Conditional Styles */
          @media screen and (max-width: 600px) {
            .email-container {
              max-width: 100% !important;
              padding: ${emailTheme.spacing.sm} !important;
            }

            .email-header,
            .email-content {
              padding: ${emailTheme.spacing.lg} !important;
            }
          }
        `}</style>
        {/* MSO Outlook Conditional Comments */}
        {/*[if mso]>
          <style type="text/css">
            .email-header { background: linear-gradient(135deg, ${emailTheme.colors.light.headerGradientFrom}, ${emailTheme.colors.light.headerGradientTo}) !important; }
            .email-content { background-color: ${emailTheme.colors.light.contentBackground} !important; }
          </style>
        <![endif]*/}
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle} className="email-container">
          {/* Header Section with Logo and Branding */}
          <Section style={headerStyle} className="email-header">
            <Img
              src="https://aclue.app/aclue_text_clean.png"
              alt="Aclue - AI-Powered Gift Discovery"
              style={logoStyle}
              className="email-logo"
            />
            <Text style={subtitleStyle}>AI-Powered Gift Discovery</Text>
          </Section>

          {/* Main Content Section */}
          <Section style={contentStyle} className="email-content">
            <Heading as="h2" style={headingStyle} className="email-heading">
              Welcome to the Future of Gift Discovery! 🚀
            </Heading>

            <Text style={paragraphStyle} className="email-paragraph">
              Thank you for joining our community! You're among the first to experience how AI can revolutionise gift-giving.
            </Text>

            <Heading as="h3" style={subHeadingStyle} className="email-subheading">
              What's Coming Your Way:
            </Heading>

            {/* Feature List */}
            <div style={featureListStyle}>
              <div style={featureStyle}>
                <span style={featureIconStyle}>🧠</span>
                <Text style={featureTextStyle} className="email-feature-text">
                  <strong>AI-Powered Learning:</strong> Our neural network learns your unique preferences
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>✨</span>
                <Text style={featureTextStyle} className="email-feature-text">
                  <strong>Smart Recommendations:</strong> Personalised gift suggestions that actually understand you
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>👥</span>
                <Text style={featureTextStyle} className="email-feature-text">
                  <strong>Social Integration:</strong> Connect with friends and family for better gift ideas
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>⭐</span>
                <Text style={featureTextStyle} className="email-feature-text">
                  <strong>Curated Quality:</strong> Only the best products make it to your recommendations
                </Text>
              </div>
            </div>

            <Text style={paragraphStyle} className="email-paragraph">
              We're continuously improving the Aclue platform to deliver the most innovative gift discovery experience. Stay tuned for exciting updates!
            </Text>

            <Text style={paragraphStyle} className="email-paragraph">
              Have questions or feedback? Simply reply to this email - we read and respond to every message!
            </Text>

            <Text style={signatureStyle} className="email-signature">
              Excited to have you on board,<br />
              The Aclue Team
            </Text>
          </Section>

          {/* Footer Section */}
          <Section style={footerStyle} className="email-footer">
            <Text style={footerTextStyle} className="email-footer-text">
              You're receiving this email because you signed up for Aclue updates.
            </Text>
            <Text style={footerTextStyle} className="email-footer-text">
              If you no longer wish to receive these emails, you can{' '}
              <Link href="mailto:contact@aclue.app?subject=Unsubscribe" style={linkStyle} className="email-link">
                unsubscribe here
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles following Aclue branding and optimised for email clients
// Light mode defaults with dark mode overrides via CSS classes
const bodyStyle = {
  fontFamily: emailTheme.typography.fontFamily,
  lineHeight: emailTheme.typography.lineHeight.relaxed,
  color: emailTheme.colors.light.text,
  backgroundColor: emailTheme.colors.light.background,
  margin: '0',
  padding: '0',
}

const containerStyle = {
  maxWidth: emailTheme.layout.containerMaxWidth,
  margin: '0 auto',
  padding: emailTheme.spacing.lg,
  backgroundColor: emailTheme.colors.light.background, // Light mode fallback
}

const headerStyle = {
  background: `linear-gradient(135deg, ${emailTheme.colors.light.headerGradientFrom}, ${emailTheme.colors.light.headerGradientTo})`,
  color: '#ffffff',
  padding: emailTheme.spacing.xxl,
  textAlign: 'center' as const,
  borderRadius: `${emailTheme.layout.borderRadius} ${emailTheme.layout.borderRadius} 0 0`,
}

const logoStyle = {
  maxWidth: emailTheme.layout.logoMaxWidth,
  height: 'auto',
  marginBottom: emailTheme.spacing.md,
  filter: 'invert(1)', // Makes logo white on gradient background
}

const subtitleStyle = {
  fontSize: emailTheme.typography.fontSize.base,
  opacity: '0.9',
  margin: '0',
  color: '#ffffff',
}

const contentStyle = {
  backgroundColor: emailTheme.colors.light.contentBackground, // Light mode fallback
  color: emailTheme.colors.light.text, // Light mode fallback
  padding: emailTheme.spacing.xxl,
  borderRadius: `0 0 ${emailTheme.layout.borderRadius} ${emailTheme.layout.borderRadius}`,
}

const headingStyle = {
  fontSize: emailTheme.typography.fontSize.heading,
  fontWeight: 'bold',
  color: emailTheme.colors.light.heading, // Light mode fallback
  marginBottom: emailTheme.spacing.lg,
  marginTop: '0',
}

const subHeadingStyle = {
  fontSize: emailTheme.typography.fontSize.large,
  fontWeight: 'bold',
  color: emailTheme.colors.light.subheading, // Light mode fallback
  marginBottom: emailTheme.spacing.md,
  marginTop: emailTheme.spacing.xl,
}

const paragraphStyle = {
  fontSize: emailTheme.typography.fontSize.base,
  color: emailTheme.colors.light.paragraph, // Light mode fallback
  marginBottom: emailTheme.typography.fontSize.base,
  lineHeight: emailTheme.typography.lineHeight.relaxed,
}

const featureListStyle = {
  marginBottom: emailTheme.spacing.lg,
}

const featureStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: emailTheme.spacing.md,
}

const featureIconStyle = {
  fontSize: emailTheme.layout.iconSize,
  marginRight: '12px',
  width: emailTheme.layout.iconSize,
  height: emailTheme.layout.iconSize,
}

const featureTextStyle = {
  fontSize: emailTheme.typography.fontSize.base,
  color: emailTheme.colors.light.paragraph, // Light mode fallback
  margin: '0',
  lineHeight: emailTheme.typography.lineHeight.normal,
}

const signatureStyle = {
  fontSize: emailTheme.typography.fontSize.base,
  color: emailTheme.colors.light.signature, // Light mode fallback
  marginTop: emailTheme.spacing.xl,
  marginBottom: '0',
}

const footerStyle = {
  textAlign: 'center' as const,
  marginTop: emailTheme.spacing.xxl,
  padding: `${emailTheme.spacing.lg} 0`,
  borderTop: `1px solid ${emailTheme.colors.light.border}`, // Light mode fallback
}

const footerTextStyle = {
  fontSize: emailTheme.typography.fontSize.small,
  color: emailTheme.colors.light.footer, // Light mode fallback
  margin: `${emailTheme.spacing.xs} 0`,
}

const linkStyle = {
  color: emailTheme.colors.light.link, // Light mode fallback
  textDecoration: 'underline',
}