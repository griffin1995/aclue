import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import logging

from .base_recommender import BaseRecommender

logger = logging.getLogger(__name__)


class MatrixFactorizationDataset(Dataset):
    """Dataset for matrix factorization training."""
    
    def __init__(self, user_ids, item_ids, ratings):
        self.user_ids = torch.LongTensor(user_ids)
        self.item_ids = torch.LongTensor(item_ids)
        self.ratings = torch.FloatTensor(ratings)
    
    def __len__(self):
        return len(self.user_ids)
    
    def __getitem__(self, idx):
        return self.user_ids[idx], self.item_ids[idx], self.ratings[idx]


class NeuralMatrixFactorization(nn.Module):
    """Neural Matrix Factorization model."""
    
    def __init__(self, num_users, num_items, embedding_dim=64, hidden_dims=[128, 64]):
        super(NeuralMatrixFactorization, self).__init__()
        
        # User and item embeddings
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        
        # Bias terms
        self.user_bias = nn.Embedding(num_users, 1)
        self.item_bias = nn.Embedding(num_items, 1)
        self.global_bias = nn.Parameter(torch.zeros(1))
        
        # Neural network layers
        layers = []
        input_dim = embedding_dim * 2
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(input_dim, hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            input_dim = hidden_dim
        
        layers.append(nn.Linear(input_dim, 1))
        self.mlp = nn.Sequential(*layers)
        
        # Initialize embeddings
        nn.init.normal_(self.user_embedding.weight, std=0.1)
        nn.init.normal_(self.item_embedding.weight, std=0.1)
        nn.init.normal_(self.user_bias.weight, std=0.01)
        nn.init.normal_(self.item_bias.weight, std=0.01)
    
    def forward(self, user_ids, item_ids):
        # Get embeddings
        user_emb = self.user_embedding(user_ids)
        item_emb = self.item_embedding(item_ids)
        
        # Matrix factorization component (dot product)
        mf_output = torch.sum(user_emb * item_emb, dim=1, keepdim=True)
        
        # Neural network component
        mlp_input = torch.cat([user_emb, item_emb], dim=1)
        mlp_output = self.mlp(mlp_input)
        
        # Bias terms
        user_bias = self.user_bias(user_ids)
        item_bias = self.item_bias(item_ids)
        
        # Final prediction
        prediction = mf_output + mlp_output + user_bias + item_bias + self.global_bias
        
        return prediction.squeeze()


class CollaborativeFilteringRecommender(BaseRecommender):
    """
    Collaborative Filtering recommender using Neural Matrix Factorization.
    
    This model learns user and item embeddings and uses both matrix factorization
    and neural network components to predict user-item preferences.
    """
    
    def __init__(self, 
                 embedding_dim: int = 64,
                 hidden_dims: List[int] = [128, 64],
                 learning_rate: float = 0.001,
                 batch_size: int = 256,
                 num_epochs: int = 50,
                 device: str = 'cpu'):
        super().__init__(model_name="neural_collaborative_filtering", version="1.0.0")
        
        self.embedding_dim = embedding_dim
        self.hidden_dims = hidden_dims
        self.learning_rate = learning_rate
        self.batch_size = batch_size
        self.num_epochs = num_epochs
        self.device = torch.device(device)
        
        # Model components
        self.model = None
        self.user_encoder = {}  # Maps user_id to index
        self.item_encoder = {}  # Maps item_id to index
        self.user_decoder = {}  # Maps index to user_id
        self.item_decoder = {}  # Maps index to item_id
        
        # User-item interaction matrix for baseline predictions
        self.user_item_matrix = None
        self.user_means = None
        self.item_means = None
        self.global_mean = None
    
    def fit(self, 
            user_interactions: pd.DataFrame,
            product_features: pd.DataFrame,
            user_features: Optional[pd.DataFrame] = None,
            **kwargs) -> None:
        """
        Train the collaborative filtering model.
        
        Args:
            user_interactions: DataFrame with columns [user_id, product_id, rating, timestamp]
            product_features: Product features (not used in pure collaborative filtering)
            user_features: User features (not used in pure collaborative filtering)
        """
        logger.info("Starting collaborative filtering model training...")
        
        # Prepare data
        interactions = user_interactions.copy()
        
        # Convert ratings to binary if needed (for implicit feedback)
        if 'rating' not in interactions.columns:
            # Assume positive interactions (clicks, purchases, etc.)
            interactions['rating'] = 1.0
        
        # Create user and item encoders
        unique_users = interactions['user_id'].unique()
        unique_items = interactions['product_id'].unique()
        
        self.user_encoder = {user: idx for idx, user in enumerate(unique_users)}
        self.item_encoder = {item: idx for idx, item in enumerate(unique_items)}
        self.user_decoder = {idx: user for user, idx in self.user_encoder.items()}
        self.item_decoder = {idx: item for item, idx in self.item_encoder.items()}
        
        # Encode user and item IDs
        interactions['user_idx'] = interactions['user_id'].map(self.user_encoder)
        interactions['item_idx'] = interactions['product_id'].map(self.item_encoder)
        
        # Remove any rows with missing mappings
        interactions = interactions.dropna(subset=['user_idx', 'item_idx'])
        
        # Create user-item matrix for baseline predictions
        self._create_user_item_matrix(interactions)
        
        # Prepare training data
        user_ids = interactions['user_idx'].values
        item_ids = interactions['item_idx'].values
        ratings = interactions['rating'].values
        
        # Initialize model
        num_users = len(self.user_encoder)
        num_items = len(self.item_encoder)
        
        self.model = NeuralMatrixFactorization(
            num_users=num_users,
            num_items=num_items,
            embedding_dim=self.embedding_dim,
            hidden_dims=self.hidden_dims
        ).to(self.device)
        
        # Training setup
        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=self.learning_rate)
        
        # Create data loader
        dataset = MatrixFactorizationDataset(user_ids, item_ids, ratings)
        dataloader = DataLoader(dataset, batch_size=self.batch_size, shuffle=True)
        
        # Training loop
        self.model.train()
        for epoch in range(self.num_epochs):
            total_loss = 0
            num_batches = 0
            
            for batch_users, batch_items, batch_ratings in dataloader:
                batch_users = batch_users.to(self.device)
                batch_items = batch_items.to(self.device)
                batch_ratings = batch_ratings.to(self.device)
                
                # Forward pass
                predictions = self.model(batch_users, batch_items)
                loss = criterion(predictions, batch_ratings)
                
                # Backward pass
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
                num_batches += 1
            
            avg_loss = total_loss / num_batches
            if epoch % 10 == 0:
                logger.info(f"Epoch {epoch}/{self.num_epochs}, Average Loss: {avg_loss:.4f}")
        
        self.is_trained = True
        self.training_timestamp = pd.Timestamp.now()
        
        # Store metadata
        self.metadata = {
            'num_users': num_users,
            'num_items': num_items,
            'num_interactions': len(interactions),
            'embedding_dim': self.embedding_dim,
            'hidden_dims': self.hidden_dims,
            'final_loss': avg_loss
        }
        
        logger.info("Collaborative filtering model training completed!")
    
    def _create_user_item_matrix(self, interactions: pd.DataFrame):
        """Create user-item interaction matrix and compute baseline statistics."""
        # Create sparse matrix
        user_ids = interactions['user_idx'].values
        item_ids = interactions['item_idx'].values
        ratings = interactions['rating'].values
        
        num_users = len(self.user_encoder)
        num_items = len(self.item_encoder)
        
        self.user_item_matrix = csr_matrix(
            (ratings, (user_ids, item_ids)), 
            shape=(num_users, num_items)
        )
        
        # Compute baseline statistics
        self.global_mean = np.mean(ratings)
        
        # User means (average rating per user)
        user_sums = np.array(self.user_item_matrix.sum(axis=1)).flatten()
        user_counts = np.array((self.user_item_matrix > 0).sum(axis=1)).flatten()
        self.user_means = np.divide(user_sums, user_counts, 
                                   out=np.full_like(user_sums, self.global_mean), 
                                   where=user_counts != 0)
        
        # Item means (average rating per item)
        item_sums = np.array(self.user_item_matrix.sum(axis=0)).flatten()
        item_counts = np.array((self.user_item_matrix > 0).sum(axis=0)).flatten()
        self.item_means = np.divide(item_sums, item_counts,
                                   out=np.full_like(item_sums, self.global_mean),
                                   where=item_counts != 0)
    
    def predict(self, 
                user_id: str, 
                candidate_items: Optional[List[str]] = None,
                num_recommendations: int = 20,
                **kwargs) -> List[Dict[str, Any]]:
        """Generate recommendations for a user."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Check if user exists in training data
        if user_id not in self.user_encoder:
            return self._handle_cold_start_user(user_id, candidate_items, num_recommendations)
        
        user_idx = self.user_encoder[user_id]
        
        # Get candidate items
        if candidate_items is None:
            candidate_items = list(self.item_encoder.keys())
        
        # Filter out items not in training data
        valid_items = [item for item in candidate_items if item in self.item_encoder]
        
        if not valid_items:
            return []
        
        # Get predictions
        self.model.eval()
        recommendations = []
        
        with torch.no_grad():
            for item_id in valid_items:
                item_idx = self.item_encoder[item_id]
                
                # Get model prediction
                user_tensor = torch.LongTensor([user_idx]).to(self.device)
                item_tensor = torch.LongTensor([item_idx]).to(self.device)
                
                score = self.model(user_tensor, item_tensor).item()
                
                # Normalize score to 0-1 range
                normalized_score = max(0, min(1, (score + 3) / 6))  # Assuming score range [-3, 3]
                
                recommendations.append({
                    'item_id': item_id,
                    'score': normalized_score,
                    'confidence': min(0.9, normalized_score + 0.1),  # Slightly higher confidence
                    'explanation': f"Recommended based on your preferences and similar users",
                    'metadata': {
                        'raw_score': score,
                        'model_type': 'collaborative_filtering'
                    }
                })
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:num_recommendations]
    
    def _handle_cold_start_user(self, 
                               user_id: str, 
                               candidate_items: Optional[List[str]], 
                               num_recommendations: int) -> List[Dict[str, Any]]:
        """Handle recommendations for new users (cold start problem)."""
        logger.info(f"Cold start recommendation for new user: {user_id}")
        
        if candidate_items is None:
            candidate_items = list(self.item_encoder.keys())
        
        # Use item popularity as fallback
        recommendations = []
        
        for item_id in candidate_items[:num_recommendations]:
            if item_id in self.item_encoder:
                item_idx = self.item_encoder[item_id]
                
                # Use item mean rating as score
                score = self.item_means[item_idx] / 5.0  # Normalize to 0-1
                
                recommendations.append({
                    'item_id': item_id,
                    'score': score,
                    'confidence': 0.3,  # Lower confidence for cold start
                    'explanation': "Popular item recommendation for new user",
                    'metadata': {
                        'model_type': 'popularity_fallback',
                        'cold_start': True
                    }
                })
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:num_recommendations]
    
    def get_similar_items(self, 
                         item_id: str, 
                         num_similar: int = 10) -> List[Dict[str, Any]]:
        """Get items similar to the given item based on user interactions."""
        if not self.is_trained or item_id not in self.item_encoder:
            return []
        
        item_idx = self.item_encoder[item_id]
        
        # Get item vector from user-item matrix
        item_vector = self.user_item_matrix[:, item_idx].toarray().flatten()
        
        # Calculate similarity with all other items
        similarities = []
        for other_item_id, other_item_idx in self.item_encoder.items():
            if other_item_id == item_id:
                continue
            
            other_vector = self.user_item_matrix[:, other_item_idx].toarray().flatten()
            
            # Calculate cosine similarity
            similarity = cosine_similarity([item_vector], [other_vector])[0][0]
            
            if not np.isnan(similarity):
                similarities.append({
                    'item_id': other_item_id,
                    'similarity': float(similarity),
                    'metadata': {'method': 'cosine_similarity'}
                })
        
        # Sort by similarity and return top items
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        return similarities[:num_similar]
    
    def _get_model_state(self) -> Dict[str, Any]:
        """Get the current state of the model for serialization."""
        return {
            'model_state_dict': self.model.state_dict() if self.model else None,
            'user_encoder': self.user_encoder,
            'item_encoder': self.item_encoder,
            'user_decoder': self.user_decoder,
            'item_decoder': self.item_decoder,
            'user_item_matrix': self.user_item_matrix,
            'user_means': self.user_means,
            'item_means': self.item_means,
            'global_mean': self.global_mean,
            'embedding_dim': self.embedding_dim,
            'hidden_dims': self.hidden_dims
        }
    
    def _set_model_state(self, state: Dict[str, Any]) -> None:
        """Set the model state from serialized data."""
        self.user_encoder = state['user_encoder']
        self.item_encoder = state['item_encoder']
        self.user_decoder = state['user_decoder']
        self.item_decoder = state['item_decoder']
        self.user_item_matrix = state['user_item_matrix']
        self.user_means = state['user_means']
        self.item_means = state['item_means']
        self.global_mean = state['global_mean']
        self.embedding_dim = state['embedding_dim']
        self.hidden_dims = state['hidden_dims']
        
        if state['model_state_dict']:
            num_users = len(self.user_encoder)
            num_items = len(self.item_encoder)
            
            self.model = NeuralMatrixFactorization(
                num_users=num_users,
                num_items=num_items,
                embedding_dim=self.embedding_dim,
                hidden_dims=self.hidden_dims
            ).to(self.device)
            
            self.model.load_state_dict(state['model_state_dict'])