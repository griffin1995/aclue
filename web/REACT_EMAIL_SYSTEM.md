# 📧 aclue React Email Preview System

A comprehensive TypeScript-based email template preview and testing system for the aclue platform. This system uses React Email components to generate production-quality email previews and supports real email sending for testing.

## 🚀 Quick Start

### Generate Email Previews
```bash
# Generate all email previews
npm run email:preview

# Quick development workflow
npm run email:dev
```

### Send Test Emails
```bash
# Send test email (requires RESEND_API_KEY in .env)
npm run email:send-test your.email@example.com

# Send test suite with multiple scenarios
npm run email:send-test your.email@example.com --suite

# Test mode (no actual emails sent)
npm run email:send-test your.email@example.com --test-mode
```

## 📁 Generated Files

The preview system generates files in `web/email-previews/`:

### Combined Preview
- **`combined-preview.html`** - Interactive preview of all email templates with theme controls

### Welcome Email Variations
For each sample email and source combination:
- **`welcome-email-{email}-{source}-light.html`** - Light theme version
- **`welcome-email-{email}-{source}-dark.html`** - Dark theme version
- **`welcome-email-{email}-{source}-mobile.html`** - Mobile-optimised version

Sample emails: `john-doe`, `sarah-wilson`, `alex-chen`
Sources: `newsletter`, `maintenance_page`, `landing_page`

## 🎨 Features

### Advanced Preview Controls
- **Theme Toggle**: Switch between light and dark modes instantly
- **Mobile/Desktop Views**: Test responsive behaviour
- **Text Version**: View plain text email content
- **Print Support**: Print-friendly preview mode
- **Keyboard Shortcuts**: Ctrl/Cmd + D (theme), M (mobile), T (text)

### Production-Ready Templates
- **React Email Components**: Uses `@react-email/components` for optimal compatibility
- **Cross-Client Support**: Works across Outlook, Gmail, Apple Mail, etc.
- **Responsive Design**: Mobile-first approach with breakpoint optimisation
- **Accessibility**: Proper ARIA labels and semantic HTML structure
- **British English**: Consistent language throughout all templates

### Development Workflow
- **TypeScript**: Fully typed implementation with error handling
- **Hot Reloading**: Regenerate previews instantly during development
- **Sample Data**: Realistic test data for comprehensive preview testing
- **Error Handling**: Graceful fallbacks and detailed error messages

## 🛠️ System Architecture

### Core Components

#### 1. Preview Generator (`scripts/generate-email-previews.ts`)
- **Purpose**: Generates HTML preview files from React Email components
- **Technology**: TypeScript with React Email rendering
- **Features**: Multi-theme support, responsive testing, sample data generation

#### 2. Test Email Sender (`scripts/send-test-email.ts`)
- **Purpose**: Sends real test emails via Resend API
- **Technology**: TypeScript with Resend integration
- **Features**: Configuration validation, test mode, batch sending

#### 3. React Email Component (`src/components/emails/WelcomeEmail.tsx`)
- **Purpose**: The actual email template used in production
- **Technology**: React Email with TypeScript
- **Features**: Theme support, responsive design, glassmorphism effects

### Integration with aclue Platform
- **Consistent Branding**: Uses aclue purple gradient and logo
- **Production Ready**: Same components used in live email sending
- **British English**: All content follows aclue's language standards
- **Brand Colours**: `#f03dff` to `#59006d` gradient with proper contrast

## 📧 Email Template Details

### Welcome Email Template
- **Component**: `WelcomeEmail.tsx` in `/src/components/emails/`
- **Subject**: "Welcome to aclue - AI-Powered Gift Discovery Awaits! 🎁"
- **Features**:
  - SVG logo with theme-aware colouring
  - Glassmorphism design effects
  - Feature highlights with two-column layout
  - Social proof and early access messaging
  - Responsive breakpoints for mobile optimisation

### Template Props
```typescript
interface WelcomeEmailProps {
  email: string        // Recipient email address
  source?: string      // Signup source (newsletter, maintenance_page, etc.)
}
```

### Theme Support
- **Light Theme**: Default bright theme for standard email clients
- **Dark Theme**: Automatic detection via CSS `prefers-color-scheme: dark`
- **Manual Override**: JavaScript controls for preview testing
- **Email Client Fallbacks**: Solid colours for limited CSS support

## 🔧 Configuration

### Environment Variables
```bash
# Required for test email sending
RESEND_API_KEY=your_resend_api_key_here

# Optional configuration
FROM_EMAIL=aclue <noreply@aclue.app>
NODE_ENV=development
```

### Dependencies
- **@react-email/components**: Email component library
- **@react-email/render**: Server-side rendering
- **resend**: Email API service
- **tsx**: TypeScript execution runtime

## 📱 Mobile Support

### Responsive Design Features
- **Mobile-First**: Designed for mobile email clients first
- **Flexible Layout**: Scales appropriately across screen sizes
- **Touch-Friendly**: Proper button sizes and spacing
- **Fast Loading**: Optimised for mobile connections

### Breakpoints
- **Desktop**: 700px+ containers with full feature layout
- **Tablet**: 600px containers with simplified navigation
- **Mobile**: 375px containers with stacked content

## 🧪 Testing Features

### Preview Testing
- **Real Templates**: Uses actual production email components
- **Sample Variations**: Tests multiple email addresses and sources
- **Interactive Controls**: Theme switching and layout toggling
- **Cross-Browser**: Compatible with modern browsers

### Email Client Testing
- **Resend Integration**: Send real emails to test in actual clients
- **Batch Testing**: Test multiple scenarios automatically
- **Safety Features**: Test mode prevents accidental sending
- **Validation**: Email format and configuration validation

## 🎯 Use Cases

### Development Workflow
1. **Modify Email Templates**: Edit `WelcomeEmail.tsx` component
2. **Generate Previews**: Run `npm run email:preview`
3. **Visual Review**: Open `combined-preview.html` in browser
4. **Test Sending**: Send to real email addresses for client testing
5. **Iterate**: Repeat process for refinements

### Quality Assurance
- **Cross-Client Testing**: Verify Outlook, Gmail, Apple Mail compatibility
- **Responsive Testing**: Confirm mobile device display
- **Theme Testing**: Ensure dark mode functions correctly
- **Content Review**: Validate copy, links, and formatting

### Stakeholder Demos
- **Client Previews**: Share preview files for approval
- **Marketing Review**: Verify brand consistency
- **Content Approval**: Validate messaging and CTAs

## 🔍 Troubleshooting

### Common Issues

#### Preview Generation Fails
```bash
# Check TypeScript compilation
npm run type-check

# Verify React Email components
npm list @react-email/components @react-email/render

# Clear node_modules if needed
rm -rf node_modules && npm install
```

#### Email Sending Fails
```bash
# Check environment configuration
echo $RESEND_API_KEY

# Test with test mode first
npm run email:send-test your.email@example.com --test-mode

# Verify email format
npm run email:send-test invalid-email  # Should show validation error
```

#### Preview Display Issues
- **Browser Compatibility**: Use modern browsers (Chrome, Firefox, Safari, Edge)
- **JavaScript Required**: Interactive features need JS enabled
- **File Access**: Ensure preview files are accessible (check file permissions)

## 🚀 Advanced Usage

### Custom Preview Generation
```typescript
import ReactEmailPreviewGenerator from './scripts/generate-email-previews';

const generator = new ReactEmailPreviewGenerator();
await generator.generateAllPreviews();
```

### Automated Testing Integration
```bash
# CI/CD integration
npm run email:preview && echo "Email previews generated successfully"

# Test email validation in pipelines
npm run email:send-test test@example.com --test-mode
```

### Custom Email Testing
```bash
# Test specific scenarios
npm run email:send-test user@company.com --suite

# Test with different environment
NODE_ENV=production npm run email:send-test test@example.com --test-mode
```

## 📊 Performance Considerations

### Generation Speed
- **Fast Rendering**: Typically completes in under 10 seconds
- **TypeScript Compilation**: Cached for subsequent runs
- **Parallel Processing**: Multiple email variations generated efficiently

### File Sizes
- **Individual Previews**: ~40KB each (with embedded styling)
- **Combined Preview**: ~39KB (all templates)
- **Total Output**: ~1.1MB for complete preview set

### Browser Performance
- **Optimised CSS**: Minimal external dependencies
- **Embedded Assets**: Self-contained files for offline viewing
- **Responsive Loading**: Efficient mobile rendering

## 🔮 Future Enhancements

### Planned Features
- **A/B Testing**: Multiple template variations
- **Analytics Integration**: Preview interaction tracking
- **Email Client Screenshots**: Automated cross-client visual testing
- **Localisation Support**: Multi-language template variants

### Potential Integrations
- **Backend Integration**: Direct integration with email API endpoints
- **Design System**: Integration with aclue design tokens
- **Performance Monitoring**: Template load time analysis
- **Version Control**: Template change tracking and rollback

## 📚 Migration from Old System

This React Email system replaces the previous Python-based email preview system. Key improvements:

### What's Better
- **TypeScript Safety**: Type checking and better error handling
- **React Email**: Industry-standard email component library
- **Production Consistency**: Same components used in live emails
- **Modern Tooling**: Better development experience
- **British English**: Consistent language standards

### Migration Steps Completed
- ✅ Created TypeScript preview generator
- ✅ Added React Email test sender
- ✅ Integrated NPM scripts
- ✅ Removed old Python scripts
- ✅ Cleaned up redundant files
- ✅ Updated documentation

### Breaking Changes
- **File Locations**: Previews now in `web/email-previews/` instead of `backend/email_previews/`
- **Command Structure**: Use `npm run email:*` instead of Python scripts
- **Configuration**: Environment variables in frontend `.env` files

## 🔒 Security Considerations

### Email Testing Safety
- **Test Mode**: Prevents accidental email sending during development
- **API Key Protection**: Requires explicit environment variable setup
- **Email Validation**: Format checking before sending
- **Rate Limiting**: Respects Resend API limits

### Preview File Security
- **Local Generation**: All preview files generated locally
- **No Sensitive Data**: Uses sample data for testing
- **Static Files**: Preview files contain no executable code

---

## 📞 Support

For questions about the React Email system:
- **Documentation**: This file and inline code comments
- **Examples**: Generated preview files show expected output
- **Testing**: Use test mode to verify functionality
- **Integration**: Follow existing aclue development patterns

**Last Updated**: September 2025
**Version**: 1.0.0
**Compatibility**: aclue Platform v2.1.0+
**Technology**: React Email + TypeScript + Resend API