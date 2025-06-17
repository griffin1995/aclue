import 'package:json_annotation/json_annotation.dart';
import 'product_model.dart';

part 'recommendation_model.g.dart';

enum RecommendationType {
  @JsonValue('collaborative')
  collaborative,
  @JsonValue('content_based')
  contentBased,
  @JsonValue('hybrid')
  hybrid,
  @JsonValue('trending')
  trending,
  @JsonValue('seasonal')
  seasonal,
  @JsonValue('personalized')
  personalized,
}

enum RecommendationStatus {
  @JsonValue('active')
  active,
  @JsonValue('expired')
  expired,
  @JsonValue('dismissed')
  dismissed,
  @JsonValue('purchased')
  purchased,
}

enum InteractionType {
  @JsonValue('view')
  view,
  @JsonValue('click')
  click,
  @JsonValue('like')
  like,
  @JsonValue('dislike')
  dislike,
  @JsonValue('save')
  save,
  @JsonValue('share')
  share,
  @JsonValue('purchase')
  purchase,
  @JsonValue('dismiss')
  dismiss,
  @JsonValue('add_to_cart')
  addToCart,
  @JsonValue('compare')
  compare,
}

@JsonSerializable()
class RecommendationModel {
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'product_id')
  final String productId;
  @JsonKey(name: 'recommendation_type')
  final RecommendationType recommendationType;
  @JsonKey(name: 'confidence_score')
  final double confidenceScore;
  @JsonKey(name: 'relevance_score')
  final double? relevanceScore;
  final String? explanation;
  @JsonKey(name: 'rank_position')
  final int? rankPosition;
  final RecommendationStatus status;
  final String? occasion;
  @JsonKey(name: 'created_at')
  final String createdAt;
  @JsonKey(name: 'expires_at')
  final String? expiresAt;
  final ProductModel? product;
  @JsonKey(name: 'interaction_count')
  final int? interactionCount;

  RecommendationModel({
    required this.id,
    required this.userId,
    required this.productId,
    required this.recommendationType,
    required this.confidenceScore,
    this.relevanceScore,
    this.explanation,
    this.rankPosition,
    required this.status,
    this.occasion,
    required this.createdAt,
    this.expiresAt,
    this.product,
    this.interactionCount,
  });

  factory RecommendationModel.fromJson(Map<String, dynamic> json) => _$RecommendationModelFromJson(json);
  Map<String, dynamic> toJson() => _$RecommendationModelToJson(this);

  // Helper getters
  String get confidencePercentage => '${(confidenceScore * 100).toInt()}%';
  
  bool get isHighConfidence => confidenceScore >= 0.8;
  
  String get typeDisplayName {
    switch (recommendationType) {
      case RecommendationType.collaborative:
        return 'People also liked';
      case RecommendationType.contentBased:
        return 'Similar to your interests';
      case RecommendationType.hybrid:
        return 'Recommended for you';
      case RecommendationType.trending:
        return 'Trending now';
      case RecommendationType.seasonal:
        return 'Perfect for the season';
      case RecommendationType.personalized:
        return 'Made just for you';
    }
  }
}

@JsonSerializable()
class RecordInteractionRequest {
  @JsonKey(name: 'interaction_type')
  final InteractionType interactionType;
  @JsonKey(name: 'session_id')
  final String? sessionId;
  @JsonKey(name: 'device_type')
  final String? deviceType;
  final String? platform;
  @JsonKey(name: 'time_to_interaction')
  final int? timeToInteraction;
  @JsonKey(name: 'interaction_duration')
  final int? interactionDuration;
  @JsonKey(name: 'purchase_amount')
  final double? purchaseAmount;
  @JsonKey(name: 'commission_amount')
  final double? commissionAmount;
  @JsonKey(name: 'order_id')
  final String? orderId;
  @JsonKey(name: 'page_position')
  final int? pagePosition;
  final String? referrer;
  final String? metadata;

  RecordInteractionRequest({
    required this.interactionType,
    this.sessionId,
    this.deviceType,
    this.platform,
    this.timeToInteraction,
    this.interactionDuration,
    this.purchaseAmount,
    this.commissionAmount,
    this.orderId,
    this.pagePosition,
    this.referrer,
    this.metadata,
  });

  factory RecordInteractionRequest.fromJson(Map<String, dynamic> json) => _$RecordInteractionRequestFromJson(json);
  Map<String, dynamic> toJson() => _$RecordInteractionRequestToJson(this);
}

@JsonSerializable()
class RecommendationInteractionModel {
  final String id;
  @JsonKey(name: 'recommendation_id')
  final String recommendationId;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'interaction_type')
  final InteractionType interactionType;
  @JsonKey(name: 'interaction_timestamp')
  final String interactionTimestamp;
  @JsonKey(name: 'time_to_interaction')
  final int? timeToInteraction;
  @JsonKey(name: 'purchase_amount')
  final double? purchaseAmount;
  @JsonKey(name: 'commission_amount')
  final double? commissionAmount;
  final String? platform;
  @JsonKey(name: 'device_type')
  final String? deviceType;

  RecommendationInteractionModel({
    required this.id,
    required this.recommendationId,
    required this.userId,
    required this.interactionType,
    required this.interactionTimestamp,
    this.timeToInteraction,
    this.purchaseAmount,
    this.commissionAmount,
    this.platform,
    this.deviceType,
  });

  factory RecommendationInteractionModel.fromJson(Map<String, dynamic> json) => _$RecommendationInteractionModelFromJson(json);
  Map<String, dynamic> toJson() => _$RecommendationInteractionModelToJson(this);
}

@JsonSerializable()
class RecommendationAnalyticsModel {
  @JsonKey(name: 'period_days')
  final int periodDays;
  @JsonKey(name: 'performance_metrics')
  final PerformanceMetrics performanceMetrics;
  @JsonKey(name: 'top_categories')
  final List<CategoryPerformance> topCategories;
  @JsonKey(name: 'recommendation_types')
  final Map<String, int> recommendationTypes;

  RecommendationAnalyticsModel({
    required this.periodDays,
    required this.performanceMetrics,
    required this.topCategories,
    required this.recommendationTypes,
  });

  factory RecommendationAnalyticsModel.fromJson(Map<String, dynamic> json) => _$RecommendationAnalyticsModelFromJson(json);
  Map<String, dynamic> toJson() => _$RecommendationAnalyticsModelToJson(this);
}

@JsonSerializable()
class PerformanceMetrics {
  @JsonKey(name: 'total_recommendations')
  final int totalRecommendations;
  @JsonKey(name: 'view_rate')
  final double viewRate;
  @JsonKey(name: 'click_through_rate')
  final double clickThroughRate;
  @JsonKey(name: 'conversion_rate')
  final double conversionRate;
  @JsonKey(name: 'total_revenue')
  final double totalRevenue;
  @JsonKey(name: 'revenue_per_recommendation')
  final double revenuePerRecommendation;

  PerformanceMetrics({
    required this.totalRecommendations,
    required this.viewRate,
    required this.clickThroughRate,
    required this.conversionRate,
    required this.totalRevenue,
    required this.revenuePerRecommendation,
  });

  factory PerformanceMetrics.fromJson(Map<String, dynamic> json) => _$PerformanceMetricsFromJson(json);
  Map<String, dynamic> toJson() => _$PerformanceMetricsToJson(this);
}

@JsonSerializable()
class CategoryPerformance {
  final String category;
  final int total;
  final int conversions;
  final double revenue;
  @JsonKey(name: 'conversion_rate')
  final double conversionRate;

  CategoryPerformance({
    required this.category,
    required this.total,
    required this.conversions,
    required this.revenue,
    required this.conversionRate,
  });

  factory CategoryPerformance.fromJson(Map<String, dynamic> json) => _$CategoryPerformanceFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryPerformanceToJson(this);
}