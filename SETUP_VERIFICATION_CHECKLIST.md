# aclue Platform Setup Verification Checklist

**Version 2.0.0** | **Last Updated: September 2025**

This comprehensive checklist ensures your aclue platform setup is complete, optimised, and production-ready. Follow each section sequentially for best results.

## 📋 Pre-Setup Requirements

### System Requirements
- [ ] **Operating System**: Linux, macOS, or Windows with WSL2
- [ ] **Memory**: Minimum 8GB RAM (16GB recommended)
- [ ] **Storage**: At least 10GB free space
- [ ] **Network**: Stable internet connection for dependencies

### Required Software
- [ ] **Node.js**: Version 18.x or later installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```
- [ ] **Python**: Version 3.8+ installed (3.11+ recommended)
  ```bash
  python3 --version  # Should show Python 3.8 or higher
  ```
- [ ] **Git**: Latest version installed
  ```bash
  git --version
  ```
- [ ] **PostgreSQL**: Local installation or Supabase account
- [ ] **Redis** (Optional): For caching in production

### Development Tools
- [ ] **Code Editor**: VS Code, PyCharm, or preferred IDE
- [ ] **API Testing**: Postman, Insomnia, or curl
- [ ] **Browser DevTools**: Chrome/Firefox with React DevTools

## 🚀 Backend Setup Verification

### 1. Repository & Environment
- [ ] **Clone Repository**:
  ```bash
  git clone <repository-url>
  cd aclue-preprod/backend
  ```
- [ ] **Virtual Environment Created**:
  ```bash
  python3 -m venv venv
  ```
- [ ] **Virtual Environment Activated**:
  ```bash
  source venv/bin/activate  # Linux/Mac
  # or
  venv\Scripts\activate  # Windows
  ```

### 2. Dependencies Installation
- [ ] **Upgrade pip**:
  ```bash
  pip install --upgrade pip
  ```
- [ ] **Install Requirements**:
  ```bash
  pip install -r requirements.txt
  ```
- [ ] **Verify Core Packages**:
  ```bash
  pip list | grep -E "fastapi|uvicorn|pydantic|supabase"
  ```

### 3. Environment Configuration
- [ ] **Create .env File**:
  ```bash
  cp .env.example .env  # If example exists
  ```
- [ ] **Configure Database**:
  - [ ] SUPABASE_URL set correctly
  - [ ] SUPABASE_ANON_KEY configured
  - [ ] SUPABASE_SERVICE_KEY added
- [ ] **Security Settings**:
  - [ ] SECRET_KEY generated and unique
  - [ ] ALGORITHM set (default: HS256)
  - [ ] Token expiration times configured
- [ ] **CORS Configuration**:
  - [ ] ALLOWED_HOSTS includes frontend URL
  - [ ] Development URL: http://localhost:3000

### 4. Database Verification
- [ ] **Test Database Connection**:
  ```bash
  python -c "from app.core.database import get_supabase_client; print('Connected!' if get_supabase_client() else 'Failed')"
  ```
- [ ] **Verify Tables Exist**:
  - [ ] users table
  - [ ] products table
  - [ ] categories table
  - [ ] swipe_sessions table
  - [ ] swipe_interactions table
  - [ ] recommendations table

### 5. Backend Server Startup
- [ ] **Start Development Server**:
  ```bash
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- [ ] **Verify Health Endpoint**:
  ```bash
  curl http://localhost:8000/health
  # Should return: {"status":"healthy","timestamp":"...","version":"1.0.0"}
  ```
- [ ] **Check API Documentation**:
  - [ ] Swagger UI: http://localhost:8000/docs
  - [ ] ReDoc: http://localhost:8000/redoc

### 6. API Endpoint Testing
- [ ] **Test Public Endpoints**:
  ```bash
  curl http://localhost:8000/api/v1/products/featured
  ```
- [ ] **Test Registration**:
  ```bash
  curl -X POST http://localhost:8000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"TestPass123"}'
  ```
- [ ] **Test Login**:
  ```bash
  curl -X POST http://localhost:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"TestPass123"}'
  ```
- [ ] **Test Protected Endpoint**:
  ```bash
  TOKEN="<access_token_from_login>"
  curl -H "Authorization: Bearer $TOKEN" \
    http://localhost:8000/api/v1/auth/me
  ```

## 💻 Frontend Setup Verification

### 1. Frontend Environment
- [ ] **Navigate to Frontend**:
  ```bash
  cd aclue-preprod/web
  ```
- [ ] **Install Dependencies**:
  ```bash
  npm install
  ```
- [ ] **Verify Package Installation**:
  ```bash
  npm list next react typescript
  ```

### 2. Frontend Configuration
- [ ] **Create .env.local**:
  ```bash
  cp .env.example .env.local  # If example exists
  ```
- [ ] **Configure Environment**:
  - [ ] NEXT_PUBLIC_API_URL=http://localhost:8000
  - [ ] NEXT_PUBLIC_WEB_URL=http://localhost:3000
  - [ ] Analytics keys (if applicable)

### 3. Frontend Server Startup
- [ ] **Start Development Server**:
  ```bash
  npm run dev
  ```
- [ ] **Verify Server Running**:
  ```bash
  curl -I http://localhost:3000
  # Should return: HTTP/1.1 200 OK
  ```

### 4. Frontend Functionality
- [ ] **Homepage Loads**: http://localhost:3000
- [ ] **Static Assets Load**: Logo, CSS, images
- [ ] **Navigation Works**: All links functional
- [ ] **Authentication Flow**:
  - [ ] Registration page accessible
  - [ ] Login page works
  - [ ] Protected routes redirect properly
- [ ] **API Integration**:
  - [ ] Products load from backend
  - [ ] Authentication works end-to-end

## 🔧 Integration Testing

### Full Stack Integration
- [ ] **Backend & Frontend Connected**:
  - [ ] Frontend can call backend APIs
  - [ ] No CORS errors in browser console
  - [ ] Authentication tokens work across stack
- [ ] **User Journey Testing**:
  - [ ] User can register account
  - [ ] User can log in
  - [ ] User can view products
  - [ ] User can create swipe session
  - [ ] User receives recommendations

### Performance Checks
- [ ] **API Response Times**: < 200ms for most endpoints
- [ ] **Frontend Load Time**: < 3 seconds initial load
- [ ] **Database Queries**: Optimised with proper indexes
- [ ] **Memory Usage**: No memory leaks detected

## 🚢 Production Readiness

### Security Verification
- [ ] **Environment Variables**:
  - [ ] No secrets in code repository
  - [ ] Production secrets different from development
  - [ ] All sensitive data in environment variables
- [ ] **Authentication**:
  - [ ] JWT tokens working correctly
  - [ ] Password hashing implemented
  - [ ] Token refresh mechanism functional
- [ ] **API Security**:
  - [ ] Input validation on all endpoints
  - [ ] SQL injection prevention
  - [ ] XSS protection enabled

### Deployment Preparation
- [ ] **Build Process**:
  ```bash
  # Backend doesn't need build
  # Frontend build:
  cd web && npm run build
  ```
- [ ] **Production Configuration**:
  - [ ] DEBUG=false in production
  - [ ] Proper ALLOWED_HOSTS configured
  - [ ] Database connection pooling set up
- [ ] **Monitoring Setup**:
  - [ ] Health check endpoints working
  - [ ] Error logging configured
  - [ ] Performance monitoring ready

## 📊 Optional Services

### Analytics & Monitoring
- [ ] **PostHog**: Analytics key configured
- [ ] **Sentry**: Error tracking DSN set
- [ ] **Google Analytics**: Tracking ID added

### External Integrations
- [ ] **Email Service**: SMTP settings configured
- [ ] **Amazon Associates**: API keys added
- [ ] **Payment Processing**: Stripe/PayPal keys (if applicable)

## ✅ Final Verification

### System Health Check
```bash
# Run this comprehensive check script
cat << 'EOF' > check_system.sh
#!/bin/bash
echo "🔍 aclue System Health Check"
echo "============================"

# Backend check
echo -n "Backend API: "
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "✅ Healthy"
else
    echo "❌ Not responding"
fi

# Frontend check
echo -n "Frontend App: "
if curl -sI http://localhost:3000 | grep -q "200 OK"; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

# API Docs check
echo -n "API Documentation: "
if curl -s http://localhost:8000/docs | grep -q "swagger"; then
    echo "✅ Available"
else
    echo "❌ Not accessible"
fi

echo "============================"
echo "Check complete!"
EOF
chmod +x check_system.sh
./check_system.sh
```

### Success Indicators
- [ ] All health checks pass
- [ ] No errors in console logs
- [ ] Authentication flow works end-to-end
- [ ] Data persists correctly in database
- [ ] UI responsive and functional

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### Backend Issues
1. **ModuleNotFoundError**:
   ```bash
   export PYTHONPATH=$PYTHONPATH:$(pwd)
   ```

2. **Database Connection Failed**:
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies allow access

3. **Port Already in Use**:
   ```bash
   lsof -i :8000  # Find process
   kill -9 <PID>  # Kill process
   ```

#### Frontend Issues
1. **Module Resolution Errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Build Failures**:
   ```bash
   rm -rf .next
   npm run build
   ```

3. **CORS Errors**:
   - Check backend ALLOWED_HOSTS
   - Verify API URL in .env.local

### Getting Help
- API Documentation: http://localhost:8000/docs
- Check logs in terminal windows
- Review error messages in browser console
- Consult project documentation in `/docs`

## 📝 Notes

- **Development URLs**:
  - Backend: http://localhost:8000
  - Frontend: http://localhost:3000
  - API Docs: http://localhost:8000/docs

- **Default Test User**:
  - Email: test@example.com
  - Password: TestPass123

- **Support Resources**:
  - Backend README: `/backend/README.md`
  - Frontend README: `/web/README.md`
  - Main Documentation: `/README.md`

---

**Setup Verification Complete!** 🎉

If all checkboxes are marked, your aclue platform is ready for development and testing.