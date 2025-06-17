# Claude Development Context - GiftSync Project

## Project Overview
GiftSync is an AI-powered gift recommendation platform that uses swipe-based preference discovery to generate personalized gift suggestions while maintaining the element of surprise. The platform targets a £45B global gift market with projected £2.5M revenue by Year 3.

## Business Context
- **Target Market**: £45B global gift market, £9.3B UK market
- **Revenue Model**: 7.5% average affiliate commissions + premium subscriptions
- **User Targets**: 1M+ users by Year 3, 25%+ conversion rate improvement
- **Key Segments**: Digital natives (18-35), busy professionals (25-45), corporate gifting

## Architecture Decisions Made

### Technology Stack (Finalized)
- **Cloud Platform**: AWS (chosen over Google Cloud for better ML services and affiliate integrations)
- **Mobile**: Flutter 3.16+ (superior swipe gesture performance, single codebase)
- **Backend**: FastAPI with Python (seamless ML integration, high performance)
- **Database**: PostgreSQL (primary) + DynamoDB (sessions) + Redis (caching)
- **ML Pipeline**: PyTorch + SageMaker for hybrid recommendation system
- **Infrastructure**: EKS + Lambda + Terraform IaC

### Key Technical Decisions
1. **Swipe Sessions**: Immediate storage with async batch processing every 5 minutes
2. **Recommendations**: Pre-compute nightly, real-time updates after 10+ swipes
3. **Affiliate Strategy**: Direct integration (Amazon API) + aggregators (Commission Junction)
4. **GDPR Compliance**: Pseudonymized user IDs, 90-day raw data retention, explicit consent
5. **Data Privacy**: Privacy-first design with performance optimization

## Project Structure Created

```
gift_sync/
├── mobile/                 # Flutter app (complete structure)
│   ├── lib/
│   │   ├── core/          # App config, routing, themes
│   │   ├── data/          # Data layer, repositories
│   │   ├── domain/        # Business logic, entities
│   │   └── presentation/  # UI screens, widgets
│   └── pubspec.yaml       # Dependencies configured
├── backend/               # FastAPI backend (complete structure)
│   ├── app/
│   │   ├── api/v1/        # API endpoints
│   │   ├── core/          # Config, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── alembic/           # Database migrations
│   └── requirements.txt   # Python dependencies
├── ml/                    # Machine learning pipeline
│   ├── models/            # Recommendation algorithms
│   │   ├── base_recommender.py
│   │   ├── collaborative_filtering.py
│   │   ├── content_based.py
│   │   └── hybrid_recommender.py
│   ├── training/          # Training scripts
│   └── inference/         # Serving infrastructure
├── infrastructure/        # AWS infrastructure as code
│   ├── terraform/         # Complete Terraform setup
│   │   ├── main.tf       # EKS, RDS, ElastiCache, S3, etc.
│   │   ├── variables.tf   # Configuration variables
│   │   └── outputs.tf     # Infrastructure outputs
│   └── environments/      # Dev/staging/production configs
├── database/             # Database schemas and init scripts
├── scripts/              # Development and deployment scripts
└── docs/                 # Technical documentation
```

## Database Schema Overview

### Core Models Implemented
- **Users**: Profile, preferences, subscription tiers, GDPR compliance
- **Products**: Full product catalog with ML features, affiliate links
- **Swipe Sessions/Interactions**: Tinder-style preference capture
- **Recommendations**: AI-generated suggestions with confidence scores
- **Gift Links**: Shareable links with QR codes and analytics
- **Affiliate Tracking**: Commission tracking and attribution

### Key Relationships
- Users → Swipe Sessions → Swipe Interactions (preference learning)
- Users → Recommendations → Products (personalized suggestions)
- Users → Gift Links → Gift Link Interactions (sharing analytics)
- Products → Affiliate Clicks → Commissions (revenue tracking)

## ML Pipeline Architecture

### Recommendation Models
1. **Collaborative Filtering**: Neural Matrix Factorization with PyTorch
2. **Content-Based**: TF-IDF + cosine similarity with product features
3. **Hybrid**: Weighted combination (60% CF, 40% content) with diversity boosting

### Training Strategy
- **Real-time**: Process swipes immediately for instant feedback
- **Batch**: Retrain models every 5 minutes with new interaction data
- **Cold Start**: Popularity-based fallback for new users
- **Evaluation**: Precision@K, Recall@K, NDCG metrics

## AWS Infrastructure

### Production Architecture
- **EKS Cluster**: Auto-scaling node groups with spot instances
- **RDS PostgreSQL**: Multi-AZ with automated backups
- **ElastiCache Redis**: Cluster mode for high availability
- **S3 + CloudFront**: Global asset delivery
- **DynamoDB**: Session storage and real-time analytics
- **Application Load Balancer**: SSL termination and routing

### Environment Configurations
- **Development**: Cost-optimized with LocalStack simulation
- **Production**: High-availability with enhanced monitoring
- **Terraform**: Complete infrastructure as code with state management

## Current Development Status

### ✅ Completed Components
1. **Project Structure**: Complete directory hierarchy and foundational files
2. **Mobile App**: Flutter project with clean architecture, navigation, theming
3. **Backend API**: FastAPI with async support, auth, database models
4. **Database Schema**: Comprehensive models for all business entities
5. **ML Pipeline**: Three recommendation algorithms with base framework
6. **Infrastructure**: Production-ready AWS Terraform configuration
7. **Development Tools**: Docker Compose, setup scripts, environment configs

### 🎯 Next Development Steps
1. **Complete remaining API endpoints** (swipes, recommendations, gift-links)
2. **Implement mobile UI screens** (splash, onboarding, swipe interface)
3. **Connect mobile app to backend** (API integration, state management)
4. **Set up ML training pipeline** (data ingestion, model deployment)
5. **Configure CI/CD** (GitHub Actions, automated testing)
6. **Deploy development environment** (AWS infrastructure, monitoring)

## Development Workflow

### Local Development Setup
```bash
# Start development environment
./scripts/setup-dev.sh --install-docker

# Start backend API
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Start mobile app
cd mobile && flutter run

# Access services
# API docs: http://localhost:8000/docs
# Database: docker-compose exec postgres psql -U giftsync -d giftsync_dev
```

### Infrastructure Deployment
```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file="environments/dev.tfvars"
terraform apply
```

## Business Logic Implementation

### Swipe Session Flow
1. User starts swipe session (onboarding/discovery)
2. Present category cards with Tinder-style interface
3. Capture swipe direction, timing, and context
4. Process immediately for real-time updates
5. Batch process for ML training every 5 minutes

### Recommendation Generation
1. Analyze user's swipe history and preferences
2. Generate candidate items from product catalog
3. Score items using hybrid algorithm (CF + content)
4. Apply business rules (price range, availability)
5. Return top N recommendations with explanations

### Gift Link Creation
1. User completes preference discovery session
2. Generate recommendations based on preferences
3. Create shareable link with unique token
4. Generate QR code for easy sharing
5. Track interactions and analytics

### Affiliate Revenue Flow
1. User clicks on product recommendation
2. Generate affiliate link with attribution
3. Track click and user journey
4. Monitor for conversion within attribution window
5. Calculate and track commission earnings

## Performance Requirements

### System Metrics
- API Response Time: <100ms p95
- App Load Time: <2 seconds
- Recommendation Accuracy: >75% user satisfaction
- System Availability: 99.9% uptime
- Database Query Performance: <50ms p95

### Scaling Targets
- **Year 1**: 50K users, £125K revenue
- **Year 2**: 200K users, £450K revenue
- **Year 3**: 750K users, £1.65M revenue (profitability)
- **Year 5**: 4.5M users, £8.5M revenue

## Security & Compliance

### GDPR Implementation
- **Privacy by Design**: Pseudonymized user IDs, minimal data collection
- **Data Retention**: 90 days for raw swipe data, permanent for aggregated analytics
- **User Rights**: Data export, deletion, consent management
- **Encryption**: Data at rest and in transit, secure key management

### Security Measures
- JWT authentication with refresh tokens
- Rate limiting and DDoS protection
- SQL injection prevention
- HTTPS/TLS 1.3 encryption
- Regular security audits

## Integration Points

### External APIs
- **Amazon Product Advertising API**: Primary affiliate integration
- **Commission Junction**: Secondary affiliate network
- **Firebase**: Authentication and analytics
- **Mixpanel**: Advanced user analytics
- **Stripe**: Payment processing for subscriptions

### Third-Party Services
- **SendGrid**: Transactional emails
- **Twilio**: SMS notifications
- **Sentry**: Error monitoring
- **CloudWatch**: Infrastructure monitoring

## Development Team Context

### Code Style & Standards
- **Python**: Black + isort + flake8 formatting
- **Dart/Flutter**: dart format + dart analyze
- **Commit Messages**: Conventional commits format
- **Documentation**: Comprehensive inline comments and README files

### Testing Strategy
- **Backend**: pytest with coverage requirements
- **Mobile**: Flutter test framework
- **Integration**: End-to-end testing with real services
- **Load Testing**: Performance testing for scale targets

## Critical Business Decisions Implemented

### Commission Strategy
- Average 7.5% commission rate across categories
- Revenue sharing: 80% company, 20% user incentives
- Attribution window: 30 days for conversion tracking

### User Experience
- Maximum 50 swipes per session (user fatigue prevention)
- Real-time preference updates after 10+ swipes
- Offline capability with smart caching (50 recommendations)

### ML Strategy
- Hybrid approach for accuracy and diversity
- Cold start handling with popularity fallback
- A/B testing framework for algorithm optimization

## Environment Variables Required

### Backend (.env)
```
DATABASE_URL=postgresql://giftsync:password@localhost:5432/giftsync_dev
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
MIXPANEL_TOKEN=your-token
```

### Mobile (.env)
```
API_BASE_URL=http://localhost:8000
MIXPANEL_TOKEN=your-token
FIREBASE_PROJECT_ID=giftsync-dev
```

## Outstanding Tasks & Priorities

### High Priority (Next Session)
1. Complete API endpoint implementations
2. Build mobile app screens (swipe interface priority)
3. Integrate mobile app with backend
4. Test end-to-end user flow

### Medium Priority
1. Deploy development infrastructure to AWS
2. Set up CI/CD pipeline
3. Implement monitoring and alerting
4. Load test the system

### Low Priority
1. International expansion features
2. Advanced ML features (deep learning)
3. Corporate gifting platform
4. Advanced analytics dashboard

## Contact & Collaboration Notes
- Project timeline: MVP in 6 months, market launch in 12 months
- Development approach: Agile with 2-week sprints
- Code review process: All changes require peer review
- Documentation: Keep CLAUDE.md updated with major decisions

---

**Last Updated**: December 2024
**Next Development Session**: Continue with API endpoint completion and mobile UI implementation
**Current Sprint Goal**: Complete core user journey (onboarding → swipe → recommendations → sharing)