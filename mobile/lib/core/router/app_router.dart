import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../presentation/pages/splash/splash_page.dart';
import '../../presentation/pages/onboarding/onboarding_page.dart';
import '../../presentation/pages/auth/login_page.dart';
import '../../presentation/pages/auth/register_page.dart';
import '../../presentation/pages/home/home_page.dart';
import '../../presentation/pages/swipe/swipe_page.dart';
import '../../presentation/pages/recommendations/recommendations_page.dart';
import '../../presentation/pages/profile/profile_page.dart';
import '../../presentation/pages/gift_link/gift_link_page.dart';
import 'app_routes.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    routes: [
      // Splash Screen
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      
      // Onboarding
      GoRoute(
        path: AppRoutes.onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      
      // Authentication
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.register,
        name: 'register',
        builder: (context, state) => const RegisterPage(),
      ),
      
      // Main App Shell with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) {
          return Scaffold(
            body: child,
            bottomNavigationBar: _buildBottomNavigationBar(context),
          );
        },
        routes: [
          GoRoute(
            path: AppRoutes.home,
            name: 'home',
            builder: (context, state) => const HomePage(),
          ),
          GoRoute(
            path: AppRoutes.swipe,
            name: 'swipe',
            builder: (context, state) => const SwipePage(),
          ),
          GoRoute(
            path: AppRoutes.recommendations,
            name: 'recommendations',
            builder: (context, state) => const RecommendationsPage(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            name: 'profile',
            builder: (context, state) => const ProfilePage(),
          ),
        ],
      ),
      
      // Gift Link (can be accessed via deep link)
      GoRoute(
        path: '${AppRoutes.giftLink}/:linkId',
        name: 'gift-link',
        builder: (context, state) {
          final linkId = state.pathParameters['linkId']!;
          return GiftLinkPage(linkId: linkId);
        },
      ),
      
      // Error/404 Route
      GoRoute(
        path: '/404',
        name: '404',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Page not found'),
          ),
        ),
      ),
    ],
    
    // Error handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64),
            const SizedBox(height: 16),
            Text('Error: ${state.error}'),
            ElevatedButton(
              onPressed: () => context.go(AppRoutes.home),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
    
    // Redirect logic
    redirect: (context, state) {
      // Add authentication logic here
      // For now, allow all routes
      return null;
    },
  );
});

Widget _buildBottomNavigationBar(BuildContext context) {
  final currentLocation = GoRouterState.of(context).uri.path;
  
  int getCurrentIndex() {
    switch (currentLocation) {
      case AppRoutes.home:
        return 0;
      case AppRoutes.swipe:
        return 1;
      case AppRoutes.recommendations:
        return 2;
      case AppRoutes.profile:
        return 3;
      default:
        return 0;
    }
  }
  
  return BottomNavigationBar(
    currentIndex: getCurrentIndex(),
    type: BottomNavigationBarType.fixed,
    items: const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_outlined),
        activeIcon: Icon(Icons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.swipe_outlined),
        activeIcon: Icon(Icons.swipe),
        label: 'Discover',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.favorite_outline),
        activeIcon: Icon(Icons.favorite),
        label: 'For You',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person_outline),
        activeIcon: Icon(Icons.person),
        label: 'Profile',
      ),
    ],
    onTap: (index) {
      switch (index) {
        case 0:
          context.go(AppRoutes.home);
          break;
        case 1:
          context.go(AppRoutes.swipe);
          break;
        case 2:
          context.go(AppRoutes.recommendations);
          break;
        case 3:
          context.go(AppRoutes.profile);
          break;
      }
    },
  );
}