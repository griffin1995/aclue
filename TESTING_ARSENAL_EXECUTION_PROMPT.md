# Advanced Testing Arsenal Execution Prompt

You are an enterprise testing orchestration specialist tasked with executing a comprehensive testing arsenal of 150+ tools for the Aclue platform. You will coordinate the systematic execution of all testing tools, handle configuration errors through iterative optimization, and generate comprehensive reports without modifying the production codebase.

## PROJECT CONTEXT

### Platform Overview
- **Application**: Aclue - AI-powered gifting platform
- **Architecture**: Next.js 14 (Vercel) + FastAPI (Railway) + Supabase PostgreSQL
- **Production URL**: https://aclue.app
- **Backend API**: https://aclue-backend-production.up.railway.app
- **Status**: Production operational, all systems running
- **Test User**: john.doe@example.com / password123

### Environment Details
- **Working Directory**: /home/jack/Documents/aclue-preprod/
- **Branch**: main (auto-deploy enabled)
- **Testing Infrastructure**: Fully deployed with 150+ tools
- **Platform**: Linux 6.14.0-29-generic, Node.js v20.18.2, Python 3.12

### Testing Infrastructure Layout
```
/home/jack/Documents/aclue-preprod/
├── tests-22-sept/
│   ├── automated/           # 100+ automated testing tools
│   │   ├── security/        # Nuclei, OWASP ZAP, Semgrep, Trivy
│   │   ├── frontend/        # Pa11y, axe-core, Lighthouse, broken-link-checker
│   │   ├── api/            # Schemathesis, Dredd, Newman, APIFuzzer
│   │   ├── performance/    # Lighthouse CI, web-vitals, sitespeed.io
│   │   ├── code-quality/   # Ruff, ESLint, Pylint, Black, mypy
│   │   ├── database/       # PGDSAT, pip-audit, Snyk, Safety
│   │   ├── infrastructure/ # Checkov, TruffleHog, Docker Scout
│   │   └── comprehensive-reports/ # Unified reporting system
│   └── manual/             # 50+ manual testing tools (Playwright, Cypress, etc.)
```

## PRIMARY OBJECTIVES

### Mission Statement
Execute ALL 150+ testing tools systematically with iterative optimization, ensuring:
1. **Complete Tool Execution**: 80%+ success rate across all categories
2. **Zero Codebase Modification**: Fix test configurations only, never application code
3. **Comprehensive Reporting**: Individual + unified reports for all categories
4. **Production Safety**: No impact on live Aclue platform
5. **Error Documentation**: Complete logs of issues and resolutions

### Success Criteria
- [ ] **120+ tools executed successfully** (80% minimum threshold)
- [ ] **10 category reports generated** (JSON + HTML formats)
- [ ] **Executive dashboard created** with health scores
- [ ] **Error log documented** with resolution attempts
- [ ] **Performance metrics captured** for all test executions
- [ ] **Security findings prioritized** by severity
- [ ] **Accessibility compliance measured** against WCAG 2.1 AA

## EXECUTION STRATEGY

### Phase 1: Environment Validation (15 minutes)
**Objective**: Verify all tools are installed and configured correctly

```bash
# Navigate to project root
cd /home/jack/Documents/aclue-preprod/

# Verify testing infrastructure
ls -la tests-22-sept/automated/
ls -la tests-22-sept/manual/

# Check key executable scripts
find tests-22-sept/ -name "*.sh" -type f -exec chmod +x {} \;

# Validate tool installations
tests-22-sept/automated/health-check.sh
```

**Success Indicators**:
- All directory structures present
- Executable permissions set
- Key tools responding to version checks
- No critical dependencies missing

### Phase 2: Automated Testing Execution (60-90 minutes)
**Objective**: Execute all 100+ automated testing tools with error handling

#### 2.1 Security Scanning (15-20 minutes)
```bash
cd tests-22-sept/automated/security/
./run-security-scan.sh full
```
**Tools**: Nuclei (9,000+ templates), OWASP ZAP, Semgrep, Trivy, CodeQL
**Expected Output**: security/reports/ with JSON and HTML reports

#### 2.2 Frontend Accessibility (10-15 minutes)
```bash
cd tests-22-sept/automated/frontend/
./run-frontend-audit.sh
```
**Tools**: Pa11y (WCAG 2.1), axe-core, Lighthouse, broken-link-checker
**Expected Output**: frontend/reports/ with accessibility compliance scores

#### 2.3 API Testing (20-30 minutes)
```bash
cd tests-22-sept/automated/api/
./run_api_tests.sh
```
**Tools**: Schemathesis (500+ test cases), Dredd, Newman, APIFuzzer, Tavern
**Expected Output**: api/reports/ with contract validation results

#### 2.4 Performance Monitoring (15-25 minutes)
```bash
cd tests-22-sept/automated/performance/
./run-all-performance-tests.sh
```
**Tools**: Lighthouse CI, web-vitals, Unlighthouse, sitespeed.io, WebPageTest
**Expected Output**: performance/reports/ with Core Web Vitals metrics

#### 2.5 Code Quality Analysis (10-15 minutes)
```bash
cd tests-22-sept/automated/code-quality/
./master_quality_scan.sh
```
**Tools**: Ruff (800+ rules), ESLint, Pylint, Black, mypy, Bandit
**Expected Output**: code-quality/reports/ with detailed code analysis

#### 2.6 Database Security (10-15 minutes)
```bash
cd tests-22-sept/automated/database/
./master-security-scan.sh
```
**Tools**: PGDSAT (70+ CIS checks), pip-audit, Snyk, Safety, SQLFluff
**Expected Output**: database/reports/ with PostgreSQL security assessment

#### 2.7 Infrastructure Validation (15-20 minutes)
```bash
cd tests-22-sept/automated/infrastructure/
./validate-infrastructure.sh
```
**Tools**: Checkov, TruffleHog, Docker Scout, Gitleaks, Terrascan
**Expected Output**: infrastructure/reports/ with IaC security analysis

### Phase 3: Manual Testing Execution (45-60 minutes)
**Objective**: Execute comprehensive test suites with generated test cases

#### 3.1 End-to-End Testing
```bash
cd tests-22-sept/manual/
./run-e2e-tests.sh
```
**Tools**: Playwright (cross-browser), Cypress (visual debugging), WebdriverIO, TestCafe
**Coverage**: Authentication, product discovery, newsletter signup

#### 3.2 Unit/Integration Testing
```bash
# Frontend tests
cd web/
npm run test
npm run test:e2e

# Backend tests
cd backend/
pytest tests/ --cov=app --cov-report=html
```
**Tools**: Vitest, Jest, React Testing Library, pytest ecosystem
**Coverage**: Component rendering, API endpoints, database operations

#### 3.3 Load Testing
```bash
cd tests-22-sept/manual/performance/
./run-load-tests.sh
```
**Tools**: k6, Artillery, Locust
**Scenarios**: API stress testing, concurrent user simulation

### Phase 4: Report Generation and Analysis (15-30 minutes)
**Objective**: Generate unified reporting dashboard

```bash
cd tests-22-sept/automated/
./generate-comprehensive-reports.sh
```

**Deliverables**:
- **Executive HTML Dashboard**: Overall health score and metrics
- **Unified JSON Report**: Machine-readable aggregated results
- **Category Summaries**: Individual reports for each testing area
- **Trend Analysis**: Performance and security metrics over time

## AGENT COORDINATION STRATEGY

### Multi-Agent Orchestration
Deploy 6 specialist agents simultaneously for parallel execution:

1. **security-auditor**: Security scanning tools (Nuclei, ZAP, Semgrep)
2. **performance-engineer**: Performance testing (Lighthouse, k6, Artillery)
3. **frontend-developer**: Frontend accessibility and E2E testing
4. **api-documenter**: API testing and contract validation
5. **database-admin**: Database security and dependency scanning
6. **test-automator**: Unit/integration test coordination and reporting

### Coordination Protocol
```bash
# Master orchestration script
tests-22-sept/automated/run-all-automated-tests.sh parallel

# Real-time monitoring
tests-22-sept/automated/monitoring-dashboard.sh
```

## ERROR HANDLING AND OPTIMIZATION

### Iterative Optimization Protocol
**Rule**: Never modify Aclue application code - only test configurations

#### Error Categories and Responses:

1. **Tool Installation Issues**
   - Retry with alternative installation methods
   - Use Docker containers for problematic tools
   - Document tool-specific environment requirements

2. **Configuration Errors**
   - Adjust tool-specific configuration files
   - Modify timeout settings for slow environments
   - Update API endpoints or credentials

3. **Network/Connectivity Issues**
   - Implement retry logic with exponential backoff
   - Use local testing alternatives where possible
   - Document external service dependencies

4. **Resource Constraints**
   - Reduce parallel execution threads
   - Implement memory-conscious execution modes
   - Split large test suites into smaller chunks

#### Retry Strategy
```bash
# Example retry implementation
for attempt in {1..3}; do
    if ./test-script.sh; then
        echo "Success on attempt $attempt"
        break
    else
        echo "Attempt $attempt failed, retrying..."
        sleep $((attempt * 10))
    fi
done
```

### Checkpoint System
Create restoration points at each major phase:
```bash
# Save checkpoint
cp -r tests-22-sept/automated/reports/ tests-22-sept/checkpoints/phase-$PHASE_NUMBER/

# Restore from checkpoint
cp -r tests-22-sept/checkpoints/phase-$PHASE_NUMBER/ tests-22-sept/automated/reports/
```

## MONITORING AND PROGRESS TRACKING

### Real-Time Dashboard
```javascript
// tests-22-sept/automated/monitoring-dashboard.js
setInterval(() => {
    const progress = calculateProgress();
    const errors = getErrorCount();
    const performance = getPerformanceMetrics();
    updateDashboard(progress, errors, performance);
}, 5000);
```

### Progress Indicators
- **Tools Executed**: Running count vs. total (150+)
- **Success Rate**: Percentage of successful executions
- **Error Rate**: Failed tools with categorized failure reasons
- **Performance**: Average execution time per category
- **Reports Generated**: Count of completed reports by format

### Alerting Thresholds
- **Critical**: Tool failure rate > 20%
- **Warning**: Individual tool timeout > 10 minutes
- **Info**: Report generation completion

## REPORTING SPECIFICATIONS

### Executive Dashboard Requirements
```html
<!-- Executive Summary Template -->
<div class="health-score">
    <h1>Overall Health Score: {CALCULATED_SCORE}%</h1>
    <div class="metrics">
        <span>Critical Issues: {CRITICAL_COUNT}</span>
        <span>High Priority: {HIGH_COUNT}</span>
        <span>Tools Executed: {SUCCESS_COUNT}/{TOTAL_COUNT}</span>
    </div>
</div>
```

### Report Format Standards
- **JSON**: Machine-readable with standardized schema
- **HTML**: Interactive dashboards with drill-down capabilities
- **Markdown**: Human-readable summaries with recommendations
- **CSV**: Exportable data for external analysis

### Data Aggregation Rules
```json
{
  "health_score": "100 - (critical_issues * 10 + high_issues * 5 + medium_issues * 2 + low_issues * 0.5)",
  "severity_mapping": {
    "critical": ["authentication bypass", "remote code execution", "sql injection"],
    "high": ["xss", "csrf", "privilege escalation"],
    "medium": ["information disclosure", "denial of service"],
    "low": ["configuration warnings", "code style issues"]
  }
}
```

## DELIVERABLES AND VALIDATION

### Expected Outputs
1. **Individual Category Reports** (10 directories)
   - security/reports/
   - frontend/reports/
   - api/reports/
   - performance/reports/
   - code-quality/reports/
   - database/reports/
   - infrastructure/reports/
   - e2e/reports/
   - unit/reports/
   - load/reports/

2. **Unified Reporting**
   - comprehensive-reports/executive-summary-{timestamp}.html
   - comprehensive-reports/unified-results-{timestamp}.json
   - comprehensive-reports/TESTING_SUMMARY_{timestamp}.md

3. **Execution Documentation**
   - EXECUTION_LOG_{timestamp}.md
   - BLOCKED_TOOLS_LIST.md
   - OPTIMIZATION_ITERATIONS.md

### Validation Checklist
- [ ] All executable scripts have proper permissions (chmod +x)
- [ ] Report directories contain JSON and HTML outputs
- [ ] Executive dashboard loads without errors
- [ ] Unified JSON validates against schema
- [ ] Critical security findings are prioritized
- [ ] Performance metrics include Core Web Vitals
- [ ] Error logs contain actionable troubleshooting information

## CONTINGENCY PLANNING

### Session Interruption Recovery
```bash
# Save current state
./tests-22-sept/automated/save-session-state.sh

# Restore and continue
./tests-22-sept/automated/restore-session-state.sh
./tests-22-sept/automated/continue-from-checkpoint.sh
```

### Blocking Issue Escalation
1. **Tool-Level Failure**: Skip tool, document issue, continue with category
2. **Category-Level Failure**: Generate partial report, escalate to manual review
3. **System-Level Failure**: Create checkpoint, request intervention

### Quality Gates
- **Minimum Success Threshold**: 80% tool execution success rate
- **Security Gate**: No critical vulnerabilities in production code
- **Performance Gate**: Core Web Vitals within acceptable ranges
- **Accessibility Gate**: WCAG 2.1 AA compliance score > 90%

## EXECUTION COMMANDS

### Quick Start (Full Execution)
```bash
cd /home/jack/Documents/aclue-preprod/
chmod +x tests-22-sept/automated/run-all-automated-tests.sh
./tests-22-sept/automated/run-all-automated-tests.sh full
```

### Individual Category Execution
```bash
# Security only
./tests-22-sept/automated/security/run-security-scan.sh

# Performance only
./tests-22-sept/automated/performance/run-all-performance-tests.sh

# Generate reports only
./tests-22-sept/automated/generate-comprehensive-reports.sh
```

### Monitoring and Status
```bash
# Real-time monitoring
./tests-22-sept/automated/monitoring-dashboard.sh

# Check execution status
./tests-22-sept/automated/check-status.sh

# View latest reports
open tests-22-sept/automated/comprehensive-reports/index.html
```

---

## FINAL INSTRUCTIONS

Execute this prompt by deploying the context-manager agent to coordinate all specialist agents. Begin with Phase 1 environment validation, proceed through automated testing execution with iterative optimization, complete manual testing suites, and conclude with comprehensive report generation. Maintain detailed logs of all execution attempts, optimization iterations, and final results. The target is successful execution of 120+ tools (80% success rate) with comprehensive reporting across all categories.

**Start Command**: Use the context-manager agent with this complete prompt to begin systematic execution of the 150+ tool testing arsenal for the Aclue platform.
