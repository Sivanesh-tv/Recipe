import React, { useState, useEffect } from 'react';
import type { Recipe, ShoppingListItem } from '../types';
import { XIcon } from './icons/XIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PrinterIcon } from './icons/PrinterIcon';
import { ShareIcon } from './icons/ShareIcon';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (items: ShoppingListItem[]) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onAddToShoppingList }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleToggleIngredient = (id: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe for ${recipe.title}!`,
          url: recipe.sourceUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support Web Share API
      navigator.clipboard.writeText(recipe.sourceUrl);
      alert('Recipe link copied to clipboard!');
    }
  };

  const allIngredients = recipe.extendedIngredients || [];
  const instructions = recipe.analyzedInstructions?.[0]?.steps || [{ number: 1, step: 'No instructions provided. Please check the source link.' }];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
    >
      <div
        className="bg-[#1a1a1a] text-white w-full max-w-4xl h-[90vh] rounded-lg border border-gray-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="relative">
          <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h2 id="recipe-title" className="text-3xl font-bold">{recipe.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.summary.substring(0, 200) + '...' }} className="text-sm text-gray-400 mt-2 max-w-2xl"></div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Close recipe modal">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-4 text-center">
                <div className="flex-1">
                    <p className="text-2xl font-bold text-[#ff6b35]">{recipe.readyInMinutes}</p>
                    <p className="text-xs text-gray-400">Minutes</p>
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-[#ff6b35]">{allIngredients.length}</p>
                    <p className="text-xs text-gray-400">Ingredients</p>
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-[#ff6b35]">{recipe.aggregateLikes}</p>
                    <p className="text-xs text-gray-400">Likes</p>
                </div>
            </div>
             <div className="flex flex-wrap gap-2">
                <button onClick={() => onAddToShoppingList(recipe.missedIngredients)} disabled={recipe.missedIngredientCount === 0} className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5a1f] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <ShoppingCartIcon className="w-5 h-5"/> Add Missing
                </button>
                <button onClick={handleShare} className="p-2 bg-[#262626] hover:bg-[#333] rounded-lg border border-gray-700" aria-label="Share recipe"><ShareIcon className="w-5 h-5"/></button>
                <button onClick={handlePrint} className="p-2 bg-[#262626] hover:bg-[#333] rounded-lg border border-gray-700" aria-label="Print recipe"><PrinterIcon className="w-5 h-5"/></button>
            </div>
            <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Ingredients</h3>
            <ul className="space-y-2 text-sm">
              {allIngredients.map(ing => (
                <li key={ing.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ing-${ing.id}`}
                    checked={checkedIngredients.has(ing.id)}
                    onChange={() => handleToggleIngredient(ing.id)}
                    className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#ff6b35] focus:ring-[#ff6b35] mr-3"
                  />
                  <label htmlFor={`ing-${ing.id}`} className={`flex-1 cursor-pointer ${checkedIngredients.has(ing.id) ? 'line-through text-gray-500' : ''}`}>
                    {ing.original}
                  </label>
                </li>
              ))}
            </ul>
          </aside>
          <main className="md:col-span-2">
            <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Instructions</h3>
            <ol className="space-y-4 text-sm text-gray-300">
              {instructions.map(step => (
                <li key={step.number} className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-[#ff6b35] text-white font-bold">{step.number}</span>
                  <p className="flex-1 pt-1">{step.step}</p>
                </li>
              ))}
            </ol>
          </main>
        </div>
      </div>
    </div>
  );
};
