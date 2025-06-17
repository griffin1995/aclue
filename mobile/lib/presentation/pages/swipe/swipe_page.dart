import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
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
  int _totalSwipes = 0;
  int _likesCount = 0;
  int _dislikesCount = 0;
  
  // Sample data - in real app this would come from providers
  final List<SwipeItem> _items = [
    SwipeItem(
      id: '1',
      title: 'Wireless Headphones',
      brand: 'Sony',
      price: 199.99,
      imageUrl: 'https://via.placeholder.com/400x400/E3F2FD/1976D2?text=Headphones',
      category: 'Electronics',
      tags: ['Music', 'Premium', 'Wireless'],
    ),
    SwipeItem(
      id: '2',
      title: 'Coffee Maker',
      brand: 'Breville',
      price: 299.99,
      imageUrl: 'https://via.placeholder.com/400x400/FFF3E0/F57C00?text=Coffee+Maker',
      category: 'Kitchen',
      tags: ['Coffee', 'Morning', 'Essential'],
    ),
    SwipeItem(
      id: '3',
      title: 'Yoga Mat',
      brand: 'Lululemon',
      price: 68.00,
      imageUrl: 'https://via.placeholder.com/400x400/E8F5E8/4CAF50?text=Yoga+Mat',
      category: 'Fitness',
      tags: ['Wellness', 'Exercise', 'Mindfulness'],
    ),
    SwipeItem(
      id: '4',
      title: 'Smart Watch',
      brand: 'Apple',
      price: 399.99,
      imageUrl: 'https://via.placeholder.com/400x400/F3E5F5/9C27B0?text=Smart+Watch',
      category: 'Technology',
      tags: ['Health', 'Smart', 'Fitness'],
    ),
    SwipeItem(
      id: '5',
      title: 'Cooking Set',
      brand: 'All-Clad',
      price: 499.99,
      imageUrl: 'https://via.placeholder.com/400x400/FFF8E1/FFC107?text=Cooking+Set',
      category: 'Kitchen',
      tags: ['Cooking', 'Professional', 'Durable'],
    ),
  ];

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
    
    setState(() {
      _currentIndex = currentIndex ?? _items.length;
      _totalSwipes++;
      
      if (direction == CardSwiperDirection.right || direction == CardSwiperDirection.top) {
        _likesCount++;
      } else {
        _dislikesCount++;
      }
    });

    _progressController.forward().then((_) {
      _progressController.reset();
    });

    // Show feedback animation
    _showSwipeFeedback(direction);

    // Check if we've reached the end
    if (_currentIndex >= _items.length) {
      _onSwipeSessionComplete();
    }
  }

  void _showSwipeFeedback(CardSwiperDirection direction) {
    _feedbackController.reset();
    _feedbackController.forward();
  }

  void _onSwipeSessionComplete() {
    // Navigate to recommendations or show completion screen
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => SwipeCompletionDialog(
        totalSwipes: _totalSwipes,
        likesCount: _likesCount,
        dislikesCount: _dislikesCount,
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
            total: _items.length,
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
            child: _currentIndex < _items.length
                ? Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: CardSwiper(
                      controller: _cardController,
                      cardsCount: _items.length,
                      onSwipe: _onSwipe,
                      onUndo: (previousIndex, currentIndex, direction) {
                        setState(() {
                          _currentIndex = currentIndex;
                          _totalSwipes = _totalSwipes > 0 ? _totalSwipes - 1 : 0;
                          
                          if (direction == CardSwiperDirection.right || 
                              direction == CardSwiperDirection.top) {
                            _likesCount = _likesCount > 0 ? _likesCount - 1 : 0;
                          } else {
                            _dislikesCount = _dislikesCount > 0 ? _dislikesCount - 1 : 0;
                          }
                        });
                        return true;
                      },
                      numberOfCardsDisplayed: 3,
                      backCardOffset: const Offset(0, -10),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      cardBuilder: (context, index, horizontalThresholdPercentage, verticalThresholdPercentage) {
                        if (index >= _items.length) return const SizedBox();
                        
                        return SwipeCard(
                          item: _items[index],
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
          if (_currentIndex < _items.length)
            SwipeButtons(
              onDislike: _swipeLeft,
              onLike: _swipeRight,
              onSuperLike: _swipeUp,
              canUndo: _totalSwipes > 0,
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
                  value: _likesCount,
                  color: Colors.green,
                ),
                _StatItem(
                  icon: Icons.close,
                  label: 'Passed',
                  value: _dislikesCount,
                  color: Colors.red,
                ),
                _StatItem(
                  icon: Icons.progress_activity,
                  label: 'Progress',
                  value: _currentIndex,
                  total: _items.length,
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

class SwipeItem {
  final String id;
  final String title;
  final String brand;
  final double price;
  final String imageUrl;
  final String category;
  final List<String> tags;

  SwipeItem({
    required this.id,
    required this.title,
    required this.brand,
    required this.price,
    required this.imageUrl,
    required this.category,
    required this.tags,
  });
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