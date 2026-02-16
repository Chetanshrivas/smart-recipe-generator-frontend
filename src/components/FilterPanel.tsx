import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { recipeApi } from '../services/api';
import { DIFFICULTY_LEVELS, DIETARY_TAGS } from '../types';

interface FilterPanelProps {
  filters: {
    cuisine?: string;
    difficulty?: string;
    dietary?: string[];
    maxTime?: number;
    sortBy?: 'rating' | 'time' | 'newest';
  };
  onFilterChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [availableDietaryTags, setAvailableDietaryTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const [cuisinesRes, tagsRes] = await Promise.all([
          recipeApi.getCuisines(),
          recipeApi.getDietaryTags(),
        ]);
        if (cuisinesRes.success) setCuisines(cuisinesRes.data);
        if (tagsRes.success) setAvailableDietaryTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const timeOptions = [
    { value: 15, label: 'Under 15 min' },
    { value: 30, label: 'Under 30 min' },
    { value: 45, label: 'Under 45 min' },
    { value: 60, label: 'Under 1 hour' },
    { value: 90, label: 'Under 1.5 hours' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'time', label: 'Quickest' },
    { value: 'newest', label: 'Newest' },
  ];

  const handleDietaryToggle = (tag: string) => {
    const current = filters.dietary || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onFilterChange({ ...filters, dietary: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      cuisine: '',
      difficulty: '',
      dietary: [],
      maxTime: undefined,
      sortBy: 'rating',
    });
  };

  const hasActiveFilters =
    filters.cuisine ||
    filters.difficulty ||
    (filters.dietary && filters.dietary.length > 0) ||
    filters.maxTime;

  const activeFilterCount =
    (filters.cuisine ? 1 : 0) +
    (filters.difficulty ? 1 : 0) +
    (filters.dietary?.length || 0) +
    (filters.maxTime ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:hidden"
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4 space-y-6`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 hidden md:block">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'rating'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full input-field py-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine
          </label>
          <select
            value={filters.cuisine || ''}
            onChange={(e) => onFilterChange({ ...filters, cuisine: e.target.value })}
            className="w-full input-field py-2"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    difficulty: filters.difficulty === level ? '' : level,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.difficulty === level
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Max Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Time
          </label>
          <select
            value={filters.maxTime || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxTime: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full input-field py-2"
          >
            <option value="">Any Time</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dietary Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {availableDietaryTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleDietaryToggle(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.dietary?.includes(tag)
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;