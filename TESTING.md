# Aclue Testing Guide

This comprehensive guide covers all aspects of testing in the Aclue platform, from local development testing to CI/CD automation and quality assurance processes.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Architecture](#test-architecture)
- [Quick Start](#quick-start)
- [Test Types](#test-types)
- [Local Development Testing](#local-development-testing)
- [CI/CD Testing](#cicd-testing)
- [Test Data Management](#test-data-management)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Quality Gates](#quality-gates)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🎯 Overview

The Aclue testing strategy follows a comprehensive pyramid approach ensuring quality, security, and performance at every level:

```
        E2E Tests (Few)
    ═══════════════════════
     Integration Tests
   ═════════════════════════
    Component/API Tests
  ══════════════════════════
        Unit Tests (Many)
  ══════════════════════════
```

### Testing Principles

1. **Fast Feedback** - Quick test execution for rapid development
2. **Comprehensive Coverage** - Testing all critical paths and edge cases
3. **Reliable Automation** - Consistent test results across environments
4. **Security First** - Security testing integrated throughout
5. **Performance Awareness** - Performance validation at every level

## 🏗️ Test Architecture

### Backend Testing Stack

- **Testing Framework**: pytest with comprehensive plugins
- **Fixtures**: Comprehensive test data factories
- **Mocking**: unittest.mock and pytest-mock
- **Coverage**: pytest-cov with enforced thresholds
- **Database**: PostgreSQL test instances with isolation
- **Performance**: pytest-benchmark and locust
- **Security**: bandit, safety, and custom security tests

### Frontend Testing Stack

- **Unit Testing**: Jest with React Testing Library
- **Component Testing**: React Testing Library with comprehensive scenarios
- **E2E Testing**: Playwright with cross-browser support
- **Mocking**: MSW (Mock Service Worker)
- **Coverage**: Jest coverage with lcov reporting
- **Performance**: Lighthouse CI integration
- **Accessibility**: jest-axe and manual testing

### Test Environment Management

- **Development**: Local testing with hot reload
- **CI/CD**: GitHub Actions with matrix testing
- **Staging**: Pre-production validation
- **Production**: Smoke testing and monitoring

## 🚀 Quick Start

### Prerequisites

- Python 3.11+ with pip
- Node.js 18.20.8+ with npm
- Docker (recommended for database testing)
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd gift_sync

# Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install frontend dependencies
cd ../web
npm install

# Install Playwright browsers for E2E testing
npx playwright install
```

### 2. Environment Configuration

```bash
# Backend test environment
cd backend
cp .env.test.example .env.test
# Edit .env.test with your test configuration

# Frontend test environment
cd ../web
cp .env.test.example .env.test
# Edit .env.test with your test configuration
```

### 3. Run Quick Tests

```bash
# Run all tests with our comprehensive script
./scripts/run-tests.sh

# Or run specific test suites
./scripts/run-tests.sh unit --coverage
./scripts/run-tests.sh e2e --backend-only
./scripts/run-tests.sh security --verbose
```

### 4. View Results

Test reports and coverage information will be available in:
- `test-logs/` - Combined test reports
- `backend/htmlcov/` - Backend coverage reports
- `web/coverage/` - Frontend coverage reports
- `web/playwright-report/` - E2E test reports

## 🧪 Test Types

### Unit Tests

**Purpose**: Test individual functions and components in isolation

**Backend Unit Tests**:
```bash
# Run backend unit tests
cd backend
pytest tests/ -m "not integration and not e2e and not performance and not security" -v

# With coverage
pytest tests/ -m "not integration and not e2e and not performance and not security" \
  --cov=app --cov-report=html --cov-report=term
```

**Frontend Unit Tests**:
```bash
# Run frontend unit tests
cd web
npm run test:unit

# With coverage
npm run test:unit -- --coverage

# Watch mode for development
npm run test:unit -- --watch
```

**Coverage Targets**:
- Backend: 85% minimum coverage
- Frontend: 80% minimum coverage
- Critical paths: 95%+ coverage

### Integration Tests

**Purpose**: Test interactions between components and external services

**Database Integration Tests**:
```bash
# Run database integration tests
cd backend
pytest tests/test_database_integration.py -v

# Test specific database operations
pytest tests/test_database_integration.py::TestUserOperations -v
```

**API Integration Tests**:
```bash
# Run API integration tests
cd backend
pytest tests/test_api_endpoints.py -v

# Test authentication workflows
pytest tests/test_api_endpoints.py::TestAuthenticationEndpoints -v
```

**Component Integration Tests**:
```bash
# Run component integration tests
cd web
npm run test:integration

# Test specific component interactions
npm test -- --testPathPattern=integration --testNamePattern="AuthGuard"
```

### End-to-End Tests

**Purpose**: Test complete user workflows across the entire application

**Cross-Browser E2E Tests**:
```bash
# Run all E2E tests
cd web
npx playwright test

# Run specific browser
npx playwright test --project=chromium

# Run mobile tests
npx playwright test --project="Mobile Chrome"

# Debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

**E2E Test Scenarios**:
- Complete user registration and onboarding
- Product discovery and swiping workflows
- Recommendation generation and interaction
- User profile and preference management
- Affiliate tracking and purchase flows

### Performance Tests

**Purpose**: Validate system performance and identify bottlenecks

**Database Performance**:
```bash
# Run database performance tests
cd backend
pytest tests/test_performance.py -m "database" --benchmark-json=benchmark-results.json
```

**API Performance**:
```bash
# Run API performance tests
cd backend
pytest tests/test_performance.py -m "api" -v

# Load testing with Locust
locust --headless --users 50 --spawn-rate 5 --run-time 60s --host http://localhost:8000
```

**Frontend Performance**:
```bash
# Run frontend performance tests
cd web
npm run test:performance

# Lighthouse CI
npm run lighthouse:ci
```

**Performance Thresholds**:
- Database queries: <200ms average
- API endpoints: <500ms P95
- Page load times: <3s initial, <1s subsequent
- Core Web Vitals: All metrics in green

### Security Tests

**Purpose**: Validate security controls and identify vulnerabilities

**Authentication Security**:
```bash
# Run authentication security tests
cd backend
pytest tests/test_security.py::TestAuthenticationSecurity -v
```

**Input Validation**:
```bash
# Run input validation tests
cd backend
pytest tests/test_security.py::TestInputValidationSecurity -v
```

**Security Scanning**:
```bash
# Run security analysis
cd backend
bandit -r app/ -f json -o security-report.json
safety check --json --output vulnerability-report.json

# Frontend security audit
cd ../web
npm audit --audit-level moderate
```

**Security Test Coverage**:
- SQL injection prevention
- XSS protection
- Authentication and authorisation
- Row Level Security (RLS) policies
- Input sanitisation
- Rate limiting
- CORS configuration
- Security headers

## 💻 Local Development Testing

### Development Workflow

1. **Write Tests First** (TDD approach)
2. **Run Relevant Tests** during development
3. **Use Watch Mode** for continuous feedback
4. **Check Coverage** regularly
5. **Run Full Suite** before commits

### Test-Driven Development (TDD)

```bash
# 1. Write failing test
cd backend
pytest tests/test_new_feature.py::test_new_functionality -v
# Test should fail

# 2. Implement minimum code to pass
# Edit your implementation

# 3. Run test again
pytest tests/test_new_feature.py::test_new_functionality -v
# Test should pass

# 4. Refactor and ensure tests still pass
pytest tests/test_new_feature.py -v
```

### Watch Mode Testing

```bash
# Backend watch mode (requires pytest-watch)
cd backend
ptw -- tests/

# Frontend watch mode
cd web
npm run test:watch

# E2E tests with UI mode
cd web
npx playwright test --ui
```

### Debugging Tests

**Backend Debugging**:
```bash
# Debug with pdb
cd backend
pytest tests/test_specific.py::test_function -s --pdb

# Verbose output
pytest tests/ -v -s

# Debug specific test
pytest tests/test_auth.py::TestLogin::test_valid_credentials -vvv -s
```

**Frontend Debugging**:
```bash
# Debug React components
cd web
npm test -- --runInBand --no-cache test_file.test.tsx

# Debug with browser dev tools
npm test -- --runInBand --no-cache --watchAll=false
```

**E2E Debugging**:
```bash
# Debug with Playwright Inspector
cd web
npx playwright test --debug

# Headed mode (show browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slowMo=1000
```

## 🔄 CI/CD Testing

### GitHub Actions Pipeline

The automated testing pipeline (`/.github/workflows/test-automation.yml`) includes:

1. **Setup and Validation**
2. **Parallel Test Execution**
3. **Cross-Platform Testing**
4. **Performance Validation**
5. **Security Scanning**
6. **Quality Gates**
7. **Reporting and Artifacts**

### Pipeline Triggers

- **Pull Requests**: Full test suite on PR creation/updates
- **Main Branch Pushes**: Complete validation pipeline
- **Manual Triggers**: Selective test execution
- **Scheduled Runs**: Nightly comprehensive testing

### Test Matrix

The pipeline tests across multiple dimensions:

```yaml
Backend Tests:
  - Python versions: [3.11, 3.12]
  - Test types: [unit, integration, database]
  - Databases: [PostgreSQL 15, Redis 7]

Frontend Tests:
  - Node versions: [18.20.8, 20.x]
  - Test types: [unit, integration, component]

E2E Tests:
  - Browsers: [Chromium, Firefox, WebKit]
  - Devices: [Desktop, Mobile, Tablet]
  - Environments: [Development, Staging]
```

### Quality Gates

All tests must pass these quality gates:

1. **Critical Tests**: 100% pass rate
2. **Coverage Thresholds**: Meet minimum coverage requirements
3. **Security Scans**: No high-severity vulnerabilities
4. **Performance**: Meet defined performance thresholds
5. **Code Quality**: Pass linting and type checking

### Viewing CI/CD Results

- **GitHub Actions Tab**: Real-time pipeline status
- **PR Comments**: Automated test result summaries
- **Artifacts**: Downloadable test reports and coverage
- **Status Checks**: Branch protection integration

## 📊 Test Data Management

### Test Data Strategy

1. **Factories**: Generate consistent test data
2. **Fixtures**: Reusable test setups
3. **Mocking**: Isolate external dependencies
4. **Seeding**: Populate test databases
5. **Cleanup**: Ensure test isolation

### Using Test Factories

**Backend Factories** (`tests/conftest.py`):
```python
from tests.conftest import UserFactory, ProductFactory, SwipeInteractionFactory

def test_user_swipe_interaction():
    # Create test user
    user = UserFactory()
    
    # Create test product
    product = ProductFactory(category="electronics")
    
    # Create swipe interaction
    swipe = SwipeInteractionFactory(
        user_id=user.id,
        product_id=product.id,
        direction="right"
    )
    
    assert swipe.preference_strength > 0.5
```

**Frontend Test Data**:
```typescript
// web/src/test-utils/factories.ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@aclue.app',
  firstName: 'Test',
  lastName: 'User',
  subscriptionTier: 'free',
  ...overrides,
});

export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 'product-123',
  title: 'Test Product',
  description: 'Test product description',
  price: 99.99,
  category: 'electronics',
  ...overrides,
});
```

### Database Test Isolation

**Transaction Rollback** (Backend):
```python
@pytest.fixture
async def db_transaction():
    """Provide database transaction that rolls back after test."""
    async with database.transaction():
        yield database
        # Transaction automatically rolls back
```

**Test Database Reset**:
```bash
# Reset test database
cd backend
python -c "
from app.database import Base, engine
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
"
```

## ⚡ Performance Testing

### Performance Test Categories

1. **Unit Performance**: Individual function benchmarks
2. **API Performance**: Endpoint response times
3. **Database Performance**: Query optimization
4. **Load Testing**: Concurrent user simulation
5. **Frontend Performance**: Page load and interaction times

### Running Performance Tests

**Database Performance**:
```bash
cd backend
pytest tests/test_performance.py::TestDatabasePerformance -v \
  --benchmark-json=db-benchmark.json

# View benchmark results
python -m pytest_benchmark compare db-benchmark.json --sort=mean
```

**API Load Testing**:
```bash
# Using Locust for load testing
cd backend
locust --headless --users 100 --spawn-rate 10 --run-time 120s \
  --host http://localhost:8000 --html load-test-report.html

# View real-time metrics
locust --host http://localhost:8000  # Open web UI at http://localhost:8089
```

**Frontend Performance**:
```bash
# Lighthouse CI
cd web
npm run lighthouse:ci

# Bundle analysis
npm run analyze

# Performance profiling
npm run test:performance
```

### Performance Thresholds

| Metric | Target | Critical |
|--------|--------|----------|
| Database Queries (Simple) | <50ms | <100ms |
| Database Queries (Complex) | <200ms | <500ms |
| API Response Time (P95) | <300ms | <1000ms |
| Page Load Time (FCP) | <1.5s | <3s |
| Page Load Time (LCP) | <2.5s | <4s |
| Core Web Vitals | All Green | No Red |

### Performance Monitoring

1. **CI/CD Integration**: Automated performance regression testing
2. **Benchmarking**: Historical performance tracking
3. **Profiling**: Detailed performance analysis
4. **Monitoring**: Production performance tracking

## 🔒 Security Testing

### Security Test Categories

1. **Authentication Security**: Login, tokens, sessions
2. **Authorisation**: Access control, permissions
3. **Input Validation**: Injection prevention
4. **Data Protection**: Privacy, encryption
5. **Infrastructure Security**: Headers, CORS, rate limiting

### Running Security Tests

**Comprehensive Security Suite**:
```bash
# Run all security tests
cd backend
pytest tests/test_security.py -v

# Run specific security categories
pytest tests/test_security.py::TestAuthenticationSecurity -v
pytest tests/test_security.py::TestInputValidationSecurity -v
pytest tests/test_security.py::TestRowLevelSecurity -v
```

**Security Scanning Tools**:
```bash
# Backend security analysis
cd backend
bandit -r app/ -ll  # High and medium severity only
safety check        # Known vulnerability scan

# Frontend security audit
cd web
npm audit --audit-level moderate
npm run security:scan  # Custom security checks
```

**Security Test Scenarios**:

1. **SQL Injection Prevention**:
   - Test malicious SQL payloads
   - Verify parameterised queries
   - Validate input sanitisation

2. **Cross-Site Scripting (XSS)**:
   - Test script injection attempts
   - Verify output encoding
   - Check CSP headers

3. **Authentication Attacks**:
   - Brute force protection
   - Token manipulation
   - Session hijacking

4. **Authorisation Bypass**:
   - Privilege escalation
   - Resource access control
   - Row Level Security policies

### Security Compliance

**GDPR Compliance Tests**:
```bash
# Data privacy and consent tests
cd backend
pytest tests/test_security.py::TestDataPrivacyCompliance -v

# User data export/deletion
pytest tests/test_security.py::TestDataPrivacyCompliance::test_data_export_functionality -v
```

**Security Headers Validation**:
```bash
# Check security headers
cd web
npm run test:security-headers

# Validate CSP configuration
npm run test:csp-compliance
```

## 🎯 Quality Gates

### Pre-Commit Quality Gates

1. **Linting**: Code style and quality
2. **Type Checking**: Static type validation
3. **Unit Tests**: Fast feedback on changes
4. **Security Scan**: Basic vulnerability check

### Pre-Merge Quality Gates

1. **Full Test Suite**: All test types pass
2. **Coverage Thresholds**: Minimum coverage maintained
3. **Performance**: No performance regressions
4. **Security**: Comprehensive security validation
5. **Code Review**: Human review completed

### Deployment Quality Gates

1. **Integration Tests**: Full system validation
2. **E2E Tests**: User workflow validation
3. **Performance Tests**: Production-ready performance
4. **Security Audit**: Final security validation
5. **Smoke Tests**: Basic functionality verification

### Coverage Requirements

| Component | Minimum Coverage | Target Coverage |
|-----------|------------------|-----------------|
| Backend Core | 90% | 95% |
| Backend API | 85% | 90% |
| Frontend Components | 80% | 85% |
| Frontend Utils | 85% | 90% |
| Critical Paths | 95% | 100% |

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Backend Test Issues

**Issue**: `ImportError: No module named 'app'`
```bash
# Solution: Ensure PYTHONPATH includes project root
cd backend
export PYTHONPATH=$PYTHONPATH:$(pwd)
pytest tests/
```

**Issue**: Database connection errors
```bash
# Solution: Check database configuration
cd backend
# Verify .env.test settings
cat .env.test | grep DATABASE_URL

# Test database connection
python -c "from app.database import engine; print(engine.execute('SELECT 1').scalar())"
```

**Issue**: `pytest: command not found`
```bash
# Solution: Activate virtual environment
cd backend
source venv/bin/activate
pip install pytest
```

#### Frontend Test Issues

**Issue**: `Cannot resolve module '@/components/...'`
```bash
# Solution: Check Jest configuration
cd web
# Verify moduleNameMapping in jest.config.js
cat jest.config.js | grep moduleNameMapping
```

**Issue**: Playwright browser issues
```bash
# Solution: Reinstall browsers
cd web
npx playwright install --force
npx playwright install-deps
```

**Issue**: Test timeouts
```bash
# Solution: Increase timeout in configuration
cd web
# Edit jest.config.js or playwright.config.ts
# Add/modify timeout settings
```

#### E2E Test Issues

**Issue**: Tests fail in CI but pass locally
```bash
# Solution: Check environment differences
# 1. Verify environment variables
# 2. Check service startup timing
# 3. Add proper wait conditions
# 4. Use consistent test data
```

**Issue**: Flaky tests
```bash
# Solution: Improve test stability
# 1. Add explicit wait conditions
# 2. Use data-testid selectors
# 3. Avoid timing-dependent assertions
# 4. Mock external dependencies
```

### Debugging Strategies

1. **Isolate the Problem**: Run specific failing tests
2. **Check Logs**: Review detailed error messages
3. **Verify Environment**: Ensure proper test setup
4. **Use Debug Mode**: Enable verbose output
5. **Check Dependencies**: Verify all dependencies installed

### Getting Help

1. **Documentation**: Check this guide first
2. **Test Output**: Read error messages carefully
3. **Logs**: Check test-logs/ directory
4. **Team**: Ask team members for assistance
5. **CI/CD**: Review GitHub Actions logs

## 📚 Best Practices

### Test Writing Best Practices

1. **Clear Test Names**: Describe what is being tested
   ```python
   def test_user_can_register_with_valid_email():
       # Good: Clear what's being tested
   
   def test_register():
       # Bad: Unclear test purpose
   ```

2. **Arrange-Act-Assert Pattern**:
   ```python
   def test_user_authentication():
       # Arrange: Set up test data
       user_data = {"email": "test@example.com", "password": "testpass"}
       
       # Act: Perform the action
       response = client.post("/login", json=user_data)
       
       # Assert: Verify results
       assert response.status_code == 200
       assert "access_token" in response.json()
   ```

3. **Test Independence**: Each test should be isolated
   ```python
   def test_user_creation():
       # Don't depend on other tests
       user = create_test_user()  # Create fresh data
       # ... test logic
   ```

4. **Meaningful Assertions**: Test behaviour, not implementation
   ```python
   # Good: Test observable behaviour
   assert user.is_authenticated == True
   assert response.status_code == 200
   
   # Bad: Test implementation details
   assert user._internal_auth_flag == True
   ```

### Test Maintenance

1. **Regular Updates**: Keep tests updated with code changes
2. **Refactor Tests**: Improve test quality over time
3. **Remove Obsolete Tests**: Clean up unused tests
4. **Document Complex Tests**: Add comments for complex scenarios

### Performance Best Practices

1. **Fast Unit Tests**: Keep unit tests under 100ms each
2. **Parallel Execution**: Use pytest-xdist and Jest parallel
3. **Mock External Services**: Don't test external dependencies
4. **Efficient Test Data**: Use minimal data for tests

### Security Testing Best Practices

1. **Think Like an Attacker**: Test malicious inputs
2. **Test Edge Cases**: Boundary conditions and error states
3. **Validate All Inputs**: Test all input validation points
4. **Test Access Controls**: Verify authorisation at every level

### CI/CD Best Practices

1. **Fail Fast**: Run fast tests first
2. **Parallel Execution**: Use test matrices
3. **Cached Dependencies**: Cache node_modules and pip packages
4. **Clear Reporting**: Provide actionable test reports

## 📈 Metrics and Monitoring

### Test Metrics to Track

1. **Test Coverage**: Line and branch coverage percentages
2. **Test Execution Time**: Monitor for performance regressions
3. **Test Success Rate**: Track flaky test patterns
4. **Security Scan Results**: Monitor vulnerability trends

### Quality Metrics

1. **Defect Detection Rate**: Tests catching bugs before production
2. **Test Maintenance Effort**: Time spent maintaining tests
3. **False Positive Rate**: Tests failing incorrectly
4. **Code Quality**: Complexity and maintainability scores

### Reporting

- **Daily**: Automated test results summary
- **Weekly**: Test coverage and quality trends
- **Monthly**: Comprehensive test suite analysis
- **Release**: Full quality and security validation report

---

## 🎉 Conclusion

This comprehensive testing guide provides everything needed to maintain high-quality, secure, and performant code in the Aclue platform. Remember that testing is an investment in code quality, user experience, and business success.

For questions or improvements to this guide, please reach out to the development team or create an issue in the repository.

**Happy Testing!** 🧪✨