# Documentation Security Standards Guide

## Purpose
This guide ensures all technical documentation can include security examples whilst passing GitHub's push protection and other secret scanning tools.

---

## 1. Core Principles

### 1.1 Never Use Realistic Patterns
Documentation must **NEVER** contain patterns that could be mistaken for real secrets, even if they're clearly fake to humans.

### 1.2 Always Mark as Examples
Every credential example must be clearly marked with indicators like:
- `EXAMPLE`
- `PLACEHOLDER`
- `XXX`
- `DO_NOT_USE`
- `FAKE`

### 1.3 Maintain Educational Value
Examples must remain clear and instructive whilst being obviously non-functional.

---

## 2. Safe Pattern Reference

### 2.1 API Keys

#### ❌ UNSAFE Examples
```bash
# These patterns will trigger GitHub push protection
STRIPE_SECRET_KEY=sk_live_[realistic_pattern]  # NEVER use realistic formats
STRIPE_TEST_KEY=sk_test_[realistic_pattern]    # NEVER use realistic formats
AWS_ACCESS_KEY_ID=AKIA[realistic_pattern]      # NEVER use realistic formats
GITHUB_TOKEN=ghp_[realistic_pattern]           # NEVER use realistic formats
```

#### ✅ SAFE Examples
```bash
# These patterns are clearly fake and won't trigger protection
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX  # EXAMPLE - Replace with actual key
STRIPE_TEST_KEY=sk_test_EXAMPLE_KEY_DO_NOT_USE
AWS_ACCESS_KEY_ID=AKIA_EXAMPLE_KEY_XXX
GITHUB_TOKEN=ghp_XXXXXXXXXXXX  # Placeholder only
```

### 2.2 URLs and Connection Strings

#### ❌ UNSAFE Examples
```bash
# Too realistic, even with fake data
DATABASE_URL=postgresql://admin:password123@db.example.com:5432/production
REDIS_URL=redis://user:pass@redis.example.com:6379/0
```

#### ✅ SAFE Examples
```bash
# Use bracketed placeholders
DATABASE_URL=postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
REDIS_URL=redis://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DB_NUMBER]

# Or clearly fake values
DATABASE_URL=postgresql://USER_HERE:PASS_HERE@localhost:5432/DB_NAME_HERE
```

### 2.3 JWT Tokens

#### ❌ UNSAFE Examples
```bash
# Full JWT structure triggers scanning
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  # pragma: allowlist secret
```

#### ✅ SAFE Examples
```bash
# Truncated JWT
JWT_TOKEN=eyJ...TRUNCATED...

# Or with clear markers
JWT_TOKEN=eyJhbGciOiJIUzI1NiIs...EXAMPLE_JWT_DO_NOT_USE
```

### 2.4 Private Keys

#### ❌ UNSAFE Examples
```
[BEGIN_HEADER] RSA PRIVATE KEY [END_HEADER]
MIIEpAIBAAKCAQEA...  # UNSAFE EXAMPLE - DO NOT USE
[END_HEADER] RSA PRIVATE KEY [END_HEADER]
```

#### ✅ SAFE Examples
```
[BEGIN_HEADER] RSA PRIVATE KEY [END_HEADER]
[PRIVATE_KEY_CONTENT_HERE]
[END_HEADER] RSA PRIVATE KEY [END_HEADER]

# Or use placeholder format
PRIVATE_KEY_FILE_CONTENT=EXAMPLE_RSA_KEY_DO_NOT_USE
PRIVATE_KEY_PATH=/path/to/private/key/file.pem
```

---

## 3. Documentation Patterns

### 3.1 Environment Variables

Always include comments explaining the example nature:

```bash
# .env.example - DO NOT USE THESE VALUES
API_KEY=your_api_key_here  # Replace with actual API key
SECRET_KEY=XXXXXXXXXXXXXXXX  # Generate a secure key
DATABASE_URL=postgresql://[USER]:[PASS]@[HOST]/[DB]
```

### 3.2 Configuration Files

Use clear placeholders in YAML/JSON:

```yaml
# config.yml
stripe:
  publishable_key: pk_test_EXAMPLE_KEY_DO_NOT_USE
  secret_key: sk_test_EXAMPLE_KEY_DO_NOT_USE

database:
  host: "[DB_HOST]"
  username: "[DB_USER]"
  password: "[DB_PASSWORD]"
```

### 3.3 Code Examples

Add inline comments for credential placeholders:

```typescript
// TypeScript example
const config = {
  apiKey: 'API_KEY_PLACEHOLDER',  // Replace with actual key
  secret: 'SECRET_PLACEHOLDER',    // Generate secure secret
  endpoint: 'https://api.example.com'  // Update with your endpoint
};
```

---

## 4. Validation Checklist

Before committing documentation:

- [ ] No realistic-looking API keys (check all `sk_`, `pk_`, `ghp_`, `AKIA` patterns)
- [ ] All credentials have `EXAMPLE`, `PLACEHOLDER`, or `XXX` markers
- [ ] URLs use bracketed placeholders or clearly fake domains
- [ ] JWTs are truncated or clearly marked
- [ ] Private keys use placeholder content
- [ ] Comments explain example nature
- [ ] Pre-commit hooks pass locally

---

## 5. Testing Documentation

### 5.1 Local Validation
```bash
# Run pre-commit hooks
pre-commit run --all-files

# Test specific file
detect-secrets scan docs/YOUR_FILE.md

# Test specific pattern
detect-secrets scan --string 'YOUR_PATTERN_HERE'
```

### 5.2 Pattern Testing
```bash
# These should NOT trigger detection:
detect-secrets scan --string 'sk_test_EXAMPLE_KEY_DO_NOT_USE'
detect-secrets scan --string 'postgresql://[USER]:[PASS]@[HOST]/[DB]'
detect-secrets scan --string 'eyJ...TRUNCATED...'
```

---

## 6. Common Pitfalls

### 6.1 Avoid These Mistakes
- Using `example`, `test`, or `demo` with realistic patterns
- Including full JWT tokens even if expired
- Using real-looking AWS access key patterns
- Forgetting to mark examples in code blocks
- Using production-like prefixes (`sk_live_`, `pk_live_`)

### 6.2 GitHub Detection Triggers
These patterns **always** trigger detection:
- Stripe: `sk_live_*`, `sk_test_*` (with realistic suffixes)
- AWS: `AKIA` followed by 16 alphanumeric characters
- GitHub: `ghp_`, `ghs_`, `ghr_` with realistic suffixes
- Private keys with valid structure

---

## 7. Emergency Procedures

### 7.1 If Push is Blocked
1. Identify the triggering pattern in the error message
2. Locate the pattern in your documentation
3. Replace with safe pattern from this guide
4. Re-run pre-commit hooks locally
5. Attempt push again

### 7.2 If Real Secret is Exposed
1. **IMMEDIATELY** rotate the compromised credential
2. Remove from all documentation
3. Check commit history for other exposures
4. Notify security team
5. Update documentation with safe pattern

---

## 8. Tool Configuration

### 8.1 Pre-commit Hook Setup
```yaml
# .pre-commit-config.yaml
- repo: https://github.com/Yelp/detect-secrets
  hooks:
    - id: detect-secrets
      args: [
        '--exclude-lines', '(EXAMPLE|PLACEHOLDER|XXX|DO_NOT_USE)',
        '--exclude-secrets', 'sk_(test|live)_EXAMPLE.*'
      ]
```

### 8.2 CI/CD Validation
```yaml
# GitHub Actions example
- name: Scan for secrets
  run: |
    detect-secrets scan --exclude-lines 'EXAMPLE|PLACEHOLDER'
```

---

## 9. Review Process

### 9.1 Documentation Review Checklist
- [ ] Author has followed this guide
- [ ] No realistic secret patterns present
- [ ] Examples are clearly marked
- [ ] Educational value maintained
- [ ] Pre-commit hooks pass
- [ ] GitHub push protection passes

### 9.2 Approval Criteria
Documentation PRs must:
1. Pass automated secret scanning
2. Use approved patterns from this guide
3. Include clear example markers
4. Maintain educational clarity

---

## 10. Resources

### External References
- [GitHub Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Documentation Guidelines](https://owasp.org/www-project-top-ten/)
- [detect-secrets Documentation](https://github.com/Yelp/detect-secrets)

### Internal Documents
- [SECURITY_AUDIT_GITHUB_PUSH_PROTECTION.md](./SECURITY_AUDIT_GITHUB_PUSH_PROTECTION.md)
- [ENVIRONMENT_SECURITY_GUIDE.md](./ENVIRONMENT_SECURITY_GUIDE.md)
- [SECRET-MANAGEMENT-PROCEDURES.md](./SECRET-MANAGEMENT-PROCEDURES.md)

---

## Appendix: Quick Reference Card

```bash
# SAFE PATTERNS - Copy and use these:
API_KEY=API_KEY_PLACEHOLDER
SECRET_KEY=SECRET_KEY_PLACEHOLDER
STRIPE_KEY=sk_test_EXAMPLE_KEY_DO_NOT_USE
AWS_KEY=AKIA_EXAMPLE_KEY_XXX
GITHUB_TOKEN=ghp_XXXXXXXXXXXX
DATABASE_URL=postgresql://[USER]:[PASS]@[HOST]/[DB]
JWT_TOKEN=eyJ...TRUNCATED...
PRIVATE_KEY=[BEGIN_HEADER]PRIVATE_KEY[END_HEADER]
PRIVATE_KEY_PATH=/path/to/private.pem
PRIVATE_KEY_CONTENT=EXAMPLE_PRIVATE_KEY_DO_NOT_USE
```

---

**Document Version**: 1.0.0
**Last Updated**: 24th September 2025
**Status**: Active
**Owner**: Security Team