# aclue Quick Start Guide

**Version 2.0.0** | **Time to Launch: 5 minutes** ⚡

A streamlined guide to get the aclue platform running on your local machine in under 5 minutes.

## 🚀 TL;DR - Fastest Setup

```bash
# Clone and setup - 30 seconds
git clone <repository-url>
cd aclue-preprod

# Backend - 2 minutes
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your Supabase credentials
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# Frontend - 2 minutes
cd ../web
npm install
cp .env.example .env.local  # Set API URL to http://localhost:8000
npm run dev &

# Done! Access at:
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ Python 3.8+ (`python3 --version`)
- ✅ Node.js 18+ (`node --version`)
- ✅ Git (`git --version`)
- ✅ 2GB free RAM
- ✅ 1GB free disk space

## 🎯 Step-by-Step Setup

### Step 1: Clone Repository (30 seconds)

```bash
git clone <repository-url>
cd aclue-preprod
```

### Step 2: Backend Setup (2 minutes)

#### 2.1 Create Python Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2.2 Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.3 Configure Environment
Create `.env` file with minimal configuration:

```bash
cat > .env << 'EOF'
# Minimal Configuration for Development
PROJECT_NAME="aclue API"
ENVIRONMENT=development
DEBUG=true

# Security (change in production!)
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Supabase (get from https://supabase.com/dashboard)
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>

# CORS
ALLOWED_HOSTS=["http://localhost:3000"]

# Features
ENABLE_REGISTRATION=true
EOF
```

#### 2.4 Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Verify**: Visit http://localhost:8000/docs - you should see the API documentation

### Step 3: Frontend Setup (2 minutes)

Open a new terminal window:

#### 3.1 Install Dependencies
```bash
cd aclue-preprod/web
npm install
```

#### 3.2 Configure Environment
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
EOF
```

#### 3.3 Start Frontend Server
```bash
npm run dev
```

✅ **Verify**: Visit http://localhost:3000 - you should see the aclue homepage

## 🧪 Test Your Setup

### Quick Health Check
```bash
# Backend health
curl http://localhost:8000/health

# Frontend status
curl -I http://localhost:3000
```

### Test User Registration
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## 🛠️ Development Commands

### Backend Commands
```bash
# Start server
uvicorn app.main:app --reload

# Run tests
pytest

# Format code
black app/

# Check types
mypy app/
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Check types
npm run type-check
```

## 🌐 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | API base URL |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| API Redoc | http://localhost:8000/redoc | Alternative API docs |
| Health Check | http://localhost:8000/health | Backend health status |

## 🔧 Common Issues & Quick Fixes

### Backend Won't Start
```bash
# Check port 8000 is free
lsof -i :8000  # Linux/Mac
netstat -an | findstr :8000  # Windows

# Kill process using port
kill -9 <PID>  # Linux/Mac
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Database Connection Failed
```bash
# Verify Supabase credentials in .env
# Check network connection
# Ensure Supabase project is active
```

### CORS Errors
```bash
# Ensure backend .env has:
ALLOWED_HOSTS=["http://localhost:3000"]

# Restart backend server after changes
```

## 🚢 Next Steps

### After Local Setup Works:

1. **Explore the API**
   - Visit http://localhost:8000/docs
   - Try different endpoints
   - Create test data

2. **Test the Frontend**
   - Register a new account
   - Explore the swipe interface
   - View recommendations

3. **Customise Configuration**
   - Update branding in `web/src/config/`
   - Modify API settings in `backend/app/core/config.py`
   - Adjust feature flags in `.env` files

4. **Deploy to Staging**
   ```bash
   # Frontend to Vercel
   vercel deploy

   # Backend to Railway
   railway up
   ```

## 📚 Additional Resources

- **Full Documentation**: [README.md](README.md)
- **Backend Details**: [backend/README.md](backend/README.md)
- **Frontend Details**: [web/README.md](web/README.md)
- **Setup Verification**: [SETUP_VERIFICATION_CHECKLIST.md](SETUP_VERIFICATION_CHECKLIST.md)
- **Deployment Guide**: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## 💡 Pro Tips

1. **Use tmux/screen** for persistent sessions:
   ```bash
   tmux new -s aclue
   # Run servers in different panes
   ```

2. **Create aliases** for common commands:
   ```bash
   alias aclue-backend='cd ~/aclue-preprod/backend && source venv/bin/activate && uvicorn app.main:app --reload'
   alias aclue-frontend='cd ~/aclue-preprod/web && npm run dev'
   ```

3. **Use environment-specific configs**:
   ```bash
   # .env.development, .env.staging, .env.production
   cp .env.development .env
   ```

## ✅ Success Checklist

You know setup is complete when:
- [ ] Backend health check returns "healthy"
- [ ] API docs load at /docs
- [ ] Frontend homepage loads
- [ ] Registration creates new user
- [ ] Login returns JWT token
- [ ] No errors in console logs

---

**Need help?** Check the [troubleshooting guide](SETUP_VERIFICATION_CHECKLIST.md#-troubleshooting-guide) or review the [full documentation](README.md).

**Ready to code!** 🎉 Your aclue development environment is now fully operational.