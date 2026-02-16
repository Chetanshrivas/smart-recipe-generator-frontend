import React, { useState, useRef, useCallback } from 'react';
import { Plus, X, Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseIngredients, getIngredientIcon } from '../utils/helpers';
import { uploadApi } from '../services/api';

interface IngredientSearchProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({
  ingredients,
  onIngredientsChange,
  onSearch,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = useCallback(() => {
    const parsed = parseIngredients(inputValue);
    if (parsed.length > 0) {
      const newIngredients = [...new Set([...ingredients, ...parsed])];
      onIngredientsChange(newIngredients);
      setInputValue('');
      toast.success(`Added ${parsed.length} ingredient(s)`);
    }
  }, [inputValue, ingredients, onIngredientsChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(newIngredients);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsRecognizing(true);
    try {
      const response = await uploadApi.recognizeIngredients(file);
      if (response.success && response.data.ingredients.length > 0) {
        const detectedIngredients = response.data.ingredients.map(ing => ing.name);
        const newIngredients = [...new Set([...ingredients, ...detectedIngredients])];
        onIngredientsChange(newIngredients);
        toast.success(`Detected ${detectedIngredients.length} ingredients!`);
      } else {
        toast.error('No ingredients detected. Try a clearer image.');
      }
    } catch (error) {
      toast.error('Failed to recognize ingredients');
      console.error('Error:', error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const quickIngredients = [
    'Tomato', 'Onion', 'Garlic', 'Potato', 'Chicken',
    'Rice', 'Pasta', 'Cheese', 'Egg', 'Spinach'
  ];

  const addQuickIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient.toLowerCase())) {
      onIngredientsChange([...ingredients, ingredient.toLowerCase()]);
      toast.success(`Added ${ingredient}`);
    } else {
      toast.error(`${ingredient} already added`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">What ingredients do you have?</h2>
          <p className="text-gray-500 text-sm">Type, paste, or upload a photo of your ingredients</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        {/* Text Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., tomato, onion, garlic..."
              className="input-field pr-10"
              disabled={isLoading}
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleAddIngredient}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary px-4"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Image Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          {isRecognizing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
              <p className="text-gray-600">Analyzing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <Camera className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-700 font-medium">
                <Upload className="w-4 h-4 inline mr-1" />
                Upload or drag ingredient photo
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Supports JPG, PNG, WebP
              </p>
            </div>
          )}
        </div>

        {/* Quick Add */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {quickIngredients.map((ing) => (
              <button
                key={ing}
                onClick={() => addQuickIngredient(ing)}
                disabled={ingredients.includes(ing.toLowerCase())}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  ingredients.includes(ing.toLowerCase())
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                <span className="mr-1">{getIngredientIcon(ing)}</span>
                {ing}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => onIngredientsChange([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <span className="mr-1.5">{getIngredientIcon(ingredient)}</span>
                  <span className="capitalize">{ingredient}</span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Finding recipes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Find Recipes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IngredientSearch;