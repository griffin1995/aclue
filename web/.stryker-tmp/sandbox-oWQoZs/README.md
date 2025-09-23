# aclue Web Application

**Version**: 2.0.0 | **Status**: Production Ready ✅ | **Last Updated**: 21st September 2025

A modern, enterprise-grade Progressive Web Application for AI-powered gift insights built with Next.js 14, React 18, and TypeScript.

## Features

- 🎯 **Data-Led Insights**: Personalised gift suggestions based on user preferences
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🔄 **Swipe Interface**: Tinder-style product discovery with touch and mouse support
- 🔐 **Authentication**: Secure user registration and login with JWT tokens
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and Framer Motion animations
- 🚀 **Performance Optimized**: Next.js with static generation and image optimization
- 📊 **Analytics Integration**: Built-in support for Mixpanel, Sentry, and Google Analytics
- 🌐 **PWA Ready**: Progressive Web App capabilities for mobile-like experience

## Technology Stack

- **Framework**: Next.js 14.1.0 with TypeScript 5.3
- **Runtime**: Node.js 18.20.8 (LTS)
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Animations**: Framer Motion 11.0 for smooth interactions
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query for server state, React Context for client state
- **UI Components**: Shadcn/ui, Headless UI, and Lucide React icons
- **Analytics**: PostHog 1.96 for user behaviour tracking
- **Development**: ESLint, Prettier, and TypeScript for code quality
- **Performance**: 95+ Lighthouse score, optimised for Core Web Vitals

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager
- Backend API running (see `/backend` directory)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd aclue-preprod/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WEB_URL=http://localhost:3000
   # Add other environment variables as needed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
web/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── swipe/        # Swipe interface components
│   │   ├── ui/           # Basic UI components
│   │   └── ...
│   ├── pages/            # Next.js pages
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── ...
│   ├── lib/              # Utility libraries
│   │   ├── api.ts        # API client
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── config/           # Configuration files
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── package.json
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Components

### Swipe Interface
The core feature of the app - a Tinder-style interface for discovering products:

```typescript
import { SwipeInterface } from '@/components/swipe/SwipeInterface';

<SwipeInterface
  sessionType="discovery"
  onSessionComplete={handleSessionComplete}
  onRecommendationsReady={handleRecommendationsReady}
/>
```

### API Integration
Centralized API client with automatic token management:

```typescript
import { api } from '@/lib/api';

// Login user
const response = await api.login({ email, password });

// Get recommendations
const recommendations = await api.getRecommendations();
```

### Authentication
Secure authentication with automatic token refresh:

```typescript
import { tokenManager } from '@/lib/api';

// Check if user is authenticated
const isAuthenticated = !!tokenManager.getAccessToken();
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WEB_URL` - Web application URL

### Optional
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Mixpanel analytics token
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_ENABLE_*` - Feature flags

## Deployment

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

### AWS Deployment

Deploy to AWS S3 + CloudFront using the provided script:

```bash
# From project root
./scripts/deploy-web-app.sh
```

This will:
- Build the application for production
- Upload static files to S3
- Configure CloudFront CDN
- Set up custom domain with SSL

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t aclue-web .

# Run container
docker run -p 3000:3000 aclue-web
```

## Configuration

### Tailwind CSS
Custom design system with aclue branding:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Custom purple gradient
          500: '#f03dff',
          600: '#e411f7',
          // ...
        }
      }
    }
  }
}
```

### Next.js Configuration
Optimized for performance and security:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.aclue.app'],
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers, redirects, etc.
}
```

## Performance Optimization

- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-generated pages where possible
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching**: Optimized caching strategies for static assets

## Security

- **Content Security Policy**: Configured headers for XSS protection
- **HTTPS Only**: Enforced HTTPS in production
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation**: Zod schemas for all forms
- **Token Management**: Secure JWT token storage and refresh

## Analytics & Monitoring

- **Mixpanel**: User behavior analytics
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: Traffic and conversion tracking
- **Custom Events**: Track user interactions and conversions

## Testing

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: Cypress for end-to-end testing
- **Type Safety**: Full TypeScript coverage

## Contributing

1. **Development Setup**:
   ```bash
   npm install
   npm run dev
   ```

2. **Code Style**:
   - Use TypeScript for all new files
   - Follow ESLint and Prettier configuration
   - Use conventional commit messages

3. **Testing**:
   ```bash
   npm test
   npm run type-check
   npm run lint
   ```

4. **Pull Request**:
   - Ensure all tests pass
   - Update documentation if needed
   - Follow code review guidelines

## Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure backend API is running
   - Check CORS configuration

2. **Build Errors**:
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

3. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Verify custom theme configuration

### Getting Help

- Check the [troubleshooting guide](../TROUBLESHOOTING_GUIDE.md)
- Review [Next.js documentation](https://nextjs.org/docs)
- Check [React documentation](https://react.dev)
- File an issue in the repository

## License

This project is proprietary software. All rights reserved.

## Links

- [Backend API](../backend/README.md)
- [Mobile App](../mobile/README.md)
- [Deployment Guide](../DETAILED_AWS_SETUP.md)
- [Project Documentation](../README.md)