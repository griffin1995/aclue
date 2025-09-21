from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class BaseRecommender(ABC):
    """
    Abstract base class for all recommendation models in Aclue.
    
    This defines the interface that all recommendation models must implement,
    ensuring consistency across different algorithms and approaches.
    """
    
    def __init__(self, model_name: str, version: str = "1.0.0"):
        self.model_name = model_name
        self.version = version
        self.is_trained = False
        self.training_timestamp = None
        self.feature_columns = []
        self.metadata = {}
        
    @abstractmethod
    def fit(self, 
            user_interactions: pd.DataFrame,
            product_features: pd.DataFrame,
            user_features: Optional[pd.DataFrame] = None,
            **kwargs) -> None:
        """
        Train the recommendation model.
        
        Args:
            user_interactions: DataFrame with columns [user_id, product_id, rating/interaction_type, timestamp]
            product_features: DataFrame with product metadata and features
            user_features: Optional DataFrame with user metadata and features
            **kwargs: Additional training parameters
        """
        pass
    
    @abstractmethod
    def predict(self, 
                user_id: str, 
                candidate_items: Optional[List[str]] = None,
                num_recommendations: int = 20,
                **kwargs) -> List[Dict[str, Any]]:
        """
        Generate recommendations for a user.
        
        Args:
            user_id: ID of the user to generate recommendations for
            candidate_items: Optional list of item IDs to consider (if None, consider all items)
            num_recommendations: Number of recommendations to return
            **kwargs: Additional prediction parameters
            
        Returns:
            List of dictionaries containing:
            - item_id: Product ID
            - score: Recommendation score (0-1)
            - confidence: Confidence in the recommendation (0-1)
            - explanation: Human-readable explanation
            - metadata: Additional recommendation metadata
        """
        pass
    
    def batch_predict(self, 
                     user_ids: List[str],
                     num_recommendations: int = 20,
                     **kwargs) -> Dict[str, List[Dict[str, Any]]]:
        """
        Generate recommendations for multiple users efficiently.
        
        Args:
            user_ids: List of user IDs
            num_recommendations: Number of recommendations per user
            **kwargs: Additional prediction parameters
            
        Returns:
            Dictionary mapping user_id to list of recommendations
        """
        results = {}
        for user_id in user_ids:
            try:
                results[user_id] = self.predict(
                    user_id=user_id,
                    num_recommendations=num_recommendations,
                    **kwargs
                )
            except Exception as e:
                logger.error(f"Failed to generate recommendations for user {user_id}: {e}")
                results[user_id] = []
        
        return results
    
    def evaluate(self, 
                test_interactions: pd.DataFrame,
                k_values: List[int] = [5, 10, 20]) -> Dict[str, float]:
        """
        Evaluate the model on test data.
        
        Args:
            test_interactions: Test interaction data
            k_values: List of k values for computing metrics@k
            
        Returns:
            Dictionary of evaluation metrics
        """
        metrics = {}
        
        # Get unique users from test set
        test_users = test_interactions['user_id'].unique()
        
        # Generate recommendations for test users
        all_recommendations = self.batch_predict(
            user_ids=test_users.tolist(),
            num_recommendations=max(k_values)
        )
        
        # Calculate metrics for each k
        for k in k_values:
            precision_scores = []
            recall_scores = []
            ndcg_scores = []
            
            for user_id in test_users:
                # Get actual items for this user
                actual_items = set(
                    test_interactions[test_interactions['user_id'] == user_id]['product_id'].tolist()
                )
                
                # Get recommended items (top k)
                recommended_items = set([
                    rec['item_id'] for rec in all_recommendations.get(user_id, [])[:k]
                ])
                
                if len(actual_items) == 0:
                    continue
                
                # Calculate precision@k
                intersection = actual_items.intersection(recommended_items)
                precision = len(intersection) / len(recommended_items) if len(recommended_items) > 0 else 0
                precision_scores.append(precision)
                
                # Calculate recall@k
                recall = len(intersection) / len(actual_items)
                recall_scores.append(recall)
                
                # Calculate NDCG@k (simplified version)
                dcg = 0
                for i, item_id in enumerate([rec['item_id'] for rec in all_recommendations.get(user_id, [])[:k]]):
                    if item_id in actual_items:
                        dcg += 1 / np.log2(i + 2)  # +2 because log2(1) = 0
                
                idcg = sum(1 / np.log2(i + 2) for i in range(min(len(actual_items), k)))
                ndcg = dcg / idcg if idcg > 0 else 0
                ndcg_scores.append(ndcg)
            
            # Store average metrics
            metrics[f'precision@{k}'] = np.mean(precision_scores) if precision_scores else 0
            metrics[f'recall@{k}'] = np.mean(recall_scores) if recall_scores else 0
            metrics[f'ndcg@{k}'] = np.mean(ndcg_scores) if ndcg_scores else 0
        
        return metrics
    
    def save_model(self, filepath: str) -> None:
        """Save the trained model to disk."""
        import pickle
        
        model_data = {
            'model_name': self.model_name,
            'version': self.version,
            'is_trained': self.is_trained,
            'training_timestamp': self.training_timestamp,
            'feature_columns': self.feature_columns,
            'metadata': self.metadata,
            'model_state': self._get_model_state()
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str) -> None:
        """Load a trained model from disk."""
        import pickle
        
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model_name = model_data['model_name']
        self.version = model_data['version']
        self.is_trained = model_data['is_trained']
        self.training_timestamp = model_data['training_timestamp']
        self.feature_columns = model_data['feature_columns']
        self.metadata = model_data['metadata']
        
        self._set_model_state(model_data['model_state'])
        
        logger.info(f"Model loaded from {filepath}")
    
    @abstractmethod
    def _get_model_state(self) -> Dict[str, Any]:
        """Get the current state of the model for serialization."""
        pass
    
    @abstractmethod
    def _set_model_state(self, state: Dict[str, Any]) -> None:
        """Set the model state from serialized data."""
        pass
    
    def get_feature_importance(self) -> Optional[Dict[str, float]]:
        """
        Get feature importance scores if available.
        
        Returns:
            Dictionary mapping feature names to importance scores
        """
        return None
    
    def explain_recommendation(self, 
                             user_id: str, 
                             item_id: str) -> Dict[str, Any]:
        """
        Provide explanation for why an item was recommended to a user.
        
        Args:
            user_id: User ID
            item_id: Item ID
            
        Returns:
            Dictionary containing explanation details
        """
        return {
            "explanation": f"Recommended by {self.model_name}",
            "confidence": 0.5,
            "factors": []
        }
    
    def get_similar_items(self, 
                         item_id: str, 
                         num_similar: int = 10) -> List[Dict[str, Any]]:
        """
        Get items similar to the given item.
        
        Args:
            item_id: Reference item ID
            num_similar: Number of similar items to return
            
        Returns:
            List of similar items with similarity scores
        """
        return []
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the model."""
        return {
            "model_name": self.model_name,
            "version": self.version,
            "is_trained": self.is_trained,
            "training_timestamp": self.training_timestamp,
            "feature_columns": self.feature_columns,
            "metadata": self.metadata
        }