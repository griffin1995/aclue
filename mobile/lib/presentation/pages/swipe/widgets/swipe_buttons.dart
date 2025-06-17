import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SwipeButtons extends StatefulWidget {
  final VoidCallback onDislike;
  final VoidCallback onLike;
  final VoidCallback onSuperLike;
  final VoidCallback? onUndo;
  final bool canUndo;

  const SwipeButtons({
    super.key,
    required this.onDislike,
    required this.onLike,
    required this.onSuperLike,
    this.onUndo,
    this.canUndo = false,
  });

  @override
  State<SwipeButtons> createState() => _SwipeButtonsState();
}

class _SwipeButtonsState extends State<SwipeButtons>
    with TickerProviderStateMixin {
  late AnimationController _dislikeController;
  late AnimationController _likeController;
  late AnimationController _superLikeController;
  late AnimationController _undoController;

  @override
  void initState() {
    super.initState();
    _dislikeController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _likeController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _superLikeController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _undoController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _dislikeController.dispose();
    _likeController.dispose();
    _superLikeController.dispose();
    _undoController.dispose();
    super.dispose();
  }

  void _onDislike() {
    HapticFeedback.lightImpact();
    _dislikeController.forward().then((_) {
      _dislikeController.reverse();
    });
    widget.onDislike();
  }

  void _onLike() {
    HapticFeedback.lightImpact();
    _likeController.forward().then((_) {
      _likeController.reverse();
    });
    widget.onLike();
  }

  void _onSuperLike() {
    HapticFeedback.mediumImpact();
    _superLikeController.forward().then((_) {
      _superLikeController.reverse();
    });
    widget.onSuperLike();
  }

  void _onUndo() {
    if (widget.canUndo && widget.onUndo != null) {
      HapticFeedback.lightImpact();
      _undoController.forward().then((_) {
        _undoController.reverse();
      });
      widget.onUndo!();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Undo button
          AnimatedBuilder(
            animation: _undoController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 - (_undoController.value * 0.1),
                child: _ActionButton(
                  onTap: _onUndo,
                  icon: Icons.undo,
                  color: widget.canUndo 
                      ? theme.colorScheme.outline 
                      : theme.colorScheme.outline.withOpacity(0.3),
                  backgroundColor: widget.canUndo 
                      ? theme.colorScheme.surface 
                      : theme.colorScheme.surface.withOpacity(0.5),
                  size: 48,
                  enabled: widget.canUndo,
                ),
              );
            },
          ),

          // Dislike button
          AnimatedBuilder(
            animation: _dislikeController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 + (_dislikeController.value * 0.2),
                child: _ActionButton(
                  onTap: _onDislike,
                  icon: Icons.close,
                  color: Colors.white,
                  backgroundColor: Colors.red,
                  size: 64,
                  elevation: 8,
                ),
              );
            },
          ),

          // Super like button
          AnimatedBuilder(
            animation: _superLikeController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 + (_superLikeController.value * 0.2),
                child: _ActionButton(
                  onTap: _onSuperLike,
                  icon: Icons.star,
                  color: Colors.white,
                  backgroundColor: Colors.purple,
                  size: 56,
                  elevation: 6,
                ),
              );
            },
          ),

          // Like button
          AnimatedBuilder(
            animation: _likeController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 + (_likeController.value * 0.2),
                child: _ActionButton(
                  onTap: _onLike,
                  icon: Icons.favorite,
                  color: Colors.white,
                  backgroundColor: Colors.green,
                  size: 64,
                  elevation: 8,
                ),
              );
            },
          ),

          // Info button
          _ActionButton(
            onTap: () {
              _showSwipeHelp(context);
            },
            icon: Icons.info_outline,
            color: theme.colorScheme.outline,
            backgroundColor: theme.colorScheme.surface,
            size: 48,
          ),
        ],
      ),
    );
  }

  void _showSwipeHelp(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => const SwipeHelpSheet(),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final VoidCallback onTap;
  final IconData icon;
  final Color color;
  final Color backgroundColor;
  final double size;
  final double? elevation;
  final bool enabled;

  const _ActionButton({
    required this.onTap,
    required this.icon,
    required this.color,
    required this.backgroundColor,
    required this.size,
    this.elevation,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: backgroundColor,
          shape: BoxShape.circle,
          boxShadow: elevation != null ? [
            BoxShadow(
              color: backgroundColor.withOpacity(0.3),
              blurRadius: elevation!,
              offset: Offset(0, elevation! / 2),
            ),
          ] : null,
        ),
        child: Icon(
          icon,
          color: color,
          size: size * 0.4,
        ),
      ),
    );
  }
}

class SwipeHelpSheet extends StatelessWidget {
  const SwipeHelpSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: theme.colorScheme.onSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          const SizedBox(height: 20),
          
          Text(
            'How to Swipe',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          
          const SizedBox(height: 24),
          
          const _HelpItem(
            icon: Icons.swipe_left,
            iconColor: Colors.red,
            title: 'Swipe Left or tap ✕',
            description: 'Pass on this item',
          ),
          
          const SizedBox(height: 16),
          
          const _HelpItem(
            icon: Icons.swipe_right,
            iconColor: Colors.green,
            title: 'Swipe Right or tap ♥',
            description: 'Like this item',
          ),
          
          const SizedBox(height: 16),
          
          const _HelpItem(
            icon: Icons.swipe_up,
            iconColor: Colors.purple,
            title: 'Swipe Up or tap ★',
            description: 'Love this item (super like)',
          ),
          
          const SizedBox(height: 16),
          
          const _HelpItem(
            icon: Icons.undo,
            iconColor: Colors.grey,
            title: 'Undo',
            description: 'Take back your last swipe',
          ),
          
          const SizedBox(height: 24),
          
          Text(
            'The more you swipe, the better our recommendations become!',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 24),
          
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Got it!'),
            ),
          ),
        ],
      ),
    ).animate().slideY(
      begin: 1,
      duration: 300.ms,
      curve: Curves.easeOutCubic,
    );
  }
}

class _HelpItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String description;

  const _HelpItem({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: iconColor,
            size: 24,
          ),
        ),
        
        const SizedBox(width: 16),
        
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}