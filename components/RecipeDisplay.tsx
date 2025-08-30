import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { SkeletonCard } from './SkeletonCard';
import { SearchIcon } from './icons/SearchIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface RecipeDisplayProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  onFindRecipes: () => void;
  hasSearched: boolean;
  hasIngredients: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipes,
  isLoading,
  error,
  onFindRecipes,
  hasSearched,
  hasIngredients,
  sortBy,
  onSortChange,
  onSelectRecipe,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-red-500/30">
          <AlertTriangleIcon className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-red-400">An Error Occurred</h3>
          <p className="text-gray-400 max-w-md mx-auto">{error}</p>
        </div>
      );
    }
    
    if (hasSearched && recipes.length === 0) {
      return (
        <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold">No Recipes Found</h3>
          <p className="text-gray-400">Try adjusting your ingredients or filters.</p>
        </div>
      );
    }

    if (recipes.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelectRecipe={onSelectRecipe} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onFindRecipes}
          disabled={!hasIngredients || isLoading}
          className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5a1f] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
        >
          <SearchIcon className="w-5 h-5" />
          {isLoading ? 'Finding Recipes...' : 'Find Recipes'}
        </button>
        {hasSearched && !isLoading && recipes.length > 0 && (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-sm text-gray-400 whitespace-nowrap">{recipes.length} recipes found</span>
            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full appearance-none bg-[#262626] border border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                aria-label="Sort recipes by"
              >
                <option value="match">Best Match</option>
                <option value="time">Quickest</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
