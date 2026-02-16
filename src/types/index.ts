export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Rating {
  userId: string;
  rating: number;
  review?: string;
  date: string;
}

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrition;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  imageUrl?: string;
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  substitutions?: Map<string, string[]>;
  createdAt: string;
  updatedAt: string;
  totalTime?: number;
}

export interface MatchedRecipe {
  recipe: Recipe;
  score: number;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchCount: number;
  totalIngredients: number;
}

export interface User {
  userId: string;
  favorites: Recipe[];
  dietaryPreferences: string[];
  searchHistory: {
    ingredients: string[];
    timestamp: string;
  }[];
  favoritesCount: number;
  searchHistoryCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface FilterOptions {
  cuisine?: string;
  difficulty?: string;
  dietary?: string[];
  maxTime?: number;
  search?: string;
  sortBy?: 'rating' | 'time' | 'newest';
}

export interface RecognizedIngredient {
  name: string;
  confidence: number;
  category: string;
}

export const DIETARY_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Low-Carb',
  'High-Protein',
  'Nut-Free',
  'Spicy',
  'Low-Calorie',
] as const;

export const CUISINES = [
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'American',
  'Mediterranean',
  'Thai',
  'Japanese',
  'French',
  'Other',
] as const;

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const;