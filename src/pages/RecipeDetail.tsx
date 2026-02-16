import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  ChefHat,
  Flame,
  Star,
  Heart,
  ArrowLeft,
  Share2,
  Printer,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRecipe } from '../hooks/useRecipes';
import { useUser } from '../context/UserContext';
import { recipeApi } from '../services/api';
import {
  formatTime,
  getDifficultyColor,
  getDietaryTagColor,
  getCuisineEmoji,
  generateStars,
  calculatePerServing,
  getIngredientIcon,
} from '../utils/helpers';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading, error, refetch } = useRecipe(id);
  const { userId, isFavorite, addToFavorites, removeFromFavorites } = useUser();
  const [servings, setServings] = useState<number | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<string[]>([]);
  const [isLoadingSubstitutions, setIsLoadingSubstitutions] = useState(false);

  const favorite = recipe ? isFavorite(recipe._id) : false;
  const currentServings = servings || recipe?.servings || 1;

  const handleFavoriteClick = async () => {
    if (!recipe) return;

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRate = async (rating: number) => {
    if (!recipe || !userId) return;

    setIsSubmittingRating(true);
    try {
      await recipeApi.rateRecipe(recipe._id, userId, rating);
      setUserRating(rating);
      toast.success('Rating submitted!');
      refetch();
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const loadSubstitutions = async (ingredient: string) => {
    if (!recipe) return;

    setIsLoadingSubstitutions(true);
    setShowSubstitutions(ingredient);
    try {
      const response = await recipeApi.getSubstitutions(ingredient, recipe._id);
      if (response.success) {
        setSubstitutions(response.data.substitutions);
      }
    } catch (error) {
      toast.error('Failed to load substitutions');
    } finally {
      setIsLoadingSubstitutions(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading recipe..." />;
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
        <p className="text-gray-600 mb-6">
          The recipe you are looking for does not exist or has been removed.
        </p>
        <Link to="/recipes" className="btn-primary">
          Browse All Recipes
        </Link>
      </div>
    );
  }

  const nutrition = calculatePerServing(
    recipe.nutrition,
    recipe.servings,
    currentServings
  );
  const stars = generateStars(recipe.averageRating);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <img
          src={recipe.imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors no-print"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 no-print">
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{getCuisineEmoji(recipe.cuisine)}</span>
              <span className="text-white/90 font-medium">{recipe.cuisine}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {recipe.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="font-semibold">{formatTime(totalTime)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-semibold">{recipe.servings}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Flame className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-semibold">{recipe.nutrition.calories}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Star className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-semibold">{recipe.averageRating.toFixed(1)}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-8">{recipe.description}</p>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getDietaryTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Ingredients & Nutrition */}
            <div className="lg:col-span-1 space-y-8">
              {/* Servings Adjuster */}
              <div className="bg-primary-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Servings
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setServings(Math.max(1, currentServings - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {currentServings}
                  </span>
                  <button
                    onClick={() => setServings(currentServings + 1)}
                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group"
                    >
                      <span className="text-xl flex-shrink-0">
                        {getIngredientIcon(ingredient)}
                      </span>
                      <span className="flex-1 capitalize">{ingredient}</span>
                      <button
                        onClick={() => loadSubstitutions(ingredient)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-primary-600 hover:underline transition-opacity"
                      >
                        Substitute?
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Substitutions Modal */}
                {showSubstitutions && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Substitutes for {showSubstitutions}
                      </h4>
                      <button
                        onClick={() => setShowSubstitutions(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    {isLoadingSubstitutions ? (
                      <p className="text-gray-600">Loading...</p>
                    ) : substitutions.length > 0 ? (
                      <ul className="space-y-1">
                        {substitutions.map((sub, i) => (
                          <li key={i} className="text-gray-700 flex items-center">
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No substitutes found</p>
                    )}
                  </div>
                )}
              </div>

              {/* Nutrition */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nutrition (per serving)
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {nutrition.calories}
                    </p>
                    <p className="text-sm text-gray-500">Calories</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {nutrition.protein}g
                    </p>
                    <p className="text-sm text-gray-500">Protein</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {nutrition.carbs}g
                    </p>
                    <p className="text-sm text-gray-500">Carbs</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {nutrition.fat}g
                    </p>
                    <p className="text-sm text-gray-500">Fat</p>
                  </div>
                </div>
                {nutrition.fiber !== undefined && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Fiber: {nutrition.fiber}g
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Instructions & Rating */}
            <div className="lg:col-span-2 space-y-8">
              {/* Instructions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="flex-1 text-gray-700 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Rating Section */}
              <div className="border-t pt-8 no-print">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Rate this Recipe
                </h2>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      disabled={isSubmittingRating}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {recipe.totalRatings} people have rated this recipe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;