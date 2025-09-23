# 📧 Aclue Email Template Preview System

A comprehensive system for previewing and testing email templates in the Aclue platform. This system allows developers to quickly generate HTML previews and send test emails to verify how templates appear in real email clients.

## 🚀 Quick Start

### Generate Email Previews
```bash
# Simple preview generation
./preview_emails.sh preview

# Or run directly with Python
source venv/bin/activate
python scripts/generate_email_previews.py
```

### Send Test Email
```bash
# Send welcome email test
./preview_emails.sh send-test your.email@example.com

# Send admin notification test
./preview_emails.sh send-test admin@example.com admin

# Send both types
./preview_emails.sh send-test test@example.com both
```

### Check Configuration
```bash
./preview_emails.sh check-config
```

## 📁 Generated Files

The preview system generates the following files in `email_previews/`:

### Combined Preview
- **`combined_preview.html`** - All templates in one interactive file with theme toggle

### Welcome Email Templates
- **`welcome_email_light.html`** - Light theme version
- **`welcome_email_dark.html`** - Dark theme version
- **`welcome_email_mobile.html`** - Mobile-optimized version
- **`welcome_email_outlook.html`** - Outlook-compatible version
- **`welcome_email_gmail.html`** - Gmail-compatible version

### Admin Notification Templates
- **`admin_notification_light.html`** - Light theme version
- **`admin_notification_dark.html`** - Dark theme version

## 🎨 Features

### Theme Support
- **Light Theme**: Default bright theme for most email clients
- **Dark Theme**: Automatic dark mode support using CSS media queries
- **Theme Toggle**: Interactive preview with manual theme switching

### Email Client Compatibility
- **Outlook**: Fallback styles for limited CSS support
- **Gmail**: Optimized for Gmail's CSS restrictions
- **Mobile**: Responsive design testing
- **Universal**: Works across all major email clients

### Interactive Previews
- **Theme Toggle Button**: Switch between light and dark modes
- **Mobile Toggle**: Preview mobile vs desktop layouts
- **Print Support**: Print-friendly preview versions
- **Responsive Design**: Automatic responsive breakpoints

### Development Tools
- **Live Regeneration**: Easy regeneration with current email service code
- **Sample Data**: Realistic test data for all template types
- **Timestamp Tracking**: Know when previews were generated
- **Error Handling**: Graceful fallbacks for missing dependencies

## 🛠️ System Components

### Core Scripts
1. **`scripts/generate_email_previews.py`** - Main preview generator
2. **`scripts/send_test_email.py`** - Test email sender
3. **`preview_emails.sh`** - Convenient shell wrapper

### Email Service Integration
- Uses actual `EmailService` class from `app/services/email_service.py`
- Extracts real template HTML using service methods
- Maintains consistency with production email output

### Template Extraction Process
1. **Service Import**: Import EmailService from the app
2. **Template Generation**: Call template methods with test data
3. **HTML Enhancement**: Add preview-specific controls and styling
4. **File Output**: Save to organized preview directory structure

## 📧 Template Types

### Welcome Email Template
**Source**: `EmailService._get_welcome_email_template()`
- **Subject**: "Welcome to aclue - AI-Powered Gift Discovery! 🎁"
- **Features**: SVG logo, glassmorphism design, feature highlights
- **Themes**: Light/dark mode support with automatic detection
- **Content**: Welcome message, feature overview, contact information

### Admin Notification Template
**Source**: `EmailService._get_admin_notification_template()`
- **Subject**: "New Newsletter Signup: {email}"
- **Features**: Signup details, timestamp, source tracking
- **Purpose**: Notify administrators of new newsletter subscriptions
- **Data**: Email, source, signup ID, timestamp

## 🎯 Use Cases

### Development Workflow
1. **Modify Email Templates**: Edit templates in `email_service.py`
2. **Generate Previews**: Run `./preview_emails.sh preview`
3. **Visual Review**: Open `combined_preview.html` in browser
4. **Test Emails**: Send to real email addresses for client testing
5. **Iterate**: Repeat process for refinements

### Quality Assurance
- **Cross-Client Testing**: Check Outlook, Gmail, Apple Mail compatibility
- **Responsive Testing**: Verify mobile device display
- **Theme Testing**: Ensure dark mode works correctly
- **Content Review**: Validate copy, links, and formatting

### Client Demos
- **Stakeholder Reviews**: Share preview files for approval
- **Marketing Review**: Check branding consistency
- **Content Approval**: Validate messaging and CTAs

## 🔧 Configuration

### Environment Requirements
```bash
# Required in .env file for test emails
RESEND_API_KEY=your_resend_api_key_here

# Email service configuration
ADMIN_EMAIL=admin@aclue.app
FROM_EMAIL=aclue <noreply@aclue.app>
```

### Dependencies
- **Python 3.11+**: Core runtime
- **httpx**: HTTP client for Resend API
- **Virtual Environment**: Isolated Python environment
- **Email Service**: Aclue email service module

### File Permissions
```bash
# Make scripts executable
chmod +x preview_emails.sh
chmod +x scripts/generate_email_previews.py
chmod +x scripts/send_test_email.py
```

## 🧪 Testing Features

### Test Email Safety
- **Confirmation Required**: User must confirm before sending real emails
- **Test Data**: Clear identification in test emails
- **Email Validation**: Basic format validation for recipient addresses
- **Configuration Check**: Validates environment before sending

### Preview Accuracy
- **Real Templates**: Uses actual email service template methods
- **Current Data**: Always reflects latest template changes
- **Sample Data**: Realistic test data for all template variables
- **Theme Simulation**: Accurate light/dark mode representation

## 📱 Mobile Support

### Responsive Design
- **Viewport Meta**: Proper mobile viewport configuration
- **Flexible Layout**: Scales appropriately on small screens
- **Touch-Friendly**: Appropriate button and link sizes
- **Fast Loading**: Optimized for mobile connections

### Mobile Preview Mode
- **Device Simulation**: 375px width mobile simulation
- **Interactive Toggle**: Switch between mobile and desktop views
- **Orientation Support**: Works in portrait and landscape
- **Cross-Device**: Compatible with iOS and Android email clients

## 🎨 Styling and Themes

### Light Theme (Default)
```css
/* Light theme colors */
Background: #ffffff
Text: #333333
Header: Linear gradient (#3b82f6 to #8b5cf6)
Content: #f8fafc with glassmorphism effects
```

### Dark Theme (Auto-detected)
```css
/* Dark theme colors */
Background: #111827
Text: #e5e7eb
Header: Maintains gradient with proper contrast
Content: #1f2937 with appropriate transparency
```

### Email Client Fallbacks
- **Outlook**: Solid colors instead of gradients
- **Gmail**: Enhanced backdrop fallbacks
- **Apple Mail**: Native dark mode support
- **Thunderbird**: Cross-platform compatibility

## 🔍 Troubleshooting

### Common Issues

#### Preview Generation Fails
```bash
# Check virtual environment
source venv/bin/activate
pip install -r requirements.txt

# Verify dependencies
python -c "import httpx; print('✅ httpx installed')"
```

#### Email Service Import Errors
```bash
# Check Python path
cd backend
python -c "from app.services.email_service import EmailService; print('✅ Import successful')"
```

#### Test Email Sending Fails
```bash
# Check configuration
./preview_emails.sh check-config

# Verify Resend API key
echo $RESEND_API_KEY
```

### File Access Issues
```bash
# Check directory permissions
ls -la email_previews/
chmod 755 email_previews/
```

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Legacy Support**: Graceful fallbacks for older browsers
- **JavaScript Required**: For interactive features (theme toggle)

## 🚀 Advanced Usage

### Custom Preview Generation
```python
# Create custom preview with specific data
from scripts.generate_email_previews import EmailPreviewGenerator

generator = EmailPreviewGenerator("custom_previews")
generator.generate_all_previews()
```

### Automated Testing Integration
```bash
# CI/CD integration
./preview_emails.sh preview && echo "Previews generated successfully"
```

### Batch Email Testing
```bash
# Test multiple addresses
for email in test1@example.com test2@example.com; do
    ./preview_emails.sh send-test $email welcome
done
```

## 📊 Performance Considerations

### Generation Speed
- **Fast Rendering**: Typically completes in under 5 seconds
- **Incremental Updates**: Only regenerates when templates change
- **Parallel Processing**: Could be enhanced for multiple template variants

### File Sizes
- **HTML Files**: ~20-40KB each (with embedded SVG)
- **Combined Preview**: ~35KB (all templates)
- **Total Directory**: ~200KB for complete set

### Browser Performance
- **Optimized CSS**: Minimal external dependencies
- **Embedded Assets**: Self-contained files for offline viewing
- **Responsive Loading**: Efficient mobile rendering

## 🔮 Future Enhancements

### Planned Features
- **A/B Testing**: Multiple template variations
- **Analytics Integration**: Preview interaction tracking
- **Automated Testing**: CI/CD integration for template validation
- **Email Client Screenshots**: Automated cross-client image generation

### Potential Integrations
- **Figma Export**: Design to email template workflow
- **Localization**: Multi-language template support
- **Personalization**: Dynamic content preview
- **Performance Monitoring**: Template load time analysis

---

## 📚 Additional Resources

- **Email Service Documentation**: See `app/services/email_service.py`
- **Template Development**: Follow Aclue branding guidelines
- **Testing Best Practices**: Test across multiple clients and devices
- **Performance Guidelines**: Optimize for fast email client loading

**Last Updated**: September 2025
**Version**: 1.0.0
**Compatibility**: Aclue Platform v2.1.0+