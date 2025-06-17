# GiftSync - AI-Powered Gift Recommendation Platform

> The perfect gift, every time – with the surprise intact

## Overview

GiftSync uses AI-powered preference discovery to generate personalised gift recommendations, maintaining the joy of surprise whilst ensuring recipient satisfaction through our innovative swipe-based preference engine.

## Architecture

### Core Components
- **Mobile App** (Flutter) - Cross-platform iOS/Android app
- **Backend API** (FastAPI/Python) - High-performance REST API
- **ML Pipeline** (SageMaker/PyTorch) - Recommendation algorithms
- **Database** (PostgreSQL/DynamoDB) - User data and analytics
- **Infrastructure** (AWS) - Cloud-native architecture

### Key Features
- Tinder-style preference discovery
- AI-powered gift recommendations
- Shareable gift links with QR codes
- Affiliate commission tracking
- Real-time notifications
- GDPR-compliant analytics

## Project Structure

```
gift_sync/
├── mobile/                 # Flutter mobile application
├── backend/               # FastAPI backend services
├── ml/                    # Machine learning pipeline
├── infrastructure/        # AWS infrastructure as code
├── database/             # Database schemas and migrations
├── docs/                 # Technical documentation
└── scripts/              # Development and deployment scripts
```

## Tech Stack

### Mobile (Flutter)
- **Framework**: Flutter 3.16+
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **Networking**: Dio/Retrofit
- **Authentication**: Firebase Auth
- **Analytics**: Mixpanel + Firebase Analytics

### Backend (FastAPI)
- **Framework**: FastAPI 0.104+
- **Database ORM**: SQLAlchemy + Alembic
- **Async Support**: AsyncIO + AsyncPG
- **Caching**: Redis/ElastiCache
- **Authentication**: JWT + OAuth2
- **API Documentation**: OpenAPI/Swagger

### Machine Learning
- **Training**: PyTorch + SageMaker
- **Inference**: TensorFlow Serving
- **Vector DB**: Pinecone
- **Experiment Tracking**: MLflow
- **Model Registry**: SageMaker Model Registry

### Infrastructure (AWS)
- **Compute**: EKS + Lambda
- **Database**: RDS (PostgreSQL) + DynamoDB
- **Caching**: ElastiCache (Redis)
- **Storage**: S3 + CloudFront
- **Monitoring**: CloudWatch + X-Ray

## Getting Started

### Prerequisites
- Flutter SDK 3.16+
- Python 3.11+
- Docker & Docker Compose
- AWS CLI configured
- Node.js 18+ (for tooling)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gift_sync
   ```

2. **Set up backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **Set up mobile app**
   ```bash
   cd mobile
   flutter pub get
   ```

4. **Start development services**
   ```bash
   docker-compose up -d  # Database, Redis, etc.
   ```

## Development Workflow

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Mobile Development
```bash
cd mobile
flutter run
```

### Running Tests
```bash
# Backend tests
cd backend && pytest

# Mobile tests
cd mobile && flutter test
```

## Environment Configuration

Create `.env` files in each component directory:

### Backend `.env`
```
DATABASE_URL=postgresql://user:pass@localhost:5432/giftsync
REDIS_URL=redis://localhost:6379
AWS_REGION=eu-west-2
SECRET_KEY=your-secret-key
```

### Mobile `.env`
```
API_BASE_URL=http://localhost:8000
MIXPANEL_TOKEN=your-mixpanel-token
```

## Deployment

### Staging
```bash
./scripts/deploy-staging.sh
```

### Production
```bash
./scripts/deploy-production.sh
```

## Contributing

1. Create feature branch from `develop`
2. Make changes following code style guidelines
3. Add tests for new functionality
4. Submit pull request with description

## Code Style

- **Python**: Black + isort + flake8
- **Dart/Flutter**: dart format + dart analyze
- **Commit Messages**: Conventional commits format

## API Documentation

When running the backend locally, visit:
- API Documentation: http://localhost:8000/docs
- Alternative UI: http://localhost:8000/redoc

## License

Proprietary - GiftSync Technologies Ltd

## Support

For development support, contact the engineering team or create an issue in the repository.