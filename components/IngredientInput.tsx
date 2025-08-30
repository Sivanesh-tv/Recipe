
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Ingredient, Filters } from '../types';
import { Category } from '../types';
import { COMMON_INGREDIENTS, DIETS, CUISINES, MEAL_TYPES, COOK_TIMES } from '../constants';
import { SearchIcon } from './icons/SearchIcon';
import { PlusIcon } from './icons/PlusIcon';

interface IngredientInputProps {
  onAddIngredient: (ingredient: Ingredient) => void;
  selectedIngredients: Ingredient[];
  filters: Filters;
  onFilterChange: (name: keyof Filters, value: string) => void;
}

const CATEGORY_ICONS: { [key in Category]?: string } = {
  [Category.Vegetables]: '🥕',
  [Category.Proteins]: '🥩',
  [Category.Dairy]: '🧀',
  [Category.Grains]: '🌾',
  [Category.Spices]: '🌿',
  [Category.Fruits]: '🍎',
};

const FilterSelect: React.FC<{
  name: keyof Filters;
  label: string;
  value: string;
  options: { value: string; label: string }[] | string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ name, label, value, options, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-[#262626] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition"
    >
      <option value="">Any</option>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lab = typeof opt === 'string' ? opt : opt.label;
        const optionVal = val.toLowerCase();
        return <option key={optionVal} value={optionVal}>{lab}</option>;
      })}
    </select>
  </div>
);


export const IngredientInput: React.FC<IngredientInputProps> = ({ onAddIngredient, selectedIngredients, filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return COMMON_INGREDIENTS.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(lowercasedTerm) &&
        !selectedIngredients.some(sel => sel.name.toLowerCase() === ingredient.name.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, selectedIngredients]);

  const handleAddIngredient = useCallback((ingredient: Ingredient) => {
    onAddIngredient(ingredient);
    setSearchTerm('');
  }, [onAddIngredient]);

  const handleAddCustom = () => {
    if (searchTerm.trim()) {
      handleAddIngredient({ name: searchTerm.trim(), category: Category.Custom });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(filteredIngredients.length > 0) {
          handleAddIngredient(filteredIngredients[0]);
      } else {
          handleAddCustom();
      }
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.parentElement?.contains(target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleFilterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.name as keyof Filters, e.target.value);
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Add Ingredients</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="What's in your fridge today?"
            className="w-full bg-[#262626] border border-gray-700 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-shadow duration-300"
            aria-autocomplete="list"
            aria-controls="ingredient-suggestions"
          />
          {isFocused && (filteredIngredients.length > 0 || searchTerm.length > 0) && (
            <ul ref={dropdownRef} id="ingredient-suggestions" role="listbox" className="absolute z-20 w-full mt-2 bg-[#262626] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredIngredients.map((ingredient) => (
                <li
                  key={ingredient.name}
                  onClick={() => handleAddIngredient(ingredient)}
                  className="px-4 py-2 text-gray-300 hover:bg-[#333] cursor-pointer"
                  role="option"
                  aria-selected="false"
                >
                  {ingredient.name}
                </li>
              ))}
              {searchTerm.length > 0 && !COMMON_INGREDIENTS.some(i => i.name.toLowerCase() === searchTerm.toLowerCase().trim()) && (
                <li
                  onClick={handleAddCustom}
                  className="px-4 py-2 text-gray-300 hover:bg-[#333] cursor-pointer flex items-center"
                  role="option"
                  aria-selected="false"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add "{searchTerm.trim()}" as a custom ingredient
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Or quick-add by category:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
              <button
                key={category}
                onClick={() => {
                  const ingredient = COMMON_INGREDIENTS.find(i => i.category === category && !selectedIngredients.some(s => s.name === i.name));
                  if (ingredient) onAddIngredient(ingredient);
                }}
                className="bg-[#262626] hover:bg-[#333] border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors duration-200 flex items-center"
              >
                <span className="mr-1.5">{icon}</span>
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 my-6"></div>

      <div>
        <h3 className="text-xl font-bold mb-4">Refine Your Search</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FilterSelect name="diet" label="Dietary" value={filters.diet} options={DIETS} onChange={handleFilterSelectChange} />
            <FilterSelect name="cuisine" label="Cuisine" value={filters.cuisine} options={CUISINES} onChange={handleFilterSelectChange} />
            <FilterSelect name="mealType" label="Meal Type" value={filters.mealType} options={MEAL_TYPES} onChange={handleFilterSelectChange} />
            <FilterSelect name="maxReadyTime" label="Max Cook Time" value={filters.maxReadyTime} options={COOK_TIMES} onChange={handleFilterSelectChange} />
        </div>
      </div>
    </div>
  );
};
