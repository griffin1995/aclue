import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import TruncatedSVD
import logging

from .base_recommender import BaseRecommender

logger = logging.getLogger(__name__)


class ContentBasedRecommender(BaseRecommender):
    """
    Content-based recommender that uses product features to recommend similar items.
    
    This model creates product embeddings based on textual and categorical features,
    then recommends items similar to what the user has interacted with previously.
    """
    
    def __init__(self, 
                 max_features: int = 5000,
                 min_df: int = 2,
                 max_df: float = 0.8,
                 n_components: int = 100,
                 similarity_threshold: float = 0.1):
        super().__init__(model_name="content_based_filtering", version="1.0.0")
        
        self.max_features = max_features
        self.min_df = min_df
        self.max_df = max_df
        self.n_components = n_components
        self.similarity_threshold = similarity_threshold
        
        # Model components
        self.tfidf_vectorizer = None
        self.scaler = StandardScaler()
        self.svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.label_encoders = {}
        
        # Feature matrices
        self.item_features = None
        self.item_embeddings = None
        self.similarity_matrix = None
        
        # Mappings
        self.item_to_idx = {}
        self.idx_to_item = {}
        
        # User profiles
        self.user_profiles = {}
        
    def fit(self, 
            user_interactions: pd.DataFrame,
            product_features: pd.DataFrame,
            user_features: Optional[pd.DataFrame] = None,
            **kwargs) -> None:
        """
        Train the content-based model.
        
        Args:
            user_interactions: DataFrame with columns [user_id, product_id, rating, timestamp]
            product_features: DataFrame with product metadata and features
            user_features: User features (not used in this implementation)
        """
        logger.info("Starting content-based model training...")
        
        self.product_features = product_features.copy()
        self.interactions = user_interactions.copy()
        
        # Create item mappings
        unique_items = product_features['id'].unique()
        self.item_to_idx = {item: idx for idx, item in enumerate(unique_items)}
        self.idx_to_item = {idx: item for item, idx in self.item_to_idx.items()}
        
        # Process product features
        self._process_product_features()
        
        # Create user profiles based on interactions
        self._create_user_profiles()
        
        # Compute item similarity matrix
        self._compute_similarity_matrix()
        
        self.is_trained = True
        self.training_timestamp = pd.Timestamp.now()
        
        # Store metadata
        self.metadata = {
            'num_items': len(unique_items),
            'num_features': self.item_embeddings.shape[1],
            'num_users_with_profiles': len(self.user_profiles),
            'similarity_threshold': self.similarity_threshold
        }
        
        logger.info("Content-based model training completed!")
    
    def _process_product_features(self):
        """Process and encode product features."""
        logger.info("Processing product features...")
        
        df = self.product_features.copy()
        
        # Text features processing
        text_columns = ['title', 'description', 'brand', 'category_path']
        text_features = []
        
        for col in text_columns:
            if col in df.columns:
                # Fill missing values and convert to string
                df[col] = df[col].fillna('').astype(str)
                text_features.append(df[col])
        
        # Combine text features
        if text_features:
            combined_text = ' '.join([' '.join(series) for series in text_features])
            df['combined_text'] = combined_text
            
            # TF-IDF vectorization
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=self.max_features,
                min_df=self.min_df,
                max_df=self.max_df,
                stop_words='english',
                ngram_range=(1, 2)
            )
            
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(df['combined_text'])
            tfidf_features = tfidf_matrix.toarray()
        else:
            tfidf_features = np.array([]).reshape(len(df), 0)
        
        # Numerical features processing
        numerical_columns = ['price', 'average_rating', 'review_count']
        numerical_features = []
        
        for col in numerical_columns:
            if col in df.columns:
                # Fill missing values with median
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].fillna(df[col].median())
                numerical_features.append(df[col].values.reshape(-1, 1))
        
        if numerical_features:
            numerical_matrix = np.hstack(numerical_features)
            # Scale numerical features
            numerical_matrix = self.scaler.fit_transform(numerical_matrix)
        else:
            numerical_matrix = np.array([]).reshape(len(df), 0)
        
        # Categorical features processing
        categorical_columns = ['primary_category', 'availability_status']
        categorical_features = []
        
        for col in categorical_columns:
            if col in df.columns:
                # Fill missing values
                df[col] = df[col].fillna('unknown')
                
                # Label encoding
                le = LabelEncoder()
                encoded = le.fit_transform(df[col])
                self.label_encoders[col] = le
                
                # One-hot encoding (simplified)
                unique_values = len(le.classes_)
                onehot = np.eye(unique_values)[encoded]
                categorical_features.append(onehot)
        
        if categorical_features:
            categorical_matrix = np.hstack(categorical_features)
        else:
            categorical_matrix = np.array([]).reshape(len(df), 0)
        
        # Combine all features
        all_features = []
        if tfidf_features.shape[1] > 0:
            all_features.append(tfidf_features)
        if numerical_matrix.shape[1] > 0:
            all_features.append(numerical_matrix)
        if categorical_matrix.shape[1] > 0:
            all_features.append(categorical_matrix)
        
        if all_features:
            self.item_features = np.hstack(all_features)
        else:
            raise ValueError("No valid features found in product data")
        
        # Dimensionality reduction
        if self.item_features.shape[1] > self.n_components:
            self.item_embeddings = self.svd.fit_transform(self.item_features)
        else:
            self.item_embeddings = self.item_features
        
        logger.info(f"Processed {self.item_features.shape[1]} features into {self.item_embeddings.shape[1]} dimensions")
    
    def _create_user_profiles(self):
        """Create user profiles based on their interaction history."""
        logger.info("Creating user profiles...")
        
        # Convert ratings to weights (higher rating = higher weight)
        if 'rating' not in self.interactions.columns:
            self.interactions['rating'] = 1.0  # Implicit feedback
        
        # Group by user
        for user_id, user_data in self.interactions.groupby('user_id'):
            user_item_weights = []
            user_items = []
            
            for _, row in user_data.iterrows():
                item_id = row['product_id']
                weight = row['rating']
                
                if item_id in self.item_to_idx:
                    item_idx = self.item_to_idx[item_id]
                    user_items.append(item_idx)
                    user_item_weights.append(weight)
            
            if user_items:
                # Create weighted average of item embeddings
                item_embeddings = self.item_embeddings[user_items]
                weights = np.array(user_item_weights).reshape(-1, 1)
                
                # Normalize weights
                weights = weights / np.sum(weights)
                
                # Weighted average
                user_profile = np.average(item_embeddings, axis=0, weights=weights.flatten())
                self.user_profiles[user_id] = user_profile
        
        logger.info(f"Created profiles for {len(self.user_profiles)} users")
    
    def _compute_similarity_matrix(self):
        """Compute item-item similarity matrix."""
        logger.info("Computing item similarity matrix...")
        
        # Compute cosine similarity between all items
        self.similarity_matrix = cosine_similarity(self.item_embeddings)
        
        # Zero out similarities below threshold
        self.similarity_matrix[self.similarity_matrix < self.similarity_threshold] = 0
        
        logger.info("Item similarity matrix computed")
    
    def predict(self, 
                user_id: str, 
                candidate_items: Optional[List[str]] = None,
                num_recommendations: int = 20,
                **kwargs) -> List[Dict[str, Any]]:
        """Generate recommendations for a user."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Get candidate items
        if candidate_items is None:
            candidate_items = list(self.item_to_idx.keys())
        
        # Filter valid items
        valid_items = [item for item in candidate_items if item in self.item_to_idx]
        
        if not valid_items:
            return []
        
        # Get user profile
        if user_id in self.user_profiles:
            user_profile = self.user_profiles[user_id]
            return self._profile_based_recommendations(user_profile, valid_items, num_recommendations)
        else:
            # Cold start: use popularity-based recommendations
            return self._cold_start_recommendations(valid_items, num_recommendations)
    
    def _profile_based_recommendations(self, 
                                     user_profile: np.ndarray, 
                                     candidate_items: List[str], 
                                     num_recommendations: int) -> List[Dict[str, Any]]:
        """Generate recommendations based on user profile."""
        recommendations = []
        
        for item_id in candidate_items:
            item_idx = self.item_to_idx[item_id]
            item_embedding = self.item_embeddings[item_idx]
            
            # Calculate similarity to user profile
            similarity = cosine_similarity([user_profile], [item_embedding])[0][0]
            
            if not np.isnan(similarity) and similarity > 0:
                recommendations.append({
                    'item_id': item_id,
                    'score': float(similarity),
                    'confidence': min(0.9, float(similarity) + 0.1),
                    'explanation': f"Recommended based on your preferences for similar products",
                    'metadata': {
                        'raw_similarity': float(similarity),
                        'model_type': 'content_based'
                    }
                })\n        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:num_recommendations]
    
    def _cold_start_recommendations(self, 
                                  candidate_items: List[str], 
                                  num_recommendations: int) -> List[Dict[str, Any]]:
        """Generate recommendations for new users."""
        logger.info("Generating cold start recommendations")
        
        # Use popularity-based approach (most interacted items)
        item_popularity = {}
        
        for _, row in self.interactions.iterrows():
            item_id = row['product_id']
            if item_id in candidate_items:
                item_popularity[item_id] = item_popularity.get(item_id, 0) + 1
        
        # Sort by popularity
        sorted_items = sorted(item_popularity.items(), key=lambda x: x[1], reverse=True)
        
        recommendations = []
        for item_id, count in sorted_items[:num_recommendations]:
            # Normalize popularity score
            max_count = sorted_items[0][1] if sorted_items else 1
            score = count / max_count
            
            recommendations.append({
                'item_id': item_id,
                'score': score,
                'confidence': 0.3,  # Lower confidence for cold start
                'explanation': "Popular product recommendation",
                'metadata': {
                    'popularity_count': count,
                    'model_type': 'popularity_fallback',
                    'cold_start': True
                }
            })
        
        return recommendations
    
    def get_similar_items(self, 
                         item_id: str, 
                         num_similar: int = 10) -> List[Dict[str, Any]]:
        """Get items similar to the given item."""
        if not self.is_trained or item_id not in self.item_to_idx:
            return []
        
        item_idx = self.item_to_idx[item_id]
        similarities = self.similarity_matrix[item_idx]
        
        # Get top similar items (excluding the item itself)
        similar_indices = np.argsort(similarities)[::-1][1:num_similar+1]
        
        similar_items = []
        for idx in similar_indices:
            similarity_score = similarities[idx]
            if similarity_score > 0:
                similar_item_id = self.idx_to_item[idx]
                similar_items.append({
                    'item_id': similar_item_id,
                    'similarity': float(similarity_score),
                    'metadata': {'method': 'content_similarity'}
                })
        
        return similar_items
    
    def explain_recommendation(self, 
                             user_id: str, 
                             item_id: str) -> Dict[str, Any]:
        """Provide explanation for why an item was recommended."""
        if user_id not in self.user_profiles or item_id not in self.item_to_idx:
            return super().explain_recommendation(user_id, item_id)
        
        user_profile = self.user_profiles[user_id]
        item_idx = self.item_to_idx[item_id]
        item_embedding = self.item_embeddings[item_idx]
        
        similarity = cosine_similarity([user_profile], [item_embedding])[0][0]
        
        # Find which features contribute most to the similarity
        feature_contributions = np.abs(user_profile * item_embedding)
        top_features = np.argsort(feature_contributions)[::-1][:3]
        
        return {
            "explanation": f"Recommended based on content similarity (score: {similarity:.3f})",
            "confidence": float(similarity),
            "factors": [
                "Similar to products you've liked before",
                "Matches your preferred categories",
                "Similar price range to your preferences"
            ],
            "similarity_score": float(similarity)
        }
    
    def _get_model_state(self) -> Dict[str, Any]:
        """Get the current state of the model for serialization."""
        return {
            'tfidf_vectorizer': self.tfidf_vectorizer,
            'scaler': self.scaler,
            'svd': self.svd,
            'label_encoders': self.label_encoders,
            'item_features': self.item_features,
            'item_embeddings': self.item_embeddings,
            'similarity_matrix': self.similarity_matrix,
            'item_to_idx': self.item_to_idx,
            'idx_to_item': self.idx_to_item,
            'user_profiles': self.user_profiles,
            'product_features': self.product_features,
            'interactions': self.interactions
        }
    
    def _set_model_state(self, state: Dict[str, Any]) -> None:
        """Set the model state from serialized data."""
        self.tfidf_vectorizer = state['tfidf_vectorizer']
        self.scaler = state['scaler']
        self.svd = state['svd']
        self.label_encoders = state['label_encoders']
        self.item_features = state['item_features']
        self.item_embeddings = state['item_embeddings']
        self.similarity_matrix = state['similarity_matrix']
        self.item_to_idx = state['item_to_idx']
        self.idx_to_item = state['idx_to_item']
        self.user_profiles = state['user_profiles']
        self.product_features = state['product_features']
        self.interactions = state['interactions']