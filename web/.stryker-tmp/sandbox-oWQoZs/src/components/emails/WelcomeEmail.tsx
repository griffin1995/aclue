// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React from 'react';
import { Html, Head, Body, Container, Section, Heading, Text, Img, Link, Row, Column } from '@react-email/components';
interface WelcomeEmailProps {
  email: string;
  source?: string;
}

/**
 * Welcome Email Template for aclue Newsletter Subscribers
 * 
 * React-based email template using @react-email/components for optimal
 * email client compatibility and responsive design.
 * 
 * Features:
 * - Responsive design that works across all email clients
 * - aclue branding with logo and gradient styling
 * - Feature highlights with icons and descriptions
 * - Accessible HTML structure
 * - Fallback text for logo display issues
 * 
 * Based on existing backend email template but optimised for React Email.
 */
export default function WelcomeEmail({
  email,
  source = stryMutAct_9fa48("3344") ? "" : (stryCov_9fa48("3344"), 'newsletter')
}: WelcomeEmailProps) {
  if (stryMutAct_9fa48("3345")) {
    {}
  } else {
    stryCov_9fa48("3345");
    return <Html>
      <Head>
        <title>Welcome to aclue - AI-Powered Gift Discovery!</title>
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header Section with Logo and Branding */}
          <Section style={headerStyle}>
            <Img src="https://aclue.app/aclue_text_clean.png" alt="aclue - AI-Powered Gift Discovery" style={logoStyle} />
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
              We're continuously improving the aclue platform to deliver the most innovative gift discovery experience. Stay tuned for exciting updates!
            </Text>

            <Text style={paragraphStyle}>
              Have questions or feedback? Simply reply to this email - we read and respond to every message!
            </Text>

            <Text style={signatureStyle}>
              Excited to have you on board,<br />
              The aclue Team
            </Text>
          </Section>

          {/* Footer Section */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You're receiving this email because you signed up for aclue updates.
            </Text>
            <Text style={footerTextStyle}>
              If you no longer wish to receive these emails, you can{stryMutAct_9fa48("3346") ? "" : (stryCov_9fa48("3346"), ' ')}
              <Link href="mailto:contact@aclue.app?subject=Unsubscribe" style={linkStyle}>
                unsubscribe here
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>;
  }
}

// Styles following aclue branding and optimised for email clients
const bodyStyle = stryMutAct_9fa48("3347") ? {} : (stryCov_9fa48("3347"), {
  fontFamily: stryMutAct_9fa48("3348") ? "" : (stryCov_9fa48("3348"), "'Arial', sans-serif"),
  lineHeight: stryMutAct_9fa48("3349") ? "" : (stryCov_9fa48("3349"), '1.6'),
  color: stryMutAct_9fa48("3350") ? "" : (stryCov_9fa48("3350"), '#333333'),
  backgroundColor: stryMutAct_9fa48("3351") ? "" : (stryCov_9fa48("3351"), '#ffffff'),
  margin: stryMutAct_9fa48("3352") ? "" : (stryCov_9fa48("3352"), '0'),
  padding: stryMutAct_9fa48("3353") ? "" : (stryCov_9fa48("3353"), '0')
});
const containerStyle = stryMutAct_9fa48("3354") ? {} : (stryCov_9fa48("3354"), {
  maxWidth: stryMutAct_9fa48("3355") ? "" : (stryCov_9fa48("3355"), '600px'),
  margin: stryMutAct_9fa48("3356") ? "" : (stryCov_9fa48("3356"), '0 auto'),
  padding: stryMutAct_9fa48("3357") ? "" : (stryCov_9fa48("3357"), '20px')
});
const headerStyle = stryMutAct_9fa48("3358") ? {} : (stryCov_9fa48("3358"), {
  background: stryMutAct_9fa48("3359") ? "" : (stryCov_9fa48("3359"), 'linear-gradient(135deg, #3b82f6, #8b5cf6)'),
  color: stryMutAct_9fa48("3360") ? "" : (stryCov_9fa48("3360"), '#ffffff'),
  padding: stryMutAct_9fa48("3361") ? "" : (stryCov_9fa48("3361"), '30px'),
  textAlign: 'center' as const,
  borderRadius: stryMutAct_9fa48("3362") ? "" : (stryCov_9fa48("3362"), '10px 10px 0 0')
});
const logoStyle = stryMutAct_9fa48("3363") ? {} : (stryCov_9fa48("3363"), {
  maxWidth: stryMutAct_9fa48("3364") ? "" : (stryCov_9fa48("3364"), '200px'),
  height: stryMutAct_9fa48("3365") ? "" : (stryCov_9fa48("3365"), 'auto'),
  marginBottom: stryMutAct_9fa48("3366") ? "" : (stryCov_9fa48("3366"), '15px'),
  filter: stryMutAct_9fa48("3367") ? "" : (stryCov_9fa48("3367"), 'invert(1)') // Makes logo white on dark background
});
const subtitleStyle = stryMutAct_9fa48("3368") ? {} : (stryCov_9fa48("3368"), {
  fontSize: stryMutAct_9fa48("3369") ? "" : (stryCov_9fa48("3369"), '16px'),
  opacity: stryMutAct_9fa48("3370") ? "" : (stryCov_9fa48("3370"), '0.9'),
  margin: stryMutAct_9fa48("3371") ? "" : (stryCov_9fa48("3371"), '0'),
  color: stryMutAct_9fa48("3372") ? "" : (stryCov_9fa48("3372"), '#ffffff')
});
const contentStyle = stryMutAct_9fa48("3373") ? {} : (stryCov_9fa48("3373"), {
  backgroundColor: stryMutAct_9fa48("3374") ? "" : (stryCov_9fa48("3374"), '#f8fafc'),
  padding: stryMutAct_9fa48("3375") ? "" : (stryCov_9fa48("3375"), '30px'),
  borderRadius: stryMutAct_9fa48("3376") ? "" : (stryCov_9fa48("3376"), '0 0 10px 10px')
});
const headingStyle = stryMutAct_9fa48("3377") ? {} : (stryCov_9fa48("3377"), {
  fontSize: stryMutAct_9fa48("3378") ? "" : (stryCov_9fa48("3378"), '24px'),
  fontWeight: stryMutAct_9fa48("3379") ? "" : (stryCov_9fa48("3379"), 'bold'),
  color: stryMutAct_9fa48("3380") ? "" : (stryCov_9fa48("3380"), '#1f2937'),
  marginBottom: stryMutAct_9fa48("3381") ? "" : (stryCov_9fa48("3381"), '20px'),
  marginTop: stryMutAct_9fa48("3382") ? "" : (stryCov_9fa48("3382"), '0')
});
const subHeadingStyle = stryMutAct_9fa48("3383") ? {} : (stryCov_9fa48("3383"), {
  fontSize: stryMutAct_9fa48("3384") ? "" : (stryCov_9fa48("3384"), '18px'),
  fontWeight: stryMutAct_9fa48("3385") ? "" : (stryCov_9fa48("3385"), 'bold'),
  color: stryMutAct_9fa48("3386") ? "" : (stryCov_9fa48("3386"), '#374151'),
  marginBottom: stryMutAct_9fa48("3387") ? "" : (stryCov_9fa48("3387"), '15px'),
  marginTop: stryMutAct_9fa48("3388") ? "" : (stryCov_9fa48("3388"), '25px')
});
const paragraphStyle = stryMutAct_9fa48("3389") ? {} : (stryCov_9fa48("3389"), {
  fontSize: stryMutAct_9fa48("3390") ? "" : (stryCov_9fa48("3390"), '16px'),
  color: stryMutAct_9fa48("3391") ? "" : (stryCov_9fa48("3391"), '#374151'),
  marginBottom: stryMutAct_9fa48("3392") ? "" : (stryCov_9fa48("3392"), '16px'),
  lineHeight: stryMutAct_9fa48("3393") ? "" : (stryCov_9fa48("3393"), '1.6')
});
const featureListStyle = stryMutAct_9fa48("3394") ? {} : (stryCov_9fa48("3394"), {
  marginBottom: stryMutAct_9fa48("3395") ? "" : (stryCov_9fa48("3395"), '20px')
});
const featureStyle = stryMutAct_9fa48("3396") ? {} : (stryCov_9fa48("3396"), {
  display: stryMutAct_9fa48("3397") ? "" : (stryCov_9fa48("3397"), 'flex'),
  alignItems: stryMutAct_9fa48("3398") ? "" : (stryCov_9fa48("3398"), 'center'),
  marginBottom: stryMutAct_9fa48("3399") ? "" : (stryCov_9fa48("3399"), '15px')
});
const featureIconStyle = stryMutAct_9fa48("3400") ? {} : (stryCov_9fa48("3400"), {
  fontSize: stryMutAct_9fa48("3401") ? "" : (stryCov_9fa48("3401"), '24px'),
  marginRight: stryMutAct_9fa48("3402") ? "" : (stryCov_9fa48("3402"), '12px'),
  width: stryMutAct_9fa48("3403") ? "" : (stryCov_9fa48("3403"), '24px'),
  height: stryMutAct_9fa48("3404") ? "" : (stryCov_9fa48("3404"), '24px')
});
const featureTextStyle = stryMutAct_9fa48("3405") ? {} : (stryCov_9fa48("3405"), {
  fontSize: stryMutAct_9fa48("3406") ? "" : (stryCov_9fa48("3406"), '16px'),
  color: stryMutAct_9fa48("3407") ? "" : (stryCov_9fa48("3407"), '#374151'),
  margin: stryMutAct_9fa48("3408") ? "" : (stryCov_9fa48("3408"), '0'),
  lineHeight: stryMutAct_9fa48("3409") ? "" : (stryCov_9fa48("3409"), '1.5')
});
const signatureStyle = stryMutAct_9fa48("3410") ? {} : (stryCov_9fa48("3410"), {
  fontSize: stryMutAct_9fa48("3411") ? "" : (stryCov_9fa48("3411"), '16px'),
  color: stryMutAct_9fa48("3412") ? "" : (stryCov_9fa48("3412"), '#374151'),
  marginTop: stryMutAct_9fa48("3413") ? "" : (stryCov_9fa48("3413"), '25px'),
  marginBottom: stryMutAct_9fa48("3414") ? "" : (stryCov_9fa48("3414"), '0')
});
const footerStyle = stryMutAct_9fa48("3415") ? {} : (stryCov_9fa48("3415"), {
  textAlign: 'center' as const,
  marginTop: stryMutAct_9fa48("3416") ? "" : (stryCov_9fa48("3416"), '30px'),
  padding: stryMutAct_9fa48("3417") ? "" : (stryCov_9fa48("3417"), '20px 0'),
  borderTop: stryMutAct_9fa48("3418") ? "" : (stryCov_9fa48("3418"), '1px solid #e5e7eb')
});
const footerTextStyle = stryMutAct_9fa48("3419") ? {} : (stryCov_9fa48("3419"), {
  fontSize: stryMutAct_9fa48("3420") ? "" : (stryCov_9fa48("3420"), '14px'),
  color: stryMutAct_9fa48("3421") ? "" : (stryCov_9fa48("3421"), '#6b7280'),
  margin: stryMutAct_9fa48("3422") ? "" : (stryCov_9fa48("3422"), '5px 0')
});
const linkStyle = stryMutAct_9fa48("3423") ? {} : (stryCov_9fa48("3423"), {
  color: stryMutAct_9fa48("3424") ? "" : (stryCov_9fa48("3424"), '#3b82f6'),
  textDecoration: stryMutAct_9fa48("3425") ? "" : (stryCov_9fa48("3425"), 'underline')
});