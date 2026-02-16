import React, { useState, useRef } from 'react';
import { ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Hero from '../components/Hero';
import IngredientSearch from '../components/IngredientSearch';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRecipeMatcher } from '../hooks/useRecipes';
import { useUser } from '../context/UserContext';
import type { MatchedRecipe } from '../types';

const Home: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { userId, dietaryPreferences } = useUser();
  const { matchedRecipes, isLoading, error, matchRecipes } = useRecipeMatcher();
  const searchRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    try {
      await matchRecipes(ingredients, dietaryPreferences, userId);
      // Scroll to results after a short delay
      setTimeout(() => {
        const resultsElement = document.getElementById('search-results');
        resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      toast.error('Failed to find recipes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onStartClick={scrollToSearch} />

      {/* Search Section */}
      <section ref={searchRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <IngredientSearch
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* Results Section */}
      {(matchedRecipes.length > 0 || isLoading) && (
        <section id="search-results" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full mb-4">
                <ChefHat className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">
                  {isLoading ? 'Finding Recipes...' : `${matchedRecipes.length} Recipes Found`}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {isLoading ? 'Matching Your Ingredients' : 'Perfect Matches for You'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {isLoading
                  ? 'Our smart algorithm is analyzing your ingredients...'
                  : 'Based on your ingredients, here are the best recipes you can make right now!'}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSpinner size="lg" message="Finding the perfect recipes..." />}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">Something went wrong</div>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={handleSearch}
                  className="btn-primary mt-4"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && matchedRecipes.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {matchedRecipes.map((match: MatchedRecipe) => (
                    <RecipeCard
                      key={match.recipe._id}
                      recipe={match.recipe}
                      matchInfo={match}
                      showMatchInfo={true}
                    />
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                  <a
                    href="/recipes"
                    className="inline-flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    <span>View All Recipes</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </>
            )}

            {/* No Results */}
            {!isLoading && matchedRecipes.length === 0 && ingredients.length > 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adding more common ingredients or browse all our recipes.
                </p>
                <a href="/recipes" className="btn-primary">
                  Browse All Recipes
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding recipes with Smart Recipe Generator is simple and fun!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Add Your Ingredients',
                description: 'Type, paste, or upload a photo of ingredients you have in your kitchen.',
                icon: '🥘',
              },
              {
                step: '2',
                title: 'Smart Matching',
                description: 'Our algorithm finds recipes that match your ingredients perfectly.',
                icon: '🔍',
              },
              {
                step: '3',
                title: 'Cook & Enjoy',
                description: 'Follow easy step-by-step instructions and enjoy your delicious meal!',
                icon: '👨‍🍳',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 text-center shadow-sm card-hover"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Cooking?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Browse our collection of 25+ delicious recipes from around the world.
            </p>
            <a
              href="/recipes"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Explore All Recipes</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;