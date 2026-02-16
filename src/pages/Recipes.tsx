import React, { useState, useEffect } from 'react';
import { Search, ChefHat, SlidersHorizontal } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRecipes } from '../hooks/useRecipes';
import type { FilterOptions } from '../types';

const Recipes: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions & { page?: number; limit?: number }>({
    page: 1,
    limit: 12,
    sortBy: 'rating',
  });
  const [searchInput, setSearchInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { recipes, pagination, isLoading, error } = useRecipes(filters);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Browse our collection of {pagination.total}+ delicious recipes from various cuisines. 
            Use the filters to find exactly what you are looking for.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search recipes, ingredients, or cuisines..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center space-x-2 mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{' '}
                <span className="font-medium text-gray-900">
                  {recipes.length > 0 ? (filters.page! - 1) * filters.limit! + 1 : 0} -{' '}
                  {Math.min(filters.page! * filters.limit!, pagination.total)}
                </span>{' '}
                of <span className="font-medium text-gray-900">{pagination.total}</span> recipes
              </p>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSpinner message="Loading recipes..." />}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-red-500 text-lg mb-2">Failed to load recipes</p>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {/* Recipes Grid */}
            {!isLoading && !error && (
              <>
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No recipes found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(filters.page! - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === pagination.pages ||
                            Math.abs(page - filters.page!) <= 2
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filters.page === page
                                  ? 'bg-primary-500 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}

                      <button
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={filters.page === pagination.pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Recipes;