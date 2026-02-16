import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../types';
import { userApi } from '../services/api';

interface UserContextType {
  userId: string;
  user: User | null;
  favorites: string[];
  dietaryPreferences: string[];
  isLoading: boolean;
  addToFavorites: (recipeId: string) => Promise<void>;
  removeFromFavorites: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
  updateDietaryPreferences: (preferences: string[]) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_ID_KEY = 'smart_recipe_user_id';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user ID from localStorage or create new one
  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem(USER_ID_KEY, newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Fetch user data when userId is available
  const refreshUser = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await userApi.getUserProfile(userId);
      if (response.success) {
        setUser(response.data);
        setFavorites(response.data.favorites.map((f: any) => f._id || f));
        setDietaryPreferences(response.data.dietaryPreferences);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refreshUser();
    }
  }, [userId, refreshUser]);

  const addToFavorites = async (recipeId: string) => {
    try {
      const response = await userApi.addToFavorites(userId, recipeId);
      if (response.success) {
        setFavorites((prev) => [...prev, recipeId]);
        await refreshUser();
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (recipeId: string) => {
    try {
      const response = await userApi.removeFromFavorites(userId, recipeId);
      if (response.success) {
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
        await refreshUser();
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (recipeId: string): boolean => {
    return favorites.includes(recipeId);
  };

  const updateDietaryPreferences = async (preferences: string[]) => {
    try {
      const response = await userApi.updateDietaryPreferences(userId, preferences);
      if (response.success) {
        setDietaryPreferences(response.data.dietaryPreferences);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        user,
        favorites,
        dietaryPreferences,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        updateDietaryPreferences,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};