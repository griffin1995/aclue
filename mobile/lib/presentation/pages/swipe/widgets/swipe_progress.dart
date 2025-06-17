import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SwipeProgress extends StatelessWidget {
  final int current;
  final int total;
  final AnimationController? controller;

  const SwipeProgress({
    super.key,
    required this.current,
    required this.total,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final progress = total > 0 ? current / total : 0.0;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        children: [
          // Progress bar
          Container(
            height: 6,
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(3),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(3),
              child: Stack(
                children: [
                  // Background
                  Container(
                    width: double.infinity,
                    height: double.infinity,
                    color: theme.colorScheme.surfaceVariant,
                  ),
                  
                  // Progress fill
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.easeOutCubic,
                    width: MediaQuery.of(context).size.width * progress,
                    height: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          theme.colorScheme.primary,
                          theme.colorScheme.primary.withOpacity(0.8),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  
                  // Animated pulse effect
                  if (controller != null)
                    AnimatedBuilder(
                      animation: controller!,
                      builder: (context, child) {
                        return Positioned(
                          left: (MediaQuery.of(context).size.width - 48) * progress - 12,
                          top: -6,
                          child: Transform.scale(
                            scale: 1.0 + (controller!.value * 0.3),
                            child: Container(
                              width: 18,
                              height: 18,
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: theme.colorScheme.primary.withOpacity(0.5),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Progress text and stats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$current of $total',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
              ),
              
              Text(
                '${(progress * 100).toInt()}% complete',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          
          // Progress milestones
          if (total > 10)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: _ProgressMilestones(
                current: current,
                total: total,
                theme: theme,
              ),
            ),
        ],
      ),
    );
  }
}

class _ProgressMilestones extends StatelessWidget {
  final int current;
  final int total;
  final ThemeData theme;

  const _ProgressMilestones({
    required this.current,
    required this.total,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    // Define milestones at 25%, 50%, 75%, and 100%
    final milestones = [
      (total * 0.25).round(),
      (total * 0.5).round(),
      (total * 0.75).round(),
      total,
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: milestones.map((milestone) {
        final isReached = current >= milestone;
        final isNext = !isReached && current >= (milestone - (total * 0.25).round());
        
        return Column(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: isReached 
                    ? theme.colorScheme.primary 
                    : isNext 
                        ? theme.colorScheme.primary.withOpacity(0.3)
                        : theme.colorScheme.surfaceVariant,
                shape: BoxShape.circle,
              ),
            ).animate(
              target: isReached ? 1 : 0,
            ).scale(
              duration: 300.ms,
              curve: Curves.elasticOut,
            ),
            
            const SizedBox(height: 4),
            
            Text(
              '$milestone',
              style: theme.textTheme.bodySmall?.copyWith(
                color: isReached 
                    ? theme.colorScheme.primary 
                    : theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
                fontSize: 10,
                fontWeight: isReached ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        );
      }).toList(),
    );
  }
}