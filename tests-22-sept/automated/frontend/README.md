# Aclue Frontend Accessibility & SEO Automation Suite

## Overview

This directory contains comprehensive automated frontend accessibility and SEO tools for the Aclue platform. The suite includes 6 industry-standard tools configured for maximum scanning depth and WCAG compliance.

## Installed Tools

### 1. Pa11y (v9.0.0) ✅ WORKING
- **Purpose**: WCAG 2.0/2.1/2.2 automatic violation scanning
- **Configuration**: `.pa11yrc.json`, `.pa11yci.json`
- **Features**:
  - WCAG 2.1 AA compliance testing
  - Multiple page scanning
  - Sitemap crawling
  - Custom Chrome options for sandbox environments

### 2. axe-core CLI (v4.10.2) ✅ WORKING
- **Purpose**: Industry-standard accessibility testing
- **Configuration**: `axe-config.json`
- **Features**:
  - All WCAG rules enabled
  - Multiple tag support (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22a, wcag22aa)
  - Custom ChromeDriver integration

### 3. Lighthouse CLI (v12.8.2) ✅ WORKING
- **Purpose**: Google's performance and accessibility auditing
- **Configuration**: `lighthouse-simple.js`, `lighthouse-desktop-config.js`
- **Features**:
  - Core Web Vitals measurement
  - Mobile and desktop testing
  - Performance, accessibility, SEO, and best practices auditing
  - Custom Chrome options

### 4. broken-link-checker (v0.7.8) ✅ WORKING
- **Purpose**: Automatic 404 and broken link detection
- **Configuration**: `blc-config.json`
- **Features**:
  - Recursive site crawling
  - External and internal link checking
  - Rate limiting and timeout controls
  - Custom filtering options

### 5. webhint (v7.1.13) ⚠️ PARTIAL
- **Purpose**: Modern web best practices scanning
- **Configuration**: `.hintrc`, `.hintrc-simple`
- **Status**: Working with simplified configuration
- **Features**:
  - Web recommended practices
  - JSON output formatting

### 6. Unlighthouse ❌ NOT WORKING
- **Issue**: Module resolution error with Node.js v20.18.2
- **Error**: Cannot find module '@unlighthouse/cli/dist/cli.mjs'
- **Status**: Installation successful but execution fails
- **Workaround**: Use Lighthouse CLI directly for similar functionality

## Testing Results

### Production URL Testing (https://aclue.app)

#### Pa11y Results
- **Status**: ✅ Working
- **Findings**: 17 color contrast errors detected
- **Issues Found**:
  - Multiple elements failing WCAG color contrast requirements
  - Text on gradient backgrounds
  - Low contrast on blue/white text combinations

#### axe-core Results
- **Status**: ✅ Working
- **Findings**: 3 accessibility issues detected
- **Issues Found**:
  - `landmark-main-is-top-level`: Main landmark not at top level
  - `landmark-no-duplicate-main`: Multiple main landmarks detected
  - `landmark-unique`: Non-unique landmarks

#### Lighthouse Results
- **Status**: ✅ Working
- **Features**: Full audit completed for performance, accessibility, SEO, best practices
- **Output**: JSON format with detailed metrics

#### Broken Link Checker Results
- **Status**: ✅ Working
- **Features**: Successfully crawled and checked internal links

## Usage

### Run Full Audit Suite
```bash
cd /home/jack/Documents/aclue-preprod/tests-22-sept/automated/frontend
./run-frontend-audit.sh
```

### Run Individual Tools
```bash
# Pa11y accessibility scan
./run-single-tool.sh pa11y https://aclue.app

# axe-core accessibility scan
./run-single-tool.sh axe https://aclue.app

# Lighthouse performance & accessibility audit
./run-single-tool.sh lighthouse https://aclue.app

# Lighthouse desktop audit
./run-single-tool.sh lighthouse-desktop https://aclue.app

# Broken link checker
./run-single-tool.sh blc https://aclue.app

# webhint web standards scan
./run-single-tool.sh webhint https://aclue.app
```

### Manual Tool Execution

```bash
# Pa11y with custom config
pa11y https://aclue.app --config .pa11yrc.json --reporter json

# axe-core with ChromeDriver
axe https://aclue.app --chromedriver-path=/home/jack/.browser-driver-manager/chromedriver/linux-140.0.7339.185/chromedriver-linux64/chromedriver

# Lighthouse with config
lighthouse https://aclue.app --config-path=lighthouse-simple.js --output=json

# Broken link checker
blc https://aclue.app --recursive --ordered

# webhint (simplified)
hint https://aclue.app --formatters json
```

## Report Output

All scans generate timestamped reports in the `reports/` directory:

```
reports/
└── YYYYMMDD_HHMMSS/
    ├── pa11y_production_home.json
    ├── pa11y_production_landingpage.json
    ├── pa11y_production_discover.json
    ├── axe_production_home.json
    ├── lighthouse_mobile_production_home.json
    ├── lighthouse_desktop_production_home.json
    ├── broken_links_production.json
    ├── webhint_production_home.json
    └── summary_report.json
```

## Configuration Files

- `.pa11yrc.json` - Pa11y WCAG configuration
- `.pa11yci.json` - Pa11y CI sitemap configuration
- `axe-config.json` - axe-core rules and options
- `lighthouse-simple.js` - Lighthouse mobile configuration
- `lighthouse-desktop-config.js` - Lighthouse desktop configuration
- `blc-config.json` - Broken link checker settings
- `.hintrc` - webhint comprehensive configuration
- `.hintrc-simple` - webhint simplified configuration

## Target URLs

### Production Environment
- **Base URL**: https://aclue.app
- **Pages Tested**:
  - `/` (Maintenance page)
  - `/landingpage` (Full application)
  - `/discover` (Product discovery)

### Local Development (when available)
- **Base URL**: http://localhost:3000
- **Same page structure as production**

## Dependencies

### Required Global Packages
```bash
npm install -g pa11y pa11y-ci
npm install -g @axe-core/cli
npm install -g lighthouse
npm install -g broken-link-checker
npm install -g hint
```

### ChromeDriver Requirement
```bash
npx browser-driver-manager install chrome
```

## Key Accessibility Issues Found

### Immediate Action Required
1. **Color Contrast**: 17 violations across the site
   - Improve contrast ratios for all text elements
   - Review gradient text implementations
   - Test with color contrast analyzers

2. **Landmark Structure**: 3 violations
   - Fix duplicate main landmarks
   - Ensure proper landmark hierarchy
   - Add unique identifiers for landmarks

### Recommendations
1. Implement automated accessibility testing in CI/CD pipeline
2. Regular manual accessibility audits
3. User testing with assistive technologies
4. Progressive enhancement approach for better accessibility

## Deployment Summary

✅ **Successfully Deployed**: 5/6 tools working
- Pa11y: Full WCAG 2.1 AA scanning
- axe-core: Industry standard accessibility testing
- Lighthouse: Performance and accessibility auditing
- broken-link-checker: Link validation
- webhint: Web standards checking (simplified)

❌ **Issue**: Unlighthouse module resolution error
⚠️ **Partial**: webhint requires simplified configuration

## Next Steps

1. Fix Unlighthouse Node.js compatibility issue
2. Expand webhint configuration safely
3. Integrate tools into CI/CD pipeline
4. Set up automated scheduling for regular scans
5. Create dashboard for report visualization
6. Address identified accessibility issues

## Technical Notes

- All tools configured with `--no-sandbox` for Linux environment compatibility
- ChromeDriver version 140.0.7339.185 installed for axe-core compatibility
- Timeout settings optimized for production environment scanning
- JSON output format standardized across all tools for report aggregation

---

**Last Updated**: September 23, 2025
**Status**: PRODUCTION READY ✅