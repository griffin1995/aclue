# aclue Platform - Automated Performance Monitoring Suite

## Overview
Comprehensive automated performance monitoring system for the aclue platform, featuring multiple industry-standard tools for exhaustive performance analysis.

## Installed Tools

### 1. **Lighthouse CI** (`@lhci/cli`)
- Automated Core Web Vitals monitoring
- Performance regression detection
- Budget enforcement
- CI/CD integration ready

### 2. **Web Vitals** (`web-vitals`)
- Real user monitoring (RUM)
- Next.js integration
- Live performance metrics collection
- API endpoint for data aggregation

### 3. **Unlighthouse**
- Parallel site-wide auditing
- Automated crawling
- Performance scoring across all pages
- Visual reports with trends

### 4. **Sitespeed.io**
- Comprehensive performance metrics
- Sustainability analysis
- Carbon footprint tracking
- Coach recommendations

### 5. **WebPageTest**
- Real-world browser testing
- Network throttling simulation
- Filmstrip and waterfall analysis
- Multiple location testing

## Quick Start

### Run All Performance Tests
```bash
./run-all-performance-tests.sh
```

### Run Individual Tools
```bash
./run-lighthouse-ci.sh        # Lighthouse CI testing
./run-unlighthouse.sh         # Site-wide audit
./run-sitespeed.sh           # Comprehensive analysis
./run-webpagetest.sh         # Real-world testing
./continuous-monitoring.sh    # Quick hourly checks
```

### Setup Automation
```bash
./setup-cron.sh              # View cron job setup instructions
```

## Monitored URLs

### Production
- https://aclue.app/
- https://aclue.app/landingpage
- https://aclue.app/discover

### Development
- http://localhost:3000/
- http://localhost:3000/landingpage
- http://localhost:3000/discover

## Performance Metrics Tracked

### Core Web Vitals
- **LCP** (Largest Contentful Paint) - Target: < 2.5s
- **INP** (Interaction to Next Paint) - Target: < 200ms
- **CLS** (Cumulative Layout Shift) - Target: < 0.1

### Additional Metrics
- First Contentful Paint (FCP) - Target: < 1.8s
- Time to Interactive (TTI) - Target: < 3.8s
- Total Blocking Time (TBT) - Target: < 300ms
- Speed Index - Target: < 3.4s
- Time to First Byte (TTFB) - Target: < 800ms

## Performance Budgets

```json
{
  "performance_score": 85,
  "accessibility_score": 95,
  "best_practices_score": 90,
  "seo_score": 90,
  "lcp": 2500,
  "fcp": 1800,
  "cls": 0.1,
  "tbt": 300,
  "total_size": 2097152
}
```

## Directory Structure

```
tests-22-sept/automated/performance/
├── lighthouse-ci/           # Lighthouse CI reports
├── unlighthouse/            # Unlighthouse scan results
├── sitespeed/              # Sitespeed.io analysis
├── webpagetest/            # WebPageTest results
├── web-vitals-logs/        # Real user metrics
├── continuous-results/     # Hourly monitoring data
├── *.sh                    # Automation scripts
└── *.json                  # Configuration files
```

## Web Vitals Integration

The platform includes real-time Web Vitals monitoring:

1. **Component**: `/web/app/components/WebVitalsReporter.tsx`
2. **API Endpoint**: `/web/app/api/analytics/vitals/route.ts`
3. **Data Collection**: Automatic on all pages
4. **Storage**: Local logs and API aggregation

### View Live Metrics
```
GET http://localhost:3000/api/analytics/vitals
```

## Automation Options

### Cron Jobs
```bash
# Hourly monitoring
0 * * * * /path/to/continuous-monitoring.sh

# Daily comprehensive audit
0 2 * * * /path/to/run-all-performance-tests.sh

# Weekly regression check
0 3 * * 0 /path/to/run-lighthouse-ci.sh
```

### CI/CD Integration
- GitHub Actions workflow ready
- Vercel deployment checks
- Railway deployment validation

## Report Locations

All reports are saved with timestamps:

- **Lighthouse CI**: HTML and JSON reports with trends
- **Unlighthouse**: Interactive HTML dashboard
- **Sitespeed.io**: Detailed HTML reports with HAR files
- **WebPageTest**: JSON data with filmstrips
- **Continuous**: Daily aggregated metrics

## Troubleshooting

### Common Issues

1. **Localhost not available**
   - Start development server: `cd web && npm run dev`

2. **WebPageTest API key missing**
   - Tool will fallback to local testing
   - Register at webpagetest.org for API key

3. **Permission denied running scripts**
   - Run: `chmod +x *.sh`

4. **Missing dependencies**
   - Run: `npm install` in web directory

## Performance Insights

The monitoring suite provides:

- **Regression Detection**: Automatic alerts for performance drops
- **Trend Analysis**: Historical performance tracking
- **Budget Validation**: Ensures metrics stay within limits
- **Competitive Analysis**: Compare against industry standards
- **User Impact**: Real user experience metrics
- **Carbon Footprint**: Environmental impact tracking

## Next Steps

1. Review initial baseline metrics
2. Set up automated monitoring schedule
3. Configure alerting thresholds
4. Integrate with CI/CD pipeline
5. Create performance dashboards
6. Regular performance reviews

## Support

For issues or questions about the performance monitoring suite:
- Check individual tool documentation
- Review script logs in respective directories
- Examine API endpoint responses
- Validate configuration files