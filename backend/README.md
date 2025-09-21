# Aclue Backend API

**Version**: 2.0.0 | **Status**: Production Ready ✅ | **Last Updated**: 21st September 2025

A high-performance, enterprise-grade FastAPI backend service for the Aclue AI-powered gifting platform, providing intelligent recommendations, secure authentication, and comprehensive analytics.

## Features

- 🔐 **Authentication System**: JWT-based authentication with refresh tokens
- 📦 **Product Management**: Comprehensive product catalogue with categories
- 🎯 **Smart Recommendations**: AI-powered gift suggestions based on preferences
- 👆 **Swipe Analytics**: Track and analyse user preferences through interactions
- 📊 **Business Intelligence**: Advanced analytics and performance metrics
- 🌐 **RESTful API**: Well-documented API following REST principles
- ⚡ **High Performance**: Optimised database queries and caching strategies
- 🔒 **Security**: Enterprise-grade security with input validation and RLS policies

## Technology Stack

- **Framework**: FastAPI 0.104.1 (Python 3.12+)
- **Database**: PostgreSQL 15 via Supabase
- **Authentication**: JWT tokens with automatic refresh (PyJWT 2.8.0)
- **Validation**: Pydantic v2 models with strict validation
- **Documentation**: OpenAPI 3.1 auto-generated specification
- **Testing**: pytest with 85% code coverage
- **Security**: bcrypt password hashing (12 rounds), enterprise CORS
- **Performance**: Async/await with uvloop for maximum throughput
- **Monitoring**: Sentry APM + PostHog analytics integration

## Prerequisites

- Python 3.8 or later (3.11+ recommended)
- PostgreSQL database (or Supabase account)
- Virtual environment tool (venv or virtualenv)
- Git for version control

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aclue-preprod/backend
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Core Configuration
PROJECT_NAME="Aclue API"
VERSION="1.0.0"
ENVIRONMENT=development
DEBUG=true

# Security
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# CORS (Development)
ALLOWED_HOSTS=["http://localhost:3000"]

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_ML_RECOMMENDATIONS=true
```

### 5. Start the Development Server

```bash
# Standard development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or with custom configuration
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Access the Application

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **API Base**: http://localhost:8000/api/v1

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py              # Authentication endpoints
│   │       │   ├── products.py          # Product management
│   │       │   ├── categories.py        # Category management
│   │       │   ├── swipes.py           # Swipe interactions
│   │       │   ├── recommendations.py   # AI recommendations
│   │       │   ├── newsletter.py       # Newsletter subscriptions
│   │       │   └── analytics.py        # Analytics endpoints
│   │       └── api.py                  # API router configuration
│   ├── core/
│   │   ├── config.py                   # Application configuration
│   │   ├── security.py                 # Security utilities
│   │   └── database.py                 # Database connection
│   ├── models/
│   │   ├── auth.py                     # Authentication models
│   │   ├── products.py                 # Product models
│   │   └── users.py                    # User models
│   ├── services/
│   │   ├── auth_service.py            # Authentication logic
│   │   ├── recommendation_service.py   # Recommendation engine
│   │   └── analytics_service.py       # Analytics processing
│   ├── utils/
│   │   └── validators.py              # Input validators
│   └── main.py                         # FastAPI application entry
├── tests/
│   ├── test_auth.py                   # Authentication tests
│   ├── test_products.py               # Product tests
│   └── test_recommendations.py        # Recommendation tests
├── migrations/                          # Database migrations
├── requirements.txt                     # Python dependencies
├── .env.example                        # Environment template
└── README.md                           # This file
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/logout` - User logout

### Products
- `GET /api/v1/products/` - List products with filtering
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products/` - Create product (admin)
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product
- `GET /api/v1/products/featured` - Get featured products

### Categories
- `GET /api/v1/categories/` - List all categories
- `GET /api/v1/categories/{id}` - Get category details
- `GET /api/v1/categories/tree` - Get category hierarchy

### Swipe System
- `POST /api/v1/swipes/sessions` - Create swipe session
- `GET /api/v1/swipes/sessions` - Get user sessions
- `POST /api/v1/swipes/interactions` - Record swipe
- `GET /api/v1/swipes/analytics` - Get preferences

### Recommendations
- `GET /api/v1/recommendations/` - Get personalised recommendations
- `POST /api/v1/recommendations/generate` - Generate new recommendations
- `POST /api/v1/recommendations/{id}/interact` - Track interaction

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### Code Quality

```bash
# Format code with black
black app/

# Sort imports
isort app/

# Check code style
flake8 app/

# Type checking
mypy app/
```

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | JWT signing key | - | Yes |
| `SUPABASE_URL` | Supabase project URL | - | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service key | - | Yes |
| `DEBUG` | Debug mode | false | No |
| `ENVIRONMENT` | Environment name | production | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | 30 | No |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | 30 | No |
| `ALLOWED_HOSTS` | CORS allowed origins | [] | Yes |

### Feature Flags

Control feature availability through environment variables:

- `ENABLE_REGISTRATION` - Allow new user registration
- `ENABLE_ML_RECOMMENDATIONS` - Enable AI recommendations
- `ENABLE_SOCIAL_LOGIN` - Enable OAuth login
- `ENABLE_AFFILIATE_TRACKING` - Track affiliate links

## Deployment

### Production with Docker

```bash
# Build Docker image
docker build -t aclue-backend .

# Run container
docker run -p 8000:8000 --env-file .env aclue-backend
```

### Production with Railway

```bash
# Deploy to Railway
railway up

# Set environment variables
railway variables set SECRET_KEY="your-secret-key"
railway variables set SUPABASE_URL="your-supabase-url"
```

### Production with systemd

Create `/etc/systemd/system/aclue-backend.service`:

```ini
[Unit]
Description=Aclue Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/aclue-backend
Environment="PATH=/var/www/aclue-backend/venv/bin"
ExecStart=/var/www/aclue-backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Performance Optimisation

### Database Optimisation
- Proper indexing on frequently queried columns
- Connection pooling configuration
- Query optimisation with select_related/prefetch_related

### Caching Strategy
- Redis caching for frequently accessed data
- Response caching for static endpoints
- Session caching for user data

### API Optimisation
- Pagination for list endpoints
- Selective field returns
- Async request handling
- Response compression

## Security

### Authentication
- JWT tokens with secure signing
- Token refresh mechanism
- Password hashing with bcrypt
- Session management

### API Security
- Input validation with Pydantic
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Request size limits

### Database Security
- Row-level security (RLS) policies
- Service key separation
- Prepared statements
- Connection encryption

## Monitoring

### Health Checks
- `/health` - Basic health check
- `/health/db` - Database connectivity
- `/health/redis` - Cache connectivity

### Logging
- Structured logging with loguru
- Request/response logging
- Error tracking
- Performance metrics

### Metrics
- API response times
- Error rates
- Database query performance
- Cache hit rates

## Troubleshooting

### Common Issues

1. **Import Error: No module named 'app'**
   ```bash
   # Ensure you're in the backend directory
   cd backend
   # Add current directory to Python path
   export PYTHONPATH=$PYTHONPATH:$(pwd)
   ```

2. **Database Connection Failed**
   - Verify Supabase credentials in `.env`
   - Check network connectivity
   - Ensure database is accessible

3. **CORS Errors**
   - Add frontend URL to `ALLOWED_HOSTS`
   - Check request headers
   - Verify API URL in frontend

4. **Authentication Failures**
   - Check JWT token expiration
   - Verify SECRET_KEY matches
   - Clear browser storage

5. **Module Import Issues**
   ```bash
   # Reinstall dependencies
   pip install -r requirements.txt --force-reinstall
   ```

### Debug Mode

Enable detailed error messages:

```bash
# In .env file
DEBUG=true
LOG_LEVEL=DEBUG
```

### Getting Help

- Check API documentation at `/docs`
- Review error logs in terminal
- Check Supabase dashboard for database issues
- File an issue in the repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run code quality checks
6. Submit a pull request

### Coding Standards

- Follow PEP 8 style guide
- Use type hints
- Write docstrings
- Add unit tests
- Update documentation

## License

This project is proprietary software. All rights reserved.

## Links

- [Frontend Application](../web/README.md)
- [API Documentation](http://localhost:8000/docs)
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)
- [Project Overview](../README.md)