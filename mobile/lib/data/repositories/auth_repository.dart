import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';

import '../api/api_client.dart';
import '../api/dio_config.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiClient _apiClient;
  final SharedPreferences _prefs;

  AuthRepository(this._apiClient, this._prefs);

  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userDataKey = 'user_data';

  // Authentication methods
  Future<AuthResponse> login(String email, String password) async {
    try {
      final request = LoginRequest(email: email, password: password);
      final response = await _apiClient.login(request);
      
      // Store tokens and user data
      await _storeAuthData(response);
      
      return response;
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<AuthResponse> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String? dateOfBirth,
    String? gender,
    Map<String, dynamic>? location,
  }) async {
    try {
      final request = RegisterRequest(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        gender: gender,
        location: location,
      );
      
      final response = await _apiClient.register(request);
      
      // Store tokens and user data
      await _storeAuthData(response);
      
      return response;
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await getRefreshToken();
      if (refreshToken == null) return false;

      final response = await _apiClient.refreshToken({'refresh_token': refreshToken});
      await _storeAuthData(response);
      
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.logout();
    } catch (e) {
      // Continue with local logout even if API call fails
    } finally {
      await _clearAuthData();
    }
  }

  // Token management
  Future<String?> getAccessToken() async {
    return _prefs.getString(_accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    return _prefs.getString(_refreshTokenKey);
  }

  Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  // User data management
  Future<UserModel?> getCurrentUser() async {
    try {
      // Try to get from cache first
      final cachedUser = await _getCachedUser();
      if (cachedUser != null) {
        return cachedUser;
      }

      // Fetch from API
      final user = await _apiClient.getCurrentUser();
      await _cacheUser(user);
      return user;
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<UserModel> updateProfile(Map<String, dynamic> profileData) async {
    try {
      final user = await _apiClient.updateProfile(profileData);
      await _cacheUser(user);
      return user;
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<void> deleteAccount() async {
    try {
      await _apiClient.deleteAccount();
      await _clearAuthData();
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  // Private helper methods
  Future<void> _storeAuthData(AuthResponse response) async {
    await Future.wait([
      _prefs.setString(_accessTokenKey, response.accessToken),
      _prefs.setString(_refreshTokenKey, response.refreshToken),
      _cacheUser(response.user),
    ]);
  }

  Future<void> _clearAuthData() async {
    await Future.wait([
      _prefs.remove(_accessTokenKey),
      _prefs.remove(_refreshTokenKey),
      _prefs.remove(_userDataKey),
    ]);
  }

  Future<void> _cacheUser(UserModel user) async {
    await _prefs.setString(_userDataKey, user.toJson().toString());
  }

  Future<UserModel?> _getCachedUser() async {
    try {
      final userData = _prefs.getString(_userDataKey);
      if (userData != null) {
        // Note: In a real app, you'd use proper JSON serialization
        // This is simplified for the example
        return null; // Return cached user after proper deserialization
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

// Provider for AuthRepository
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.read(dioProvider);
  final apiClient = ApiClient(dio);
  
  // Note: In a real app, you'd properly inject SharedPreferences
  // This is a simplified example
  throw UnimplementedError('SharedPreferences dependency needs to be injected');
});

// Provider that properly creates AuthRepository with dependencies
final authRepositoryProviderWithDeps = FutureProvider<AuthRepository>((ref) async {
  final dio = ref.read(dioProvider);
  final apiClient = ApiClient(dio);
  final prefs = await SharedPreferences.getInstance();
  
  return AuthRepository(apiClient, prefs);
});

// Provider for current user
final currentUserProvider = FutureProvider<UserModel?>((ref) async {
  final authRepo = await ref.read(authRepositoryProviderWithDeps.future);
  return authRepo.getCurrentUser();
});

// Provider for auth state
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthState>((ref) {
  return AuthStateNotifier(ref);
});

// Auth state classes
enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? error;

  AuthState({
    required this.status,
    this.user,
    this.error,
  });

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? error,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      error: error ?? this.error,
    );
  }
}

class AuthStateNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthStateNotifier(this._ref) : super(AuthState(status: AuthStatus.initial)) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      final authRepo = await _ref.read(authRepositoryProviderWithDeps.future);
      final isLoggedIn = await authRepo.isLoggedIn();
      
      if (isLoggedIn) {
        final user = await authRepo.getCurrentUser();
        state = AuthState(status: AuthStatus.authenticated, user: user);
      } else {
        state = AuthState(status: AuthStatus.unauthenticated);
      }
    } catch (e) {
      state = AuthState(status: AuthStatus.error, error: e.toString());
    }
  }

  Future<void> login(String email, String password) async {
    state = AuthState(status: AuthStatus.loading);
    
    try {
      final authRepo = await _ref.read(authRepositoryProviderWithDeps.future);
      final response = await authRepo.login(email, password);
      
      state = AuthState(status: AuthStatus.authenticated, user: response.user);
    } catch (e) {
      state = AuthState(status: AuthStatus.error, error: e.toString());
    }
  }

  Future<void> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String? dateOfBirth,
    String? gender,
    Map<String, dynamic>? location,
  }) async {
    state = AuthState(status: AuthStatus.loading);
    
    try {
      final authRepo = await _ref.read(authRepositoryProviderWithDeps.future);
      final response = await authRepo.register(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        gender: gender,
        location: location,
      );
      
      state = AuthState(status: AuthStatus.authenticated, user: response.user);
    } catch (e) {
      state = AuthState(status: AuthStatus.error, error: e.toString());
    }
  }

  Future<void> logout() async {
    try {
      final authRepo = await _ref.read(authRepositoryProviderWithDeps.future);
      await authRepo.logout();
      
      state = AuthState(status: AuthStatus.unauthenticated);
    } catch (e) {
      state = AuthState(status: AuthStatus.error, error: e.toString());
    }
  }

  Future<void> updateProfile(Map<String, dynamic> profileData) async {
    try {
      final authRepo = await _ref.read(authRepositoryProviderWithDeps.future);
      final user = await authRepo.updateProfile(profileData);
      
      state = state.copyWith(user: user);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}