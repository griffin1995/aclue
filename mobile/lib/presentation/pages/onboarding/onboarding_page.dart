import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lottie/lottie.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/app_constants.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingStep> _steps = [
    OnboardingStep(
      title: 'Discover Perfect Gifts',
      subtitle: 'Swipe through personalized recommendations powered by AI',
      animationAsset: 'assets/animations/gift_discovery.json',
      description: 'Our AI learns your preferences to suggest gifts that truly matter.',
    ),
    OnboardingStep(
      title: 'Swipe to Express Preferences',
      subtitle: 'Like, dislike, or love items to train your personal AI',
      animationAsset: 'assets/animations/swipe_gesture.json',
      description: 'The more you swipe, the better our recommendations become.',
    ),
    OnboardingStep(
      title: 'Share Your Wishlist',
      subtitle: 'Create beautiful gift links to share with friends and family',
      animationAsset: 'assets/animations/share_gifts.json',
      description: 'Generate shareable links that keep the surprise alive.',
    ),
    OnboardingStep(
      title: 'Never Miss the Perfect Gift',
      subtitle: 'Get notified about sales, new arrivals, and special occasions',
      animationAsset: 'assets/animations/notifications.json',
      description: 'Smart notifications help you find gifts at the right time.',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _steps.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _completeOnboarding() {
    // Mark onboarding as completed
    context.go(AppRoutes.register);
  }

  void _skipOnboarding() {
    context.go(AppRoutes.login);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      body: SafeArea(
        child: Column(
          children: [
            // Top bar with skip button
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo
                  Row(
                    children: [
                      Icon(
                        Icons.card_giftcard,
                        color: theme.colorScheme.primary,
                        size: 28,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'GiftSync',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  // Skip button
                  TextButton(
                    onPressed: _skipOnboarding,
                    child: Text(
                      'Skip',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Page indicators
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _steps.length,
                  (index) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? theme.colorScheme.primary
                          : theme.colorScheme.onSurfaceVariant.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ).animate().scale(
                    duration: 300.ms,
                    curve: Curves.easeInOut,
                  ),
                ),
              ),
            ),

            // Page view
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _steps.length,
                itemBuilder: (context, index) {
                  final step = _steps[index];
                  return Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // Animation
                        Expanded(
                          flex: 3,
                          child: Container(
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primaryContainer.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: Center(
                              child: Lottie.asset(
                                step.animationAsset,
                                width: MediaQuery.of(context).size.width * 0.7,
                                height: MediaQuery.of(context).size.width * 0.7,
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  // Fallback to icon if animation not found
                                  return Icon(
                                    _getIconForStep(index),
                                    size: 120,
                                    color: theme.colorScheme.primary,
                                  );
                                },
                              ),
                            ),
                          ).animate().fadeIn(duration: 600.ms).slideY(
                            begin: 0.3,
                            end: 0,
                            duration: 600.ms,
                            curve: Curves.easeOutBack,
                          ),
                        ),

                        const SizedBox(height: 32),

                        // Content
                        Expanded(
                          flex: 2,
                          child: Column(
                            children: [
                              Text(
                                step.title,
                                style: theme.textTheme.headlineMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: theme.colorScheme.onSurface,
                                ),
                                textAlign: TextAlign.center,
                              ).animate().fadeIn(
                                delay: 300.ms,
                                duration: 500.ms,
                              ).slideY(
                                begin: 0.2,
                                end: 0,
                                duration: 500.ms,
                              ),

                              const SizedBox(height: 16),

                              Text(
                                step.subtitle,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  color: theme.colorScheme.primary,
                                  fontWeight: FontWeight.w500,
                                ),
                                textAlign: TextAlign.center,
                              ).animate().fadeIn(
                                delay: 400.ms,
                                duration: 500.ms,
                              ).slideY(
                                begin: 0.2,
                                end: 0,
                                duration: 500.ms,
                              ),

                              const SizedBox(height: 24),

                              Text(
                                step.description,
                                style: theme.textTheme.bodyLarge?.copyWith(
                                  color: theme.colorScheme.onSurfaceVariant,
                                  height: 1.5,
                                ),
                                textAlign: TextAlign.center,
                              ).animate().fadeIn(
                                delay: 500.ms,
                                duration: 500.ms,
                              ).slideY(
                                begin: 0.2,
                                end: 0,
                                duration: 500.ms,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Navigation buttons
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                children: [
                  // Previous button
                  if (_currentPage > 0)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _previousPage,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: BorderSide(color: theme.colorScheme.outline),
                        ),
                        child: Text(
                          'Previous',
                          style: TextStyle(color: theme.colorScheme.onSurface),
                        ),
                      ).animate().fadeIn().slideX(begin: -0.2),
                    )
                  else
                    const Expanded(child: SizedBox()),

                  const SizedBox(width: 16),

                  // Next/Get Started button
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: _nextPage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.colorScheme.primary,
                        foregroundColor: theme.colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _currentPage == _steps.length - 1 ? 'Get Started' : 'Next',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ).animate().fadeIn().slideX(begin: 0.2),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconForStep(int index) {
    switch (index) {
      case 0:
        return Icons.card_giftcard;
      case 1:
        return Icons.swipe;
      case 2:
        return Icons.share;
      case 3:
        return Icons.notifications;
      default:
        return Icons.card_giftcard;
    }
  }
}

class OnboardingStep {
  final String title;
  final String subtitle;
  final String description;
  final String animationAsset;

  OnboardingStep({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.animationAsset,
  });
}