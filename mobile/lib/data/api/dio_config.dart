import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logger/logger.dart';

import '../../core/constants/app_constants.dart';
import '../repositories/auth_repository.dart';

class DioConfig {
  static Dio createDio({String? baseUrl}) {
    final dio = Dio(BaseOptions(
      baseURL: baseUrl ?? AppConstants.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors
    dio.interceptors.addAll([
      LoggingInterceptor(),
      AuthInterceptor(),
    ]);

    return dio;
  }
}

class LoggingInterceptor extends Interceptor {
  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: false,
    ),
  );

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    _logger.d('🚀 REQUEST: ${options.method} ${options.path}');
    if (options.data != null) {
      _logger.d('📤 Request Data: ${options.data}');
    }
    if (options.queryParameters.isNotEmpty) {
      _logger.d('🔍 Query Parameters: ${options.queryParameters}');
    }
    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _logger.i('✅ RESPONSE: ${response.statusCode} ${response.requestOptions.path}');
    if (response.data != null) {
      _logger.d('📥 Response Data: ${response.data}');
    }
    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _logger.e(
      '❌ ERROR: ${err.response?.statusCode} ${err.requestOptions.path}',
      error: err.message,
      stackTrace: err.stackTrace,
    );
    if (err.response?.data != null) {
      _logger.e('📥 Error Response: ${err.response?.data}');
    }
    super.onError(err, handler);
  }
}

class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Add auth token to requests
    final container = ProviderContainer();
    try {
      final authRepo = container.read(authRepositoryProvider);
      final token = await authRepo.getAccessToken();
      
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      // Token might not be available (e.g., during login)
      // Continue without token
    } finally {
      container.dispose();
    }
    
    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Token expired, try to refresh
      final container = ProviderContainer();
      try {
        final authRepo = container.read(authRepositoryProvider);
        final refreshed = await authRepo.refreshToken();
        
        if (refreshed) {
          // Retry the original request with new token
          final token = await authRepo.getAccessToken();
          if (token != null) {
            final retryOptions = err.requestOptions.copyWith();
            retryOptions.headers['Authorization'] = 'Bearer $token';
            
            final dio = DioConfig.createDio();
            final response = await dio.fetch(retryOptions);
            handler.resolve(response);
            return;
          }
        }
        
        // Refresh failed, logout user
        await authRepo.logout();
      } catch (e) {
        // Refresh failed, continue with original error
      } finally {
        container.dispose();
      }
    }
    
    super.onError(err, handler);
  }
}

// Provider for Dio instance
final dioProvider = Provider<Dio>((ref) {
  return DioConfig.createDio();
});

// Custom exception class
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  factory ApiException.fromDioError(DioException error) {
    String message;
    int? statusCode = error.response?.statusCode;

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'Connection timeout. Please check your internet connection.';
        break;
      case DioExceptionType.badResponse:
        message = _extractErrorMessage(error.response?.data) ?? 
                 'Server error (${error.response?.statusCode})';
        break;
      case DioExceptionType.cancel:
        message = 'Request was cancelled';
        break;
      case DioExceptionType.connectionError:
        message = 'No internet connection. Please check your network.';
        break;
      case DioExceptionType.badCertificate:
        message = 'Certificate error. Please try again.';
        break;
      case DioExceptionType.unknown:
      default:
        message = 'An unexpected error occurred. Please try again.';
        break;
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      data: error.response?.data,
    );
  }

  static String? _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data['detail'] as String? ?? 
             data['message'] as String? ?? 
             data['error'] as String?;
    }
    return null;
  }

  @override
  String toString() => 'ApiException: $message';
}

// Extension to simplify error handling
extension DioErrorExtension on DioException {
  ApiException get apiException => ApiException.fromDioError(this);
}