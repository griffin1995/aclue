import 'package:json_annotation/json_annotation.dart';

part 'swipe_model.g.dart';

enum SwipeDirection {
  @JsonValue('left')
  left,
  @JsonValue('right')  
  right,
  @JsonValue('up')
  up,
}

@JsonSerializable()
class SwipeSessionModel {
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'session_type')
  final String sessionType;
  @JsonKey(name: 'total_swipes')
  final int totalSwipes;
  @JsonKey(name: 'likes_count')
  final int likesCount;
  @JsonKey(name: 'dislikes_count')
  final int dislikesCount;
  @JsonKey(name: 'super_likes_count')
  final int superLikesCount;
  @JsonKey(name: 'is_completed')
  final bool isCompleted;
  @JsonKey(name: 'completion_rate')
  final String? completionRate;
  @JsonKey(name: 'like_rate')
  final double likeRate;
  @JsonKey(name: 'duration_seconds')
  final int? durationSeconds;
  @JsonKey(name: 'session_start')
  final String sessionStart;
  @JsonKey(name: 'session_end')
  final String? sessionEnd;

  SwipeSessionModel({
    required this.id,
    required this.userId,
    required this.sessionType,
    required this.totalSwipes,
    required this.likesCount,
    required this.dislikesCount,
    required this.superLikesCount,
    required this.isCompleted,
    this.completionRate,
    required this.likeRate,
    this.durationSeconds,
    required this.sessionStart,
    this.sessionEnd,
  });

  factory SwipeSessionModel.fromJson(Map<String, dynamic> json) => _$SwipeSessionModelFromJson(json);
  Map<String, dynamic> toJson() => _$SwipeSessionModelToJson(this);
}

@JsonSerializable()
class SwipeInteractionModel {
  final String id;
  @JsonKey(name: 'session_id')
  final String sessionId;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'category_name')
  final String? categoryName;
  @JsonKey(name: 'content_type')
  final String contentType;
  @JsonKey(name: 'swipe_direction')
  final SwipeDirection swipeDirection;
  @JsonKey(name: 'time_viewed')
  final int? timeViewed;
  @JsonKey(name: 'swipe_order')
  final int swipeOrder;
  @JsonKey(name: 'swipe_timestamp')
  final String swipeTimestamp;
  @JsonKey(name: 'confidence_score')
  final String? confidenceScore;

  SwipeInteractionModel({
    required this.id,
    required this.sessionId,
    required this.userId,
    this.categoryName,
    required this.contentType,
    required this.swipeDirection,
    this.timeViewed,
    required this.swipeOrder,
    required this.swipeTimestamp,
    this.confidenceScore,
  });

  factory SwipeInteractionModel.fromJson(Map<String, dynamic> json) => _$SwipeInteractionModelFromJson(json);
  Map<String, dynamic> toJson() => _$SwipeInteractionModelToJson(this);
}

@JsonSerializable()
class CreateSwipeSessionRequest {
  @JsonKey(name: 'session_type')
  final String sessionType;
  @JsonKey(name: 'device_id')
  final String? deviceId;
  final String? platform;

  CreateSwipeSessionRequest({
    required this.sessionType,
    this.deviceId,
    this.platform,
  });

  factory CreateSwipeSessionRequest.fromJson(Map<String, dynamic> json) => _$CreateSwipeSessionRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateSwipeSessionRequestToJson(this);
}

@JsonSerializable()
class RecordSwipeRequest {
  @JsonKey(name: 'category_id')
  final String? categoryId;
  @JsonKey(name: 'category_name')
  final String? categoryName;
  @JsonKey(name: 'product_id')
  final String? productId;
  @JsonKey(name: 'content_type')
  final String contentType;
  @JsonKey(name: 'swipe_direction')
  final SwipeDirection swipeDirection;
  @JsonKey(name: 'time_viewed')
  final int? timeViewed;
  @JsonKey(name: 'swipe_order')
  final int swipeOrder;
  @JsonKey(name: 'swipe_velocity')
  final String? swipeVelocity;
  @JsonKey(name: 'swipe_distance')
  final String? swipeDistance;
  @JsonKey(name: 'screen_position')
  final int? screenPosition;
  @JsonKey(name: 'additional_data')
  final String? additionalData;

  RecordSwipeRequest({
    this.categoryId,
    this.categoryName,
    this.productId,
    required this.contentType,
    required this.swipeDirection,
    this.timeViewed,
    required this.swipeOrder,
    this.swipeVelocity,
    this.swipeDistance,
    this.screenPosition,
    this.additionalData,
  });

  factory RecordSwipeRequest.fromJson(Map<String, dynamic> json) => _$RecordSwipeRequestFromJson(json);
  Map<String, dynamic> toJson() => _$RecordSwipeRequestToJson(this);
}

@JsonSerializable()
class CompleteSessionRequest {
  @JsonKey(name: 'completion_rate')
  final String? completionRate;
  @JsonKey(name: 'total_session_time')
  final int? totalSessionTime;
  @JsonKey(name: 'average_time_per_swipe')
  final int? averageTimePerSwipe;

  CompleteSessionRequest({
    this.completionRate,
    this.totalSessionTime,
    this.averageTimePerSwipe,
  });

  factory CompleteSessionRequest.fromJson(Map<String, dynamic> json) => _$CompleteSessionRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CompleteSessionRequestToJson(this);
}

@JsonSerializable()
class SwipePreferencesModel {
  @JsonKey(name: 'category_preferences')
  final Map<String, double> categoryPreferences;
  @JsonKey(name: 'overall_like_rate')
  final double overallLikeRate;
  @JsonKey(name: 'total_swipes')
  final int totalSwipes;
  @JsonKey(name: 'selectivity_score')
  final double selectivityScore;

  SwipePreferencesModel({
    required this.categoryPreferences,
    required this.overallLikeRate,
    required this.totalSwipes,
    required this.selectivityScore,
  });

  factory SwipePreferencesModel.fromJson(Map<String, dynamic> json) => _$SwipePreferencesModelFromJson(json);
  Map<String, dynamic> toJson() => _$SwipePreferencesModelToJson(this);
}