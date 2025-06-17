import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/user_model.dart';
import '../models/product_model.dart';
import '../models/swipe_model.dart';
import '../models/recommendation_model.dart';

part 'api_client.g.dart';

@RestApi()
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  // Authentication endpoints
  @POST('/auth/login')
  Future<AuthResponse> login(@Body() LoginRequest request);

  @POST('/auth/register')
  Future<AuthResponse> register(@Body() RegisterRequest request);

  @POST('/auth/refresh')
  Future<AuthResponse> refreshToken(@Body() Map<String, String> refreshToken);

  @POST('/auth/logout')
  Future<void> logout();

  // User endpoints
  @GET('/users/me')
  Future<UserModel> getCurrentUser();

  @PUT('/users/me')
  Future<UserModel> updateProfile(@Body() Map<String, dynamic> profileData);

  @DELETE('/users/me')
  Future<Map<String, String>> deleteAccount();

  // Products endpoints
  @GET('/products/')
  Future<List<ProductModel>> searchProducts({
    @Query('q') String? query,
    @Query('category') String? category,
    @Query('brand') String? brand,
    @Query('min_price') double? minPrice,
    @Query('max_price') double? maxPrice,
    @Query('sort_by') String? sortBy,
    @Query('sort_order') String? sortOrder,
    @Query('limit') int? limit,
    @Query('offset') int? offset,
  });

  @GET('/products/{productId}')
  Future<ProductModel> getProduct(@Path('productId') String productId);

  @POST('/products/{productId}/click')
  Future<Map<String, dynamic>> trackProductClick(
    @Path('productId') String productId,
    @Body() Map<String, dynamic> clickData,
  );

  @GET('/products/categories/')
  Future<List<CategoryModel>> getCategories({
    @Query('parent_id') String? parentId,
    @Query('level') int? level,
  });

  @GET('/products/brands/')
  Future<List<BrandModel>> getBrands({
    @Query('limit') int? limit,
    @Query('offset') int? offset,
    @Query('featured_only') bool? featuredOnly,
  });

  @GET('/products/featured/')
  Future<List<ProductModel>> getFeaturedProducts({
    @Query('category') String? category,
    @Query('limit') int? limit,
  });

  @GET('/products/trending/')
  Future<List<ProductModel>> getTrendingProducts({
    @Query('category') String? category,
    @Query('limit') int? limit,
  });

  // Swipe endpoints
  @POST('/swipes/sessions')
  Future<SwipeSessionModel> createSwipeSession(@Body() CreateSwipeSessionRequest request);

  @GET('/swipes/sessions')
  Future<List<SwipeSessionModel>> getSwipeSessions({
    @Query('limit') int? limit,
    @Query('offset') int? offset,
  });

  @GET('/swipes/sessions/{sessionId}')
  Future<SwipeSessionModel> getSwipeSession(@Path('sessionId') String sessionId);

  @POST('/swipes/sessions/{sessionId}/interactions')
  Future<SwipeInteractionModel> recordSwipeInteraction(
    @Path('sessionId') String sessionId,
    @Body() RecordSwipeRequest request,
  );

  @PUT('/swipes/sessions/{sessionId}/complete')
  Future<SwipeSessionModel> completeSwipeSession(
    @Path('sessionId') String sessionId,
    @Body() CompleteSessionRequest request,
  );

  @GET('/swipes/analytics/preferences')
  Future<SwipePreferencesModel> getUserPreferences();

  @GET('/swipes/analytics/patterns')
  Future<Map<String, dynamic>> getSwipePatterns();

  // Recommendations endpoints
  @GET('/recommendations/')
  Future<List<RecommendationModel>> getRecommendations({
    @Query('limit') int? limit,
    @Query('offset') int? offset,
    @Query('recommendation_type') String? recommendationType,
    @Query('occasion') String? occasion,
    @Query('price_range') String? priceRange,
  });

  @GET('/recommendations/generate')
  Future<Map<String, dynamic>> generateRecommendations({
    @Query('force_refresh') bool? forceRefresh,
    @Query('session_id') String? sessionId,
  });

  @POST('/recommendations/{recommendationId}/interact')
  Future<RecommendationInteractionModel> recordRecommendationInteraction(
    @Path('recommendationId') String recommendationId,
    @Body() RecordInteractionRequest request,
  );

  @GET('/recommendations/{recommendationId}')
  Future<RecommendationModel> getRecommendation(@Path('recommendationId') String recommendationId);

  @GET('/recommendations/analytics/performance')
  Future<RecommendationAnalyticsModel> getRecommendationAnalytics({
    @Query('days') int? days,
  });

  @DELETE('/recommendations/{recommendationId}')
  Future<Map<String, String>> dismissRecommendation(@Path('recommendationId') String recommendationId);

  // Gift Links endpoints (partial - main ones for mobile app)
  @POST('/gift-links/')
  Future<Map<String, dynamic>> createGiftLink(@Body() Map<String, dynamic> linkData);

  @GET('/gift-links/')
  Future<List<Map<String, dynamic>>> getUserGiftLinks({
    @Query('limit') int? limit,
    @Query('offset') int? offset,
    @Query('active_only') bool? activeOnly,
  });

  @GET('/gift-links/{linkToken}')
  Future<Map<String, dynamic>> accessGiftLink(@Path('linkToken') String linkToken);

  @POST('/gift-links/{linkToken}/interact')
  Future<Map<String, dynamic>> recordGiftLinkInteraction(
    @Path('linkToken') String linkToken,
    @Body() Map<String, dynamic> interactionData,
  );
}