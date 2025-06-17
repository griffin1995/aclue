import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/repositories/swipe_repository.dart';
import '../../../data/repositories/product_repository.dart';
import '../../../data/models/swipe_model.dart';
import '../../../data/models/product_model.dart';
import 'widgets/swipe_card.dart';
import 'widgets/swipe_buttons.dart';
import 'widgets/swipe_progress.dart';

class SwipePage extends ConsumerStatefulWidget {
  const SwipePage({super.key});

  @override
  ConsumerState<SwipePage> createState() => _SwipePageState();
}

class _SwipePageState extends ConsumerState<SwipePage>
    with TickerProviderStateMixin {
  final CardSwiperController _cardController = CardSwiperController();
  
  late AnimationController _progressController;
  late AnimationController _feedbackController;
  
  int _currentIndex = 0;
  List<ProductModel> _products = [];
  bool _isLoadingProducts = true;

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _feedbackController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _initializeSwipeSession();
  }

  Future<void> _initializeSwipeSession() async {
    // Start a swipe session and load products
    final swipeNotifier = ref.read(activeSwipeSessionProvider.notifier);
    await swipeNotifier.startSession(
      sessionType: 'onboarding',
      platform: 'mobile',
    );

    // Load featured products for swiping
    final productBrowser = ref.read(productBrowserProvider.notifier);
    await productBrowser.searchProducts(ProductSearchParams(
      limit: 20,
      sortBy: 'popularity',
      sortOrder: 'desc',
    ));
  }

  @override
  void dispose() {
    _progressController.dispose();
    _feedbackController.dispose();
    _cardController.dispose();
    super.dispose();
  }

  void _onSwipe(int previousIndex, int? currentIndex, CardSwiperDirection direction) {
    HapticFeedback.lightImpact();
    
    final products = ref.read(productBrowserProvider).products;
    if (products.isEmpty || previousIndex >= products.length) return;
    
    final product = products[previousIndex];
    
    setState(() {
      _currentIndex = currentIndex ?? products.length;
    });

    // Record the swipe interaction
    final swipeNotifier = ref.read(activeSwipeSessionProvider.notifier);
    swipeNotifier.recordSwipe(
      productId: product.id,
      contentType: 'product',
      direction: _mapCardDirectionToSwipeDirection(direction),
      categoryName: product.primaryCategory,
    );

    _progressController.forward().then((_) {
      _progressController.reset();
    });

    // Show feedback animation
    _showSwipeFeedback(direction);

    // Check if we've reached the end
    if (_currentIndex >= products.length) {
      _onSwipeSessionComplete();
    }
  }

  SwipeDirection _mapCardDirectionToSwipeDirection(CardSwiperDirection direction) {
    switch (direction) {
      case CardSwiperDirection.left:
        return SwipeDirection.left;
      case CardSwiperDirection.right:
        return SwipeDirection.right;
      case CardSwiperDirection.top:
        return SwipeDirection.up;
      default:
        return SwipeDirection.left;
    }
  }

  void _showSwipeFeedback(CardSwiperDirection direction) {
    _feedbackController.reset();
    _feedbackController.forward();
  }

  void _onSwipeSessionComplete() {
    final swipeSession = ref.read(activeSwipeSessionProvider);
    final swipeNotifier = ref.read(activeSwipeSessionProvider.notifier);
    
    // Complete the session
    swipeNotifier.completeSession(
      completionRate: '100%',
      totalSessionTime: DateTime.now().difference(
        DateTime.parse(swipeSession.session?.sessionStart ?? DateTime.now().toIso8601String())
      ).inSeconds,
    );

    // Navigate to recommendations or show completion screen
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => SwipeCompletionDialog(
        totalSwipes: swipeNotifier.totalSwipes,
        likesCount: swipeNotifier.likesCount,
        dislikesCount: swipeNotifier.dislikesCount,
        onContinue: () {
          Navigator.of(context).pop();
          // Navigate to recommendations
        },
      ),
    );
  }

  void _swipeLeft() {
    _cardController.swipe(CardSwiperDirection.left);
  }

  void _swipeRight() {
    _cardController.swipe(CardSwiperDirection.right);
  }

  void _swipeUp() {
    _cardController.swipe(CardSwiperDirection.top);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    final productBrowserState = ref.watch(productBrowserProvider);
    final swipeSessionState = ref.watch(activeSwipeSessionProvider);
    final products = productBrowserState.products;
    
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Discover Gifts',
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {
              // Show help or skip
            },
            icon: const Icon(Icons.help_outline),
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          SwipeProgress(
            current: _currentIndex,
            total: products.length,
            controller: _progressController,
          ).animate().fadeIn(),

          // Instructions
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Text(
              'Swipe right to like, left to pass, or up to love!',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
          ).animate().fadeIn(delay: 300.ms),

          // Card stack
          Expanded(
            child: productBrowserState.isLoading
                ? const Center(
                    child: CircularProgressIndicator(),
                  )
                : _currentIndex < products.length
                    ? Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: CardSwiper(
                          controller: _cardController,
                          cardsCount: products.length,
                          onSwipe: _onSwipe,
                          onUndo: (previousIndex, currentIndex, direction) {
                            setState(() {
                              _currentIndex = currentIndex;
                            });
                            return true;
                          },
                          numberOfCardsDisplayed: 3,
                          backCardOffset: const Offset(0, -10),
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          cardBuilder: (context, index, horizontalThresholdPercentage, verticalThresholdPercentage) {
                            if (index >= products.length) return const SizedBox();
                            
                            return SwipeCard(
                              product: products[index],
                              horizontalThreshold: horizontalThresholdPercentage,
                              verticalThreshold: verticalThresholdPercentage,
                            );
                          },
                        ),
                      )
                : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.favorite,
                          size: 80,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Great job!',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Getting your recommendations ready...',
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(),
          ),

          // Action buttons
          if (_currentIndex < products.length && !productBrowserState.isLoading)
            SwipeButtons(
              onDislike: _swipeLeft,
              onLike: _swipeRight,
              onSuperLike: _swipeUp,
              canUndo: swipeSessionState.interactions.isNotEmpty,
              onUndo: () {
                _cardController.undo();
              },
            ).animate().slideY(
              begin: 1,
              duration: 500.ms,
              curve: Curves.easeOutBack,
            ),

          // Stats
          Container(
            padding: const EdgeInsets.all(24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _StatItem(
                  icon: Icons.favorite,
                  label: 'Liked',
                  value: swipeSessionState.interactions
                      .where((i) => i.swipeDirection == SwipeDirection.right || i.swipeDirection == SwipeDirection.up)
                      .length,
                  color: Colors.green,
                ),
                _StatItem(
                  icon: Icons.close,
                  label: 'Passed',
                  value: swipeSessionState.interactions
                      .where((i) => i.swipeDirection == SwipeDirection.left)
                      .length,
                  color: Colors.red,
                ),
                _StatItem(
                  icon: Icons.progress_activity,
                  label: 'Progress',
                  value: _currentIndex,
                  total: products.length,
                  color: theme.colorScheme.primary,
                ),
              ],
            ),
          ).animate().fadeIn(delay: 600.ms),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final int value;
  final int? total;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.label,
    required this.value,
    this.total,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      children: [
        Icon(
          icon,
          color: color,
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          total != null ? '$value/$total' : '$value',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

class SwipeCompletionDialog extends StatelessWidget {
  final int totalSwipes;
  final int likesCount;
  final int dislikesCount;
  final VoidCallback onContinue;

  const SwipeCompletionDialog({
    super.key,
    required this.totalSwipes,
    required this.likesCount,
    required this.dislikesCount,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.celebration,
              size: 64,
              color: theme.colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Session Complete!',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'You swiped on $totalSwipes items and liked $likesCount of them.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onContinue,
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: theme.colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('See My Recommendations'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}