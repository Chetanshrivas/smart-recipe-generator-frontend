import axios, { AxiosError } from 'axios';
import type { ApiResponse, Recipe, MatchedRecipe, User, FilterOptions, RecognizedIngredient } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Recipe APIs
export const recipeApi = {
  // Get all recipes with filters
  getRecipes: async (filters?: FilterOptions & { page?: number; limit?: number }): Promise<ApiResponse<Recipe[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const response = await api.get(`/recipes?${params.toString()}`);
    return response.data;
  },

  // Get single recipe
  getRecipeById: async (id: string): Promise<ApiResponse<Recipe>> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Match recipes by ingredients
  matchRecipes: async (
    ingredients: string[],
    dietaryPreferences?: string[],
    userId?: string
  ): Promise<ApiResponse<MatchedRecipe[]>> => {
    const response = await api.post('/recipes/match', {
      ingredients,
      dietaryPreferences,
      userId,
    });
    return response.data;
  },

  // Get ingredient substitutions
  getSubstitutions: async (ingredient: string, recipeId?: string): Promise<ApiResponse<{ ingredient: string; substitutions: string[] }>> => {
    const params = new URLSearchParams();
    params.append('ingredient', ingredient);
    if (recipeId) params.append('recipeId', recipeId);
    const response = await api.get(`/recipes/substitutions?${params.toString()}`);
    return response.data;
  },

  // Rate a recipe
  rateRecipe: async (recipeId: string, userId: string, rating: number, review?: string): Promise<ApiResponse<{ averageRating: number; totalRatings: number }>> => {
    const response = await api.post(`/recipes/${recipeId}/rate`, {
      userId,
      rating,
      review,
    });
    return response.data;
  },

  // Get personalized suggestions
  getSuggestions: async (userId: string): Promise<ApiResponse<Recipe[]>> => {
    const response = await api.get(`/recipes/suggestions/${userId}`);
    return response.data;
  },

  // Get all cuisines
  getCuisines: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/recipes/cuisines');
    return response.data;
  },

  // Get all dietary tags
  getDietaryTags: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/recipes/dietary-tags');
    return response.data;
  },
};

// User APIs
export const userApi = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (userId: string, recipeId: string): Promise<ApiResponse<{ favoritesCount: number }>> => {
    const response = await api.post(`/users/${userId}/favorites`, { recipeId });
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (userId: string, recipeId: string): Promise<ApiResponse<{ favoritesCount: number }>> => {
    const response = await api.delete(`/users/${userId}/favorites/${recipeId}`);
    return response.data;
  },

  // Check if favorite
  checkFavorite: async (userId: string, recipeId: string): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    const response = await api.get(`/users/${userId}/favorites/${recipeId}`);
    return response.data;
  },

  // Update dietary preferences
  updateDietaryPreferences: async (userId: string, preferences: string[]): Promise<ApiResponse<{ dietaryPreferences: string[] }>> => {
    const response = await api.put(`/users/${userId}/preferences`, { preferences });
    return response.data;
  },
};

// Upload APIs
export const uploadApi = {
  // Recognize ingredients from image
  recognizeIngredients: async (imageFile: File): Promise<ApiResponse<{ ingredients: RecognizedIngredient[]; totalDetected: number; processingTime: string }>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/upload/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Extract ingredients from text
  extractIngredientsFromText: async (text: string): Promise<ApiResponse<{ ingredients: string[]; originalText: string }>> => {
    const response = await api.post('/upload/extract-text', { text });
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;