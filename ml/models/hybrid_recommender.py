import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional, Union
import logging

from .base_recommender import BaseRecommender
from .collaborative_filtering import CollaborativeFilteringRecommender
from .content_based import ContentBasedRecommender

logger = logging.getLogger(__name__)


class HybridRecommender(BaseRecommender):
    """
    Hybrid recommender that combines collaborative filtering and content-based approaches.
    
    This model uses multiple recommendation strategies and combines their scores
    to provide more robust and diverse recommendations.
    """
    
    def __init__(self,
                 collaborative_weight: float = 0.6,
                 content_weight: float = 0.4,
                 min_interactions_for_cf: int = 5,
                 diversity_factor: float = 0.1,
                 **kwargs):
        super().__init__(model_name="hybrid_recommender", version="1.0.0")
        
        self.collaborative_weight = collaborative_weight
        self.content_weight = content_weight
        self.min_interactions_for_cf = min_interactions_for_cf
        self.diversity_factor = diversity_factor
        
        # Ensure weights sum to 1
        total_weight = collaborative_weight + content_weight
        self.collaborative_weight = collaborative_weight / total_weight
        self.content_weight = content_weight / total_weight
        
        # Initialize sub-models
        self.collaborative_model = CollaborativeFilteringRecommender(**kwargs.get('cf_params', {}))
        self.content_model = ContentBasedRecommender(**kwargs.get('cb_params', {}))
        
        # User interaction counts (for determining which models to use)
        self.user_interaction_counts = {}
        
        # Model performance tracking
        self.model_performance = {
            'collaborative': {'precision': 0.0, 'recall': 0.0, 'diversity': 0.0},
            'content': {'precision': 0.0, 'recall': 0.0, 'diversity': 0.0},
            'hybrid': {'precision': 0.0, 'recall': 0.0, 'diversity': 0.0}
        }
    
    def fit(self, 
            user_interactions: pd.DataFrame,
            product_features: pd.DataFrame,
            user_features: Optional[pd.DataFrame] = None,
            **kwargs) -> None:
        """
        Train both collaborative filtering and content-based models.
        
        Args:
            user_interactions: DataFrame with columns [user_id, product_id, rating, timestamp]
            product_features: DataFrame with product metadata and features
            user_features: Optional DataFrame with user features
        """
        logger.info("Starting hybrid model training...")
        
        # Calculate user interaction counts
        self.user_interaction_counts = (
            user_interactions.groupby('user_id').size().to_dict()
        )
        
        # Train collaborative filtering model
        logger.info("Training collaborative filtering component...")
        try:
            self.collaborative_model.fit(
                user_interactions=user_interactions,
                product_features=product_features,
                user_features=user_features,
                **kwargs
            )
            logger.info("Collaborative filtering training completed")
        except Exception as e:
            logger.error(f"Collaborative filtering training failed: {e}")
            self.collaborative_model = None
        
        # Train content-based model
        logger.info("Training content-based component...")
        try:
            self.content_model.fit(
                user_interactions=user_interactions,
                product_features=product_features,
                user_features=user_features,
                **kwargs
            )
            logger.info("Content-based training completed")
        except Exception as e:
            logger.error(f"Content-based training failed: {e}")
            self.content_model = None
        
        if self.collaborative_model is None and self.content_model is None:
            raise ValueError("Both collaborative and content-based models failed to train")
        
        self.is_trained = True
        self.training_timestamp = pd.Timestamp.now()
        
        # Store metadata
        self.metadata = {
            'collaborative_weight': self.collaborative_weight,
            'content_weight': self.content_weight,
            'min_interactions_for_cf': self.min_interactions_for_cf,
            'num_users': len(self.user_interaction_counts),
            'users_with_sufficient_interactions': sum(
                1 for count in self.user_interaction_counts.values() 
                if count >= self.min_interactions_for_cf
            ),
            'collaborative_model_trained': self.collaborative_model is not None,
            'content_model_trained': self.content_model is not None
        }
        
        logger.info("Hybrid model training completed!")
    
    def predict(self, 
                user_id: str, 
                candidate_items: Optional[List[str]] = None,
                num_recommendations: int = 20,
                **kwargs) -> List[Dict[str, Any]]:
        """Generate hybrid recommendations for a user."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Determine which models to use for this user
        user_interaction_count = self.user_interaction_counts.get(user_id, 0)
        use_collaborative = (
            self.collaborative_model is not None and 
            user_interaction_count >= self.min_interactions_for_cf
        )
        use_content = self.content_model is not None
        
        # Get recommendations from available models
        cf_recommendations = []
        cb_recommendations = []
        
        if use_collaborative:
            try:
                cf_recommendations = self.collaborative_model.predict(
                    user_id=user_id,
                    candidate_items=candidate_items,
                    num_recommendations=num_recommendations * 2,  # Get more for diversity
                    **kwargs
                )
                logger.debug(f"Got {len(cf_recommendations)} collaborative recommendations")
            except Exception as e:
                logger.error(f"Collaborative filtering prediction failed: {e}")
                cf_recommendations = []
        
        if use_content:
            try:
                cb_recommendations = self.content_model.predict(
                    user_id=user_id,
                    candidate_items=candidate_items,
                    num_recommendations=num_recommendations * 2,  # Get more for diversity
                    **kwargs
                )
                logger.debug(f"Got {len(cb_recommendations)} content-based recommendations")
            except Exception as e:
                logger.error(f"Content-based prediction failed: {e}")
                cb_recommendations = []
        
        # Combine recommendations
        if cf_recommendations and cb_recommendations:
            # Both models available - create hybrid
            hybrid_recommendations = self._combine_recommendations(
                cf_recommendations, cb_recommendations, num_recommendations
            )
        elif cf_recommendations:
            # Only collaborative filtering available
            hybrid_recommendations = self._process_single_model_recommendations(
                cf_recommendations, "collaborative", num_recommendations
            )
        elif cb_recommendations:
            # Only content-based available
            hybrid_recommendations = self._process_single_model_recommendations(
                cb_recommendations, "content_based", num_recommendations
            )
        else:
            # No recommendations available
            hybrid_recommendations = []
        
        # Apply diversity boosting
        if self.diversity_factor > 0:
            hybrid_recommendations = self._boost_diversity(
                hybrid_recommendations, self.diversity_factor
            )
        
        return hybrid_recommendations[:num_recommendations]
    
    def _combine_recommendations(self, 
                               cf_recs: List[Dict[str, Any]], 
                               cb_recs: List[Dict[str, Any]], 
                               num_recommendations: int) -> List[Dict[str, Any]]:
        """Combine recommendations from collaborative filtering and content-based models."""
        
        # Create item score dictionaries
        cf_scores = {rec['item_id']: rec for rec in cf_recs}
        cb_scores = {rec['item_id']: rec for rec in cb_recs}
        
        # Get all unique items
        all_items = set(cf_scores.keys()) | set(cb_scores.keys())
        
        combined_recommendations = []
        
        for item_id in all_items:
            cf_rec = cf_scores.get(item_id)
            cb_rec = cb_scores.get(item_id)
            
            # Calculate combined score
            cf_score = cf_rec['score'] if cf_rec else 0.0
            cb_score = cb_rec['score'] if cb_rec else 0.0
            
            combined_score = (
                self.collaborative_weight * cf_score + 
                self.content_weight * cb_score
            )
            
            # Calculate combined confidence
            cf_confidence = cf_rec['confidence'] if cf_rec else 0.0
            cb_confidence = cb_rec['confidence'] if cb_rec else 0.0
            
            combined_confidence = (
                self.collaborative_weight * cf_confidence + 
                self.content_weight * cb_confidence
            )
            
            # Create explanation
            explanations = []
            if cf_rec:
                explanations.append("similar users' preferences")
            if cb_rec:
                explanations.append("product features matching your taste")
            
            explanation = f"Recommended based on {' and '.join(explanations)}"
            
            # Combine metadata
            metadata = {
                'model_type': 'hybrid',
                'cf_score': cf_score,
                'cb_score': cb_score,
                'cf_weight': self.collaborative_weight,
                'cb_weight': self.content_weight,
                'has_cf': cf_rec is not None,
                'has_cb': cb_rec is not None
            }
            
            if cf_rec:
                metadata['cf_metadata'] = cf_rec.get('metadata', {})
            if cb_rec:
                metadata['cb_metadata'] = cb_rec.get('metadata', {})
            
            combined_recommendations.append({
                'item_id': item_id,
                'score': combined_score,
                'confidence': combined_confidence,
                'explanation': explanation,
                'metadata': metadata
            })
        
        # Sort by combined score
        combined_recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return combined_recommendations
    
    def _process_single_model_recommendations(self, 
                                            recommendations: List[Dict[str, Any]], 
                                            model_type: str, 
                                            num_recommendations: int) -> List[Dict[str, Any]]:
        """Process recommendations from a single model."""
        
        processed_recs = []
        
        for rec in recommendations[:num_recommendations]:
            # Add hybrid metadata
            rec_copy = rec.copy()
            rec_copy['metadata'] = rec_copy.get('metadata', {})
            rec_copy['metadata']['model_type'] = f'hybrid_{model_type}_only'
            rec_copy['metadata']['fallback_reason'] = f'Only {model_type} model available'
            
            processed_recs.append(rec_copy)
        
        return processed_recs
    
    def _boost_diversity(self, 
                        recommendations: List[Dict[str, Any]], 
                        diversity_factor: float) -> List[Dict[str, Any]]:
        """Apply diversity boosting to recommendations."""
        
        if len(recommendations) <= 1:
            return recommendations
        
        # Simple diversity boosting: slightly lower scores for very similar items
        # This is a simplified approach - in production, you might use more sophisticated methods
        
        boosted_recs = []
        seen_categories = set()
        
        for i, rec in enumerate(recommendations):
            # Extract category from metadata (if available)
            category = rec.get('metadata', {}).get('category', f'item_{i}')
            
            # Apply diversity penalty for repeated categories
            diversity_penalty = 0.0
            if category in seen_categories:
                diversity_penalty = diversity_factor * 0.1  # Small penalty
            
            seen_categories.add(category)
            
            # Adjust score
            boosted_score = max(0.0, rec['score'] - diversity_penalty)
            
            boosted_rec = rec.copy()
            boosted_rec['score'] = boosted_score
            boosted_rec['metadata']['diversity_penalty'] = diversity_penalty
            
            boosted_recs.append(boosted_rec)
        
        # Re-sort after diversity boosting
        boosted_recs.sort(key=lambda x: x['score'], reverse=True)
        
        return boosted_recs
    
    def get_similar_items(self, 
                         item_id: str, 
                         num_similar: int = 10) -> List[Dict[str, Any]]:
        """Get items similar to the given item using both models."""
        
        cf_similar = []
        cb_similar = []
        
        # Get similar items from collaborative filtering
        if self.collaborative_model:
            try:
                cf_similar = self.collaborative_model.get_similar_items(
                    item_id=item_id, 
                    num_similar=num_similar
                )
            except Exception as e:
                logger.error(f"Collaborative similar items failed: {e}")
        
        # Get similar items from content-based
        if self.content_model:
            try:
                cb_similar = self.content_model.get_similar_items(
                    item_id=item_id, 
                    num_similar=num_similar
                )
            except Exception as e:
                logger.error(f"Content-based similar items failed: {e}")
        
        # Combine similar items
        if cf_similar and cb_similar:
            return self._combine_similar_items(cf_similar, cb_similar, num_similar)
        elif cf_similar:
            return cf_similar[:num_similar]
        elif cb_similar:
            return cb_similar[:num_similar]
        else:
            return []
    
    def _combine_similar_items(self, 
                             cf_similar: List[Dict[str, Any]], 
                             cb_similar: List[Dict[str, Any]], 
                             num_similar: int) -> List[Dict[str, Any]]:
        """Combine similar items from both models."""
        
        cf_dict = {item['item_id']: item for item in cf_similar}
        cb_dict = {item['item_id']: item for item in cb_similar}
        
        all_items = set(cf_dict.keys()) | set(cb_dict.keys())
        
        combined_similar = []
        
        for item_id in all_items:
            cf_sim = cf_dict.get(item_id, {}).get('similarity', 0.0)
            cb_sim = cb_dict.get(item_id, {}).get('similarity', 0.0)
            
            # Weighted average of similarities
            combined_similarity = (
                self.collaborative_weight * cf_sim + 
                self.content_weight * cb_sim
            )
            
            combined_similar.append({
                'item_id': item_id,
                'similarity': combined_similarity,
                'metadata': {
                    'cf_similarity': cf_sim,
                    'cb_similarity': cb_sim,
                    'method': 'hybrid_similarity'
                }
            })
        
        # Sort by combined similarity
        combined_similar.sort(key=lambda x: x['similarity'], reverse=True)
        
        return combined_similar[:num_similar]
    
    def explain_recommendation(self, 
                             user_id: str, 
                             item_id: str) -> Dict[str, Any]:
        """Provide detailed explanation for a hybrid recommendation."""
        
        explanations = []
        factors = []
        confidence_scores = []
        
        # Get explanation from collaborative filtering
        if self.collaborative_model:
            try:
                cf_explanation = self.collaborative_model.explain_recommendation(user_id, item_id)
                explanations.append(f"Collaborative: {cf_explanation['explanation']}")
                factors.extend(cf_explanation.get('factors', []))
                confidence_scores.append(cf_explanation['confidence'])
            except Exception as e:
                logger.error(f"CF explanation failed: {e}")
        
        # Get explanation from content-based
        if self.content_model:
            try:
                cb_explanation = self.content_model.explain_recommendation(user_id, item_id)
                explanations.append(f"Content-based: {cb_explanation['explanation']}")
                factors.extend(cb_explanation.get('factors', []))
                confidence_scores.append(cb_explanation['confidence'])
            except Exception as e:
                logger.error(f"CB explanation failed: {e}")
        
        # Combine explanations
        combined_explanation = " | ".join(explanations) if explanations else "Hybrid recommendation"
        combined_confidence = np.mean(confidence_scores) if confidence_scores else 0.5
        
        return {
            "explanation": combined_explanation,
            "confidence": combined_confidence,
            "factors": list(set(factors)),  # Remove duplicates
            "model_weights": {
                "collaborative": self.collaborative_weight,
                "content_based": self.content_weight
            }
        }
    
    def update_weights(self, 
                      collaborative_weight: float, 
                      content_weight: float) -> None:
        """Update the weights for combining models."""
        
        total_weight = collaborative_weight + content_weight
        self.collaborative_weight = collaborative_weight / total_weight
        self.content_weight = content_weight / total_weight
        
        logger.info(f"Updated weights - CF: {self.collaborative_weight:.3f}, CB: {self.content_weight:.3f}")
    
    def _get_model_state(self) -> Dict[str, Any]:
        """Get the current state of the hybrid model for serialization."""
        return {
            'collaborative_weight': self.collaborative_weight,
            'content_weight': self.content_weight,
            'min_interactions_for_cf': self.min_interactions_for_cf,
            'diversity_factor': self.diversity_factor,
            'user_interaction_counts': self.user_interaction_counts,
            'model_performance': self.model_performance,
            'collaborative_model_state': self.collaborative_model._get_model_state() if self.collaborative_model else None,
            'content_model_state': self.content_model._get_model_state() if self.content_model else None
        }
    
    def _set_model_state(self, state: Dict[str, Any]) -> None:
        """Set the hybrid model state from serialized data."""
        self.collaborative_weight = state['collaborative_weight']
        self.content_weight = state['content_weight']
        self.min_interactions_for_cf = state['min_interactions_for_cf']
        self.diversity_factor = state['diversity_factor']
        self.user_interaction_counts = state['user_interaction_counts']
        self.model_performance = state['model_performance']
        
        # Restore sub-models
        if state['collaborative_model_state']:
            self.collaborative_model._set_model_state(state['collaborative_model_state'])
        else:
            self.collaborative_model = None
            
        if state['content_model_state']:
            self.content_model._set_model_state(state['content_model_state'])
        else:
            self.content_model = None