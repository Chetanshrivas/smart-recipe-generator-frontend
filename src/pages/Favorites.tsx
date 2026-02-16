import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ChefHat } from 'lucide-react';
import { useUser } from '../context/UserContext';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Favorites: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your favorites..." />;
  }

  const favorites = user?.favorites || [];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite recipe${favorites.length !== 1 ? 's' : ''}. Access them anytime!`
              : 'Save your favorite recipes here for quick access later.'}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe: any) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and click the heart icon to save your favorites here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="btn-primary flex items-center space-x-2"
              >
                <ChefHat className="w-5 h-5" />
                <span>Find Recipes</span>
              </Link>
              <Link
                to="/recipes"
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Browse All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {favorites.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                You Might Also Like
              </h2>
              <Link
                to="/recipes"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <p className="text-gray-600 mb-6">
              Explore more delicious recipes from our collection.
            </p>
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Discover More Recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;