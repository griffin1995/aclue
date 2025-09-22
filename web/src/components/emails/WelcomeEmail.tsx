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

/**
 * Welcome Email Template for Aclue Newsletter Subscribers
 * 
 * React-based email template using @react-email/components for optimal
 * email client compatibility and responsive design.
 * 
 * Features:
 * - Responsive design that works across all email clients
 * - Aclue branding with logo and gradient styling
 * - Feature highlights with icons and descriptions
 * - Accessible HTML structure
 * - Fallback text for logo display issues
 * 
 * Based on existing backend email template but optimised for React Email.
 */
export default function WelcomeEmail({ email, source = 'newsletter' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <title>Welcome to Aclue - AI-Powered Gift Discovery!</title>
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header Section with Logo and Branding */}
          <Section style={headerStyle}>
            <Img
              src="https://aclue.app/aclue_text_clean.png"
              alt="Aclue - AI-Powered Gift Discovery"
              style={logoStyle}
            />
            <Text style={subtitleStyle}>AI-Powered Gift Discovery</Text>
          </Section>

          {/* Main Content Section */}
          <Section style={contentStyle}>
            <Heading as="h2" style={headingStyle}>
              Welcome to the Future of Gift Discovery! 🚀
            </Heading>

            <Text style={paragraphStyle}>
              Thank you for joining our community! You're among the first to experience how AI can revolutionise gift-giving.
            </Text>

            <Heading as="h3" style={subHeadingStyle}>
              What's Coming Your Way:
            </Heading>

            {/* Feature List */}
            <div style={featureListStyle}>
              <div style={featureStyle}>
                <span style={featureIconStyle}>🧠</span>
                <Text style={featureTextStyle}>
                  <strong>AI-Powered Learning:</strong> Our neural network learns your unique preferences
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>✨</span>
                <Text style={featureTextStyle}>
                  <strong>Smart Recommendations:</strong> Personalised gift suggestions that actually understand you
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>👥</span>
                <Text style={featureTextStyle}>
                  <strong>Social Integration:</strong> Connect with friends and family for better gift ideas
                </Text>
              </div>

              <div style={featureStyle}>
                <span style={featureIconStyle}>⭐</span>
                <Text style={featureTextStyle}>
                  <strong>Curated Quality:</strong> Only the best products make it to your recommendations
                </Text>
              </div>
            </div>

            <Text style={paragraphStyle}>
              We're continuously improving the Aclue platform to deliver the most innovative gift discovery experience. Stay tuned for exciting updates!
            </Text>

            <Text style={paragraphStyle}>
              Have questions or feedback? Simply reply to this email - we read and respond to every message!
            </Text>

            <Text style={signatureStyle}>
              Excited to have you on board,<br />
              The Aclue Team
            </Text>
          </Section>

          {/* Footer Section */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You're receiving this email because you signed up for Aclue updates.
            </Text>
            <Text style={footerTextStyle}>
              If you no longer wish to receive these emails, you can{' '}
              <Link href="mailto:contact@aclue.app?subject=Unsubscribe" style={linkStyle}>
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
const bodyStyle = {
  fontFamily: "'Arial', sans-serif",
  lineHeight: '1.6',
  color: '#333333',
  backgroundColor: '#ffffff',
  margin: '0',
  padding: '0',
}

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const headerStyle = {
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  color: '#ffffff',
  padding: '30px',
  textAlign: 'center' as const,
  borderRadius: '10px 10px 0 0',
}

const logoStyle = {
  maxWidth: '200px',
  height: 'auto',
  marginBottom: '15px',
  filter: 'invert(1)', // Makes logo white on dark background
}

const subtitleStyle = {
  fontSize: '16px',
  opacity: '0.9',
  margin: '0',
  color: '#ffffff',
}

const contentStyle = {
  backgroundColor: '#f8fafc',
  padding: '30px',
  borderRadius: '0 0 10px 10px',
}

const headingStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '20px',
  marginTop: '0',
}

const subHeadingStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#374151',
  marginBottom: '15px',
  marginTop: '25px',
}

const paragraphStyle = {
  fontSize: '16px',
  color: '#374151',
  marginBottom: '16px',
  lineHeight: '1.6',
}

const featureListStyle = {
  marginBottom: '20px',
}

const featureStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px',
}

const featureIconStyle = {
  fontSize: '24px',
  marginRight: '12px',
  width: '24px',
  height: '24px',
}

const featureTextStyle = {
  fontSize: '16px',
  color: '#374151',
  margin: '0',
  lineHeight: '1.5',
}

const signatureStyle = {
  fontSize: '16px',
  color: '#374151',
  marginTop: '25px',
  marginBottom: '0',
}

const footerStyle = {
  textAlign: 'center' as const,
  marginTop: '30px',
  padding: '20px 0',
  borderTop: '1px solid #e5e7eb',
}

const footerTextStyle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '5px 0',
}

const linkStyle = {
  color: '#3b82f6',
  textDecoration: 'underline',
}