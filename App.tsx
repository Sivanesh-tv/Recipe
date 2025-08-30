import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { SelectedIngredients } from './components/SelectedIngredients';
import { RecipeDisplay } from './components/RecipeDisplay';
import { findRecipes } from './services/geminiService';
import type { Ingredient, Recipe, Filters, ShoppingListItem } from './types';
import { INITIAL_INGREDIENTS } from './constants';
import { RecipeModal } from './components/RecipeModal';
import { ShoppingList } from './components/ShoppingList';

const App: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    diet: '',
    cuisine: '',
    mealType: '',
    maxReadyTime: '',
  });
  const [sortBy, setSortBy] = useState('match');

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const addIngredient = useCallback((ingredient: Ingredient) => {
    if (!selectedIngredients.some(i => i.name.toLowerCase() === ingredient.name.toLowerCase())) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  }, [selectedIngredients]);

  const removeIngredient = useCallback((ingredientName: string) => {
    setSelectedIngredients(prev => prev.filter(i => i.name !== ingredientName));
  }, []);
  
  const clearIngredients = useCallback(() => {
    setSelectedIngredients([]);
  }, []);

  const handleFilterChange = useCallback((name: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFindRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please add some ingredients first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRecipes([]);

    try {
      const ingredientNames = selectedIngredients.map(i => i.name);
      const fetchedRecipes = await findRecipes(ingredientNames, filters);
      setRecipes(fetchedRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      const errorMessage = err instanceof Error ? err.message : "Sorry, we couldn't fetch recipes at the moment. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedRecipes = useMemo(() => {
    const sorted = [...recipes];
    if (sortBy === 'time') {
        sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (sortBy === 'rating') {
        sorted.sort((a, b) => b.aggregateLikes - a.aggregateLikes);
    }
    return sorted;
  }, [recipes, sortBy]);

  const handleSelectRecipe = (recipe: Recipe) => setSelectedRecipe(recipe);
  const handleCloseModal = () => setSelectedRecipe(null);

  const handleAddToShoppingList = useCallback((items: ShoppingListItem[]) => {
    setShoppingList(prevList => {
      const newList = [...prevList];
      items.forEach(item => {
        if (!newList.some(i => i.id === item.id)) {
          newList.push(item);
        }
      });
      return newList;
    });
  }, []);

  const handleRemoveFromShoppingList = useCallback((itemId: number) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const handleClearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SelectedIngredients 
              ingredients={selectedIngredients} 
              onRemove={removeIngredient} 
              onClear={clearIngredients} 
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <IngredientInput 
              onAddIngredient={addIngredient} 
              selectedIngredients={selectedIngredients}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <RecipeDisplay 
              recipes={sortedRecipes} 
              isLoading={isLoading} 
              error={error} 
              hasSearched={hasSearched}
              onFindRecipes={handleFindRecipes} 
              hasIngredients={selectedIngredients.length > 0}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectRecipe={handleSelectRecipe}
            />
          </div>
          <div className="lg:col-span-1">
            <ShoppingList
              items={shoppingList}
              onRemove={handleRemoveFromShoppingList}
              onClear={handleClearShoppingList}
            />
          </div>
        </div>
      </main>
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={handleCloseModal}
          onAddToShoppingList={handleAddToShoppingList}
        />
      )}
    </div>
  );
};

export default App;
