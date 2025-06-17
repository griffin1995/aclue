class AppConstants {
  static const String appName = 'GiftSync';
  static const String appTagline = 'The perfect gift, every time';
  
  // API Configuration
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8000',
  );
  
  // Analytics
  static const String mixpanelToken = String.fromEnvironment(
    'MIXPANEL_TOKEN',
    defaultValue: '',
  );
  
  // Firebase
  static const String firebaseProjectId = String.fromEnvironment(
    'FIREBASE_PROJECT_ID',
    defaultValue: 'giftsync-dev',
  );
  
  // Storage Keys
  static const String userTokenKey = 'user_token';
  static const String userPreferencesKey = 'user_preferences';
  static const String cachedRecommendationsKey = 'cached_recommendations';
  
  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double extraLargePadding = 32.0;
  
  static const double defaultBorderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 16.0;
  
  // Animation Durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 600);
  
  // Swipe Configuration
  static const int maxSwipesPerSession = 50;
  static const double swipeThreshold = 0.3;
  static const int swipeTimeoutSeconds = 10;
  
  // Recommendation Configuration
  static const int maxCachedRecommendations = 50;
  static const int recommendationsPerPage = 20;
  static const Duration recommendationCacheExpiry = Duration(hours: 24);
  
  // Affiliate Configuration
  static const double defaultCommissionRate = 0.075; // 7.5%
  static const Duration affiliateLinkExpiry = Duration(days: 30);
}