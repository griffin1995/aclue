# aclue Project - Complete Device Synchronization Setup Guide

## Overview
This guide enables you to recreate the complete aclue project state on any new device, including:
- Context-manager as PROJECT LEAD coordination system
- All specialist agents coordination capabilities  
- Complete development environment
- All configuration files and dependencies

## 🚨 CRITICAL: Project Management State Recreation

### FIRST STEP - Activate Context-Manager as Project Lead
**IMMEDIATELY after cloning the repository, type exactly**: `start project management`

This command MUST be executed to:
1. Activate context-manager agent as the main project coordinator
2. Enable specialist agent selection and coordination capabilities
3. Establish proper workflow orchestration
4. Match the current device's project management state

**This is the most critical step - without it, you won't have the same project management capabilities.**

## Project Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript (deployed to aclue.app via Vercel)
- **Backend**: FastAPI with Python 3.8+ (deployed to Railway)
- **Database**: Supabase PostgreSQL 
- **Analytics**: PostHog with EU hosting
- **Mobile**: Flutter (in development)
- **Infrastructure**: Docker, Terraform, Kubernetes configs included
- **AI/ML**: Python-based recommendation system

### Domain Configuration
- **Primary**: aclue.app (production frontend)
- **API**: aclue-backend-production.up.railway.app
- **UK Market**: aclue.co.uk (future expansion)

## Prerequisites Installation

### Required Software
```bash
# Node.js 18+ (for frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python 3.8+ (for backend)
sudo apt-get install python3 python3-pip python3-venv

# Docker (optional, for containerized development)
sudo apt-get install docker.io docker-compose

# Git (if not already installed)
sudo apt-get install git
```

### Development Tools
```bash
# VS Code or your preferred editor
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update && sudo apt install code
```

## Step-by-Step Setup Process

### 1. Repository Clone
```bash
cd ~/Documents
git clone [YOUR_REPO_URL] gift_sync
cd gift_sync
```

### 2. Extract Setup Files Package
After cloning, extract `aclue-setup-files.zip` to restore all non-git configuration files:
```bash
# Extract the setup package (created alongside this documentation)
unzip aclue-setup-files.zip
```

This restores:
- Environment configuration files (.env files)
- Local development configurations
- IDE settings (.vscode/, .idea/)
- Python virtual environment setup scripts
- Development certificates and keys

### 3. Backend Environment Setup
```bash
cd backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify environment file exists
ls -la .env  # Should show the extracted .env file

# Test backend startup
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Should start without errors and show FastAPI docs at http://localhost:8000/docs
```

### 4. Frontend Environment Setup
```bash
cd ../web

# Install Node.js dependencies
npm install

# Verify environment file exists
ls -la .env.local  # Should show the extracted .env.local file

# Test frontend startup
npm run dev
# Should start at http://localhost:3000
```

### 5. Database Connection Verification
```bash
# From backend directory
python -c "
from app.core.database import get_db
from sqlalchemy import text
db = next(get_db())
result = db.execute(text('SELECT 1')).fetchone()
print('Database connection successful' if result else 'Database connection failed')
"
```

### 6. Full System Test
```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd web && npm run dev

# Test authentication (Terminal 3)
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

## Configuration Files Inventory

### Files Available in Git Repository
✅ All source code files
✅ `CLAUDE.md` - Critical project instructions
✅ Documentation and architectural files
✅ Docker configurations
✅ Terraform infrastructure code
✅ Kubernetes configurations
✅ Requirements and package files

### Files NOT in Git (Provided in aclue-setup-files.zip)
❌ `/backend/.env` - Backend environment variables
❌ `/web/.env.local` - Frontend environment variables  
❌ `/backend/.env.production` - Production backend config
❌ `/web/.env.production` - Production frontend config
❌ `/.claude/settings.local.json` - Claude IDE settings
❌ Python virtual environment binaries
❌ Node.js node_modules directories
❌ Build artifacts and cache files

### Critical Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xchsarvamppwephulylt.supabase.co:5432/postgres
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_KEY=[SERVICE_KEY]
SECRET_KEY=aclue-production-secret-key-2025-change-this-256-bit-railway
RESEND_API_KEY=re_jiUeEQis_3Y9vrR7yECq6hiWT83JzMrR6
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_MAINTENANCE_MODE=true
NEXT_PUBLIC_POSTHOG_KEY=phc_VcOO4izj5xcGzgrgo2QfzZRZLhwEIlxqzeqsdSPcqC0
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Project Management System Details

### Context-Manager Role
The context-manager agent serves as:
- **Primary Project Coordinator**: Manages all task delegation
- **Agent Selection Engine**: Chooses optimal specialist agents
- **Workflow Orchestrator**: Coordinates multi-agent workflows
- **Context Maintainer**: Preserves project state across sessions

### Available Specialist Agents
The system coordinates 50+ specialist agents including:
- `frontend-developer` - React/Next.js expertise
- `backend-architect` - FastAPI/Python systems
- `database-admin` - PostgreSQL/Supabase management
- `ui-ux-designer` - Interface and experience design
- `devops-troubleshooter` - Deployment and infrastructure
- `security-auditor` - Security analysis and implementation
- `performance-engineer` - Optimization and monitoring
- `mobile-developer` - Flutter mobile development

### Agent Selection Criteria
1. **Capability Match Score** (40%): Task-agent alignment
2. **Domain Expertise** (25%): Specialization depth
3. **Complexity Handling** (20%): Task complexity capability
4. **Integration Compatibility** (10%): Project stack fit
5. **Performance History** (5%): Success rate tracking

## Development Workflow

### Standard Development Process
1. **Task Analysis**: Context-manager parses requirements
2. **Agent Selection**: Optimal specialist(s) chosen
3. **Context Briefing**: Relevant background provided
4. **Task Execution**: Specialist performs work
5. **Integration Review**: Changes verified and integrated
6. **Handoff Management**: Next steps coordinated

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes with appropriate agent
# Commit with conventional commit format
git add .
git commit -m "feat: implement new feature with context-manager coordination"

# Push and create PR
git push origin feature/your-feature
```

### Deployment Workflow
- **Frontend**: Auto-deploys from main branch to aclue.app (Vercel)
- **Backend**: Manual deploy to Railway from main branch
- **Database**: Migrations via Supabase dashboard or Alembic

## Verification Checklist

### ✅ Environment Setup Verification
- [ ] Git repository cloned successfully
- [ ] `aclue-setup-files.zip` extracted with all config files
- [ ] Backend `.env` file present with all required variables
- [ ] Frontend `.env.local` file present with all required variables
- [ ] Python virtual environment created and activated
- [ ] Backend dependencies installed (`pip list` shows FastAPI, etc.)
- [ ] Node.js dependencies installed (`npm list` shows Next.js, etc.)

### ✅ Service Startup Verification
- [ ] Backend starts without errors on port 8000
- [ ] Frontend starts without errors on port 3000
- [ ] FastAPI docs accessible at http://localhost:8000/docs
- [ ] Next.js app loads at http://localhost:3000
- [ ] Database connection test passes

### ✅ Authentication System Verification
- [ ] Login API endpoint returns valid JWT tokens
- [ ] Test user (john.doe@example.com) authentication works
- [ ] Protected endpoints accessible with valid tokens
- [ ] `/auth/me` endpoint returns user profile data

### ✅ Project Management State Verification
- [ ] Executed `start project management` command successfully
- [ ] Context-manager activated as PROJECT LEAD
- [ ] Agent selection system responding to task requests
- [ ] Multi-agent coordination capabilities available
- [ ] Context preservation working across sessions

### ✅ Integration Verification
- [ ] Frontend can communicate with backend API
- [ ] PostHog analytics events tracking (in browser console)
- [ ] All pages load without console errors
- [ ] Authentication flow works end-to-end
- [ ] Database queries execute successfully

## Troubleshooting Common Issues

### Backend Won't Start
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Verify virtual environment
which python  # Should show venv path when activated

# Check environment variables
cat backend/.env | grep DATABASE_URL

# Test database connection
cd backend && python -c "from app.core.database import engine; print('DB OK' if engine else 'DB Failed')"
```

### Frontend Won't Start
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf web/node_modules web/.next
cd web && npm install

# Check environment variables
cat web/.env.local | grep NEXT_PUBLIC_API_URL
```

### Authentication Errors
```bash
# Test database user creation
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Test", "last_name": "User", "email": "test@example.com", "password": "password123", "marketing_consent": false}'
```

### Project Management System Not Working
1. **Re-run activation command**: `start project management`
2. **Verify CLAUDE.md is present**: Check for critical project instructions
3. **Check context preservation**: Ensure previous session state is maintained
4. **Test agent coordination**: Request a simple task to verify agent selection

## Production Deployment Notes

### Current Production URLs
- **Frontend**: https://aclue.app
- **Backend API**: https://aclue-backend-production.up.railway.app
- **Database**: Supabase hosted PostgreSQL

### Environment Differences
- **Development**: Maintenance mode ON, local APIs
- **Production**: Maintenance mode configurable, Railway backend
- **Testing**: Separate test database, debug mode enabled

## Advanced Features

### Mobile Development (Flutter)
```bash
# Flutter setup (optional)
cd mobile
flutter pub get
flutter run
```

### Machine Learning Components
```bash
# ML development (optional)
cd ml
pip install -r requirements.txt
python -m pytest tests/
```

### Infrastructure Management
```bash
# Terraform (optional)
cd infrastructure/terraform
terraform init
terraform plan
```

## Security Considerations

### Sensitive Files Protection
- All `.env` files are gitignored
- API keys and secrets in environment variables only
- Production configs separated from development
- Database credentials managed via Supabase dashboard

### Access Management
- Supabase RLS policies enabled
- JWT token expiration configured
- CORS properly configured for production
- Security headers implemented

## Support and Documentation

### Key Documentation Files
- `CLAUDE.md` - Critical project instructions and rules
- `COMPLETE_PROJECT_DOCUMENTATION.md` - Comprehensive project overview
- `DATABASE_IMPLEMENTATION_SUMMARY.md` - Database architecture
- `DEPLOYMENT.md` - Production deployment guide
- `TESTING.md` - Testing procedures and requirements

### Getting Help
1. **Context-Manager**: Primary coordinator for all development tasks
2. **Specialist Agents**: Domain-specific expertise and problem-solving
3. **Documentation Index**: `DOCUMENTATION_INDEX.md` for reference lookup
4. **Test Procedures**: Automated test suites for verification

## Final Setup Validation

After completing all steps, run this comprehensive validation:

```bash
#!/bin/bash
echo "=== aclue Project Setup Validation ==="

# 1. Check git repository
echo "✓ Git repository status:"
git status --short

# 2. Verify backend
echo "✓ Backend environment:"
cd backend && source venv/bin/activate && python -c "
from app.core.config import get_settings
settings = get_settings()
print(f'Environment: {settings.environment}')
print('Backend configuration loaded successfully')
"

# 3. Verify frontend  
echo "✓ Frontend environment:"
cd ../web && node -e "
const config = require('./next.config.js');
console.log('Frontend configuration loaded successfully');
"

# 4. Test API connectivity
echo "✓ API connectivity:"
curl -s http://localhost:8000/health | grep -q "healthy" && echo "Backend health check passed"

# 5. Test authentication
echo "✓ Authentication system:"
curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}' | \
  grep -q "access_token" && echo "Authentication system working"

echo "=== Setup Complete ==="
echo "Ready for: start project management"
```

---

**🚨 REMEMBER: After setup completion, immediately execute `start project management` to activate the context-manager as PROJECT LEAD and enable full agent coordination capabilities.**

This ensures your new device has identical project management capabilities to the current setup.