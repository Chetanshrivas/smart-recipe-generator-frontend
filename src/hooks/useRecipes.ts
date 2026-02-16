import { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/api';
import type { Recipe, MatchedRecipe, FilterOptions } from '../types';

export const useRecipes = (filters?: FilterOptions & { page?: number; limit?: number }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.getRecipes(filters);
      if (response.success) {
        setRecipes(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, pagination, isLoading, error, refetch: fetchRecipes };
};

export const useRecipe = (id: string | undefined) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.getRecipeById(id);
      if (response.success) {
        setRecipe(response.data);
      }
    } catch (err) {
      setError('Failed to fetch recipe');
      console.error('Error fetching recipe:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return { recipe, isLoading, error, refetch: fetchRecipe };
};

export const useRecipeMatcher = () => {
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchRecipes = useCallback(async (
    ingredients: string[],
    dietaryPreferences?: string[],
    userId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.matchRecipes(ingredients, dietaryPreferences, userId);
      if (response.success) {
        setMatchedRecipes(response.data);
        return response.data;
      }
    } catch (err) {
      setError('Failed to match recipes');
      console.error('Error matching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { matchedRecipes, isLoading, error, matchRecipes };
};

export const useSubstitutions = () => {
  const [substitutions, setSubstitutions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubstitutions = useCallback(async (ingredient: string, recipeId?: string) => {
    setIsLoading(true);
    try {
      const response = await recipeApi.getSubstitutions(ingredient, recipeId);
      if (response.success) {
        setSubstitutions(response.data.substitutions);
      }
    } catch (err) {
      console.error('Error fetching substitutions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { substitutions, isLoading, fetchSubstitutions };
};

export const useSuggestions = (userId: string) => {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await recipeApi.getSuggestions(userId);
      if (response.success) {
        setSuggestions(response.data);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return { suggestions, isLoading, refetch: fetchSuggestions };
};