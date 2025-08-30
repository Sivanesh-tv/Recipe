
import React from 'react';
import type { Ingredient } from '../types';
import { CATEGORY_STYLES } from '../constants';
import { XIcon } from './icons/XIcon';
import { EmptyFridgeIcon } from './icons/EmptyFridgeIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SelectedIngredientsProps {
  ingredients: Ingredient[];
  onRemove: (name: string) => void;
  onClear: () => void;
}

export const SelectedIngredients: React.FC<SelectedIngredientsProps> = ({ ingredients, onRemove, onClear }) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Your Ingredients</h2>
        {ingredients.length > 0 && (
          <button onClick={onClear} className="text-sm text-gray-400 hover:text-[#ff6b35] flex items-center gap-1 transition-colors">
            <TrashIcon className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
      
      {ingredients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
            <EmptyFridgeIcon className="w-24 h-24 mx-auto mb-4 text-gray-700" />
            <p className="font-semibold">Your fridge is empty!</p>
            <p className="text-sm">Add ingredients to find recipes.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => {
            const style = CATEGORY_STYLES[ingredient.category];
            return (
              <div
                key={ingredient.name}
                className={`flex items-center rounded-full px-3 py-1 text-sm font-medium border ${style.bg} ${style.text} ${style.border} transition-transform duration-300 transform hover:-translate-y-0.5`}
              >
                <span>{ingredient.name}</span>
                <button
                  onClick={() => onRemove(ingredient.name)}
                  className="ml-2 rounded-full hover:bg-white/20 p-0.5 focus:outline-none"
                  aria-label={`Remove ${ingredient.name}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
