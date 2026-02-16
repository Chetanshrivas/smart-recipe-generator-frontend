import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Heart, Flame,} from 'lucide-react';
import { useUser } from '../context/UserContext';
import type { Recipe, MatchedRecipe } from '../types';
import {
  formatTime,
  getDifficultyColor,
  getDietaryTagColor,
  getCuisineEmoji,
  generateStars,
  getMatchColor,
} from '../utils/helpers';
import toast from 'react-hot-toast';

interface RecipeCardProps {
  recipe: Recipe;
  matchInfo?: MatchedRecipe;
  showMatchInfo?: boolean;
  compact?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  matchInfo,
  showMatchInfo = false,
  compact = false,
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useUser();
  const favorite = isFavorite(recipe._id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (favorite) {
        await removeFromFavorites(recipe._id);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(recipe._id);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const stars = generateStars(recipe.averageRating);
  const totalTime = recipe.prepTime + recipe.cookTime;

  if (compact) {
    return (
      <Link
        to={`/recipe/${recipe._id}`}
        className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden card-hover"
      >
        <div className="flex">
          <img
            src={recipe.imageUrl || '/placeholder-recipe.jpg'}
            alt={recipe.name}
            className="w-24 h-24 object-cover flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 truncate pr-2">{recipe.name}</h3>
              <button
                onClick={handleFavoriteClick}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className="mr-2">{getCuisineEmoji(recipe.cuisine)}</span>
              <span>{recipe.cuisine}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(totalTime)}
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                {recipe.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/recipe/${recipe._id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden card-hover h-full"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={recipe.imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Match Badge */}
        {showMatchInfo && matchInfo && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(matchInfo.matchPercentage)}`}>
            {matchInfo.matchPercentage}% Match
          </div>
        )}

        {/* Difficulty Badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
          {recipe.difficulty}
        </div>

        {/* Cuisine Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium flex items-center">
          <span className="mr-1">{getCuisineEmoji(recipe.cuisine)}</span>
          {recipe.cuisine}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {recipe.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Match Info */}
        {showMatchInfo && matchInfo && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 font-medium">
                {matchInfo.matchedIngredients.length} matched
              </span>
              {matchInfo.missingIngredients.length > 0 && (
                <span className="text-gray-500">
                  {matchInfo.missingIngredients.length} missing
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(totalTime)}
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {recipe.servings}
          </span>
          <span className="flex items-center">
            <Flame className="w-4 h-4 mr-1" />
            {recipe.nutrition.calories} cal
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {stars.map((star, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  star === 'full'
                    ? 'text-yellow-400 fill-yellow-400'
                    : star === 'half'
                    ? 'text-yellow-400 fill-yellow-400/50'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {recipe.averageRating.toFixed(1)} ({recipe.totalRatings})
          </span>
        </div>

        {/* Dietary Tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.dietaryTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDietaryTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {recipe.dietaryTags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{recipe.dietaryTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecipeCard;