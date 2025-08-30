import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
}

const InfoPill: React.FC<{ icon: string, text: string | number, className?: string }> = ({ icon, text, className = '' }) => (
  <div className={`flex items-center gap-1.5 bg-[#262626] border border-gray-700 px-2 py-0.5 rounded-full ${className}`}>
    <span role="img" aria-hidden="true" className="text-sm">{icon}</span>
    <span className="text-xs">{text}</span>
  </div>
);

const getDifficulty = (recipe: Recipe): { level: 'Easy' | 'Medium' | 'Hard'; color: string } => {
    const { readyInMinutes, extendedIngredients } = recipe;
    const ingredientCount = extendedIngredients?.length || (recipe.usedIngredientCount + recipe.missedIngredientCount);
    
    if (readyInMinutes < 30 && ingredientCount < 10) return { level: 'Easy', color: 'bg-green-500/80' };
    if (readyInMinutes < 60 && ingredientCount < 15) return { level: 'Medium', color: 'bg-yellow-500/80' };
    return { level: 'Hard', color: 'bg-red-500/80' };
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelectRecipe }) => {
  const {
    title,
    image,
    readyInMinutes,
    aggregateLikes,
    usedIngredientCount,
    missedIngredientCount,
    missedIngredients,
    servings
  } = recipe;

  const totalIngredients = usedIngredientCount + missedIngredientCount;
  const matchPercentage = totalIngredients > 0 ? Math.round((usedIngredientCount / totalIngredients) * 100) : 0;
  
  const canMakeNow = missedIngredientCount === 0;
  const difficulty = getDifficulty(recipe);

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff6b35]/10 flex flex-col group">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div 
          className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full text-white ${difficulty.color}`}
        >
          {difficulty.level}
        </div>
        <div 
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white ${canMakeNow ? 'bg-green-500/80' : 'bg-amber-500/80'}`}
        >
          {canMakeNow ? "Ready to cook" : `Missing ${missedIngredientCount}`}
        </div>
        <div className="absolute bottom-2 left-4 right-4">
           <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 text-gray-300 mb-4">
          <InfoPill icon="🕒" text={`${readyInMinutes} min`} />
          <InfoPill icon="⭐" text={`${aggregateLikes} likes`} />
          <InfoPill icon="🍽️" text={`${servings} servings`} />
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
          <div className="bg-[#ff6b35] h-1.5 rounded-full" style={{ width: `${matchPercentage}%` }} title={`${matchPercentage}% ingredient match`}></div>
        </div>
        <p className="text-xs text-gray-400 mb-4">{`${usedIngredientCount} of your ${totalIngredients} ingredients used`}</p>

        {missedIngredients.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-amber-400 mb-1">You also need:</p>
            <p className="text-xs text-gray-400 leading-snug max-h-10 overflow-hidden text-ellipsis">
              {missedIngredients.map(i => i.name).join(', ')}
            </p>
          </div>
        )}
        
        <button 
          onClick={() => onSelectRecipe(recipe)}
          className="mt-auto text-center w-full bg-[#262626] hover:bg-[#ff6b35] hover:text-white border border-gray-700 hover:border-[#ff6b35] text-[#ff6b35] font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};
