import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

import '../api/api_client.dart';
import '../api/dio_config.dart';
import '../models/swipe_model.dart';

class SwipeRepository {
  final ApiClient _apiClient;

  SwipeRepository(this._apiClient);

  // Session management
  Future<SwipeSessionModel> createSession({
    required String sessionType,
    String? deviceId,
    String? platform,
  }) async {
    try {
      final request = CreateSwipeSessionRequest(
        sessionType: sessionType,
        deviceId: deviceId,
        platform: platform,
      );
      
      return await _apiClient.createSwipeSession(request);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<List<SwipeSessionModel>> getSessions({
    int? limit,
    int? offset,
  }) async {
    try {
      return await _apiClient.getSwipeSessions(
        limit: limit,
        offset: offset,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<SwipeSessionModel> getSession(String sessionId) async {
    try {
      return await _apiClient.getSwipeSession(sessionId);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<SwipeSessionModel> completeSession(
    String sessionId, {
    String? completionRate,
    int? totalSessionTime,
    int? averageTimePerSwipe,
  }) async {
    try {
      final request = CompleteSessionRequest(
        completionRate: completionRate,
        totalSessionTime: totalSessionTime,
        averageTimePerSwipe: averageTimePerSwipe,
      );
      
      return await _apiClient.completeSwipeSession(sessionId, request);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  // Interaction recording
  Future<SwipeInteractionModel> recordInteraction(
    String sessionId, {
    String? categoryId,
    String? categoryName,
    String? productId,
    required String contentType,
    required SwipeDirection direction,
    int? timeViewed,
    required int swipeOrder,
    String? swipeVelocity,
    String? swipeDistance,
    int? screenPosition,
    String? additionalData,
  }) async {
    try {
      final request = RecordSwipeRequest(
        categoryId: categoryId,
        categoryName: categoryName,
        productId: productId,
        contentType: contentType,
        swipeDirection: direction,
        timeViewed: timeViewed,
        swipeOrder: swipeOrder,
        swipeVelocity: swipeVelocity,
        swipeDistance: swipeDistance,
        screenPosition: screenPosition,
        additionalData: additionalData,
      );
      
      return await _apiClient.recordSwipeInteraction(sessionId, request);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  // Analytics
  Future<SwipePreferencesModel> getUserPreferences() async {
    try {
      return await _apiClient.getUserPreferences();
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<Map<String, dynamic>> getSwipePatterns() async {
    try {
      return await _apiClient.getSwipePatterns();
    } on DioException catch (e) {
      throw e.apiException;
    }
  }
}

// Provider for SwipeRepository
final swipeRepositoryProvider = Provider<SwipeRepository>((ref) {
  final dio = ref.read(dioProvider);
  final apiClient = ApiClient(dio);
  return SwipeRepository(apiClient);
});

// Providers for swipe data
final swipeSessionsProvider = FutureProvider.family<List<SwipeSessionModel>, SwipeSessionsParams?>((ref, params) async {
  final repository = ref.read(swipeRepositoryProvider);
  return repository.getSessions(
    limit: params?.limit,
    offset: params?.offset,
  );
});

final swipeSessionProvider = FutureProvider.family<SwipeSessionModel, String>((ref, sessionId) async {
  final repository = ref.read(swipeRepositoryProvider);
  return repository.getSession(sessionId);
});

final userPreferencesProvider = FutureProvider<SwipePreferencesModel>((ref) async {
  final repository = ref.read(swipeRepositoryProvider);
  return repository.getUserPreferences();
});

final swipePatternsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final repository = ref.read(swipeRepositoryProvider);
  return repository.getSwipePatterns();
});

// State management for active swipe session
final activeSwipeSessionProvider = StateNotifierProvider<ActiveSwipeSessionNotifier, ActiveSwipeSessionState>((ref) {
  return ActiveSwipeSessionNotifier(ref);
});

// Supporting classes
class SwipeSessionsParams {
  final int? limit;
  final int? offset;

  SwipeSessionsParams({this.limit, this.offset});
}

class ActiveSwipeSessionState {
  final SwipeSessionModel? session;
  final List<SwipeInteractionModel> interactions;
  final bool isLoading;
  final String? error;

  ActiveSwipeSessionState({
    this.session,
    this.interactions = const [],
    this.isLoading = false,
    this.error,
  });

  ActiveSwipeSessionState copyWith({
    SwipeSessionModel? session,
    List<SwipeInteractionModel>? interactions,
    bool? isLoading,
    String? error,
  }) {
    return ActiveSwipeSessionState(
      session: session ?? this.session,
      interactions: interactions ?? this.interactions,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class ActiveSwipeSessionNotifier extends StateNotifier<ActiveSwipeSessionState> {
  final Ref _ref;

  ActiveSwipeSessionNotifier(this._ref) : super(ActiveSwipeSessionState());

  Future<void> startSession({
    required String sessionType,
    String? deviceId,
    String? platform,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final repository = _ref.read(swipeRepositoryProvider);
      final session = await repository.createSession(
        sessionType: sessionType,
        deviceId: deviceId,
        platform: platform,
      );
      
      state = state.copyWith(
        session: session,
        interactions: [],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> recordSwipe({
    String? categoryId,
    String? categoryName,
    String? productId,
    required String contentType,
    required SwipeDirection direction,
    int? timeViewed,
    String? swipeVelocity,
    String? swipeDistance,
    int? screenPosition,
    String? additionalData,
  }) async {
    final session = state.session;
    if (session == null) return;

    try {
      final repository = _ref.read(swipeRepositoryProvider);
      final interaction = await repository.recordInteraction(
        session.id,
        categoryId: categoryId,
        categoryName: categoryName,
        productId: productId,
        contentType: contentType,
        direction: direction,
        timeViewed: timeViewed,
        swipeOrder: state.interactions.length + 1,
        swipeVelocity: swipeVelocity,
        swipeDistance: swipeDistance,
        screenPosition: screenPosition,
        additionalData: additionalData,
      );

      state = state.copyWith(
        interactions: [...state.interactions, interaction],
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> completeSession({
    String? completionRate,
    int? totalSessionTime,
    int? averageTimePerSwipe,
  }) async {
    final session = state.session;
    if (session == null) return;

    state = state.copyWith(isLoading: true);

    try {
      final repository = _ref.read(swipeRepositoryProvider);
      final completedSession = await repository.completeSession(
        session.id,
        completionRate: completionRate,
        totalSessionTime: totalSessionTime,
        averageTimePerSwipe: averageTimePerSwipe,
      );

      state = state.copyWith(
        session: completedSession,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  void clearSession() {
    state = ActiveSwipeSessionState();
  }

  // Helper getters
  int get totalSwipes => state.interactions.length;
  
  int get likesCount => state.interactions
      .where((i) => i.swipeDirection == SwipeDirection.right || i.swipeDirection == SwipeDirection.up)
      .length;
  
  int get dislikesCount => state.interactions
      .where((i) => i.swipeDirection == SwipeDirection.left)
      .length;
  
  int get superLikesCount => state.interactions
      .where((i) => i.swipeDirection == SwipeDirection.up)
      .length;
  
  double get likeRate => totalSwipes > 0 ? likesCount / totalSwipes : 0.0;
}