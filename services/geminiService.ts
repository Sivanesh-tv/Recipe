
// FIX: Import RecipeSummary and RecipeDetail types to resolve compilation errors.
import type { Recipe, Filters, RecipeSummary, RecipeDetail } from '../types';

// This service has been updated to use the Spoonacular API.
const API_KEY = 'bc66c52c849d47bb970ddfbee3ef2cfb';
const API_BASE_URL = 'https://api.spoonacular.com';

const MOCK_RECIPES: Recipe[] = [
  {
    "id": 641803,
    "title": "Easy & Delish! ~ Apple Crumble",
    "image": "https://spoonacular.com/recipeImages/641803-312x231.jpg",
    "imageType": "jpg",
    "usedIngredientCount": 1,
    "missedIngredientCount": 2,
    "missedIngredients": [
      { "id": 1001, "amount": 1, "unit": "serving", "name": "butter", "original": "butter", "aisle": "Milk, Eggs, Other Dairy", "image": "https://spoonacular.com/cdn/ingredients_100x100/butter-sliced.jpg", "unitLong": "serving", "unitShort": "serving", "originalName": "butter", "meta": [] },
      { "id": 19335, "amount": 1, "unit": "serving", "name": "sugar", "original": "sugar", "aisle": "Baking", "image": "https://spoonacular.com/cdn/ingredients_100x100/sugar-in-bowl.png", "unitLong": "serving", "unitShort": "serving", "originalName": "sugar", "meta": [] }
    ],
    "usedIngredients": [
      { "id": 9003, "amount": 1, "unit": "serving", "name": "apple", "original": "apple", "aisle": "Produce", "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg", "unitLong": "serving", "unitShort": "serving", "originalName": "apple", "meta": [] }
    ],
    // FIX: Added 'extendedIngredients' to mock data to match the 'Recipe' type. It was missing and causing a type error.
    "extendedIngredients": [
        { "id": 9003, "amount": 1, "unit": "serving", "name": "apple", "original": "apple", "aisle": "Produce", "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg", "unitLong": "serving", "unitShort": "serving", "originalName": "apple", "meta": [] },
        { "id": 1001, "amount": 1, "unit": "serving", "name": "butter", "original": "butter", "aisle": "Milk, Eggs, Other Dairy", "image": "https://spoonacular.com/cdn/ingredients_100x100/butter-sliced.jpg", "unitLong": "serving", "unitShort": "serving", "originalName": "butter", "meta": [] },
        { "id": 19335, "amount": 1, "unit": "serving", "name": "sugar", "original": "sugar", "aisle": "Baking", "image": "https://spoonacular.com/cdn/ingredients_100x100/sugar-in-bowl.png", "unitLong": "serving", "unitShort": "serving", "originalName": "sugar", "meta": [] }
    ],
    "servings": 2, "readyInMinutes": 45, "sourceUrl": "http://www.foodista.com/recipe/P32B6B6N/easy-delish-apple-crumble",
    "spoonacularScore": 96, "aggregateLikes": 122, "healthScore": 5,
    "summary": "A delicious apple crumble dessert.",
    "cuisines": ["European", "British"], "dishTypes": ["dessert"], "diets": ["lacto ovo vegetarian"],
    "analyzedInstructions": []
  }
];

export const findRecipes = async (ingredients: string[], filters: Filters): Promise<Recipe[]> => {
  if (!API_KEY) {
    console.warn("Spoonacular API key is missing. Returning mock data.");
    return MOCK_RECIPES;
  }

  const ingredientsString = ingredients.join(',');

  const params = new URLSearchParams({
    apiKey: API_KEY,
    ingredients: ingredientsString,
    number: '12',
    ranking: '1',
    ignorePantry: 'true',
  });

  if (filters.diet) params.append('diet', filters.diet);
  if (filters.cuisine) params.append('cuisine', filters.cuisine);
  if (filters.mealType) params.append('type', filters.mealType);
  if (filters.maxReadyTime) params.append('maxReadyTime', filters.maxReadyTime);

  try {
    const findByIngredientsResponse = await fetch(`${API_BASE_URL}/recipes/findByIngredients?${params.toString()}`);
    if (!findByIngredientsResponse.ok) {
        const errorData = await findByIngredientsResponse.json();
        throw new Error(`[${findByIngredientsResponse.status}] ${errorData.message}`);
    }
    const recipesSummary: RecipeSummary[] = await findByIngredientsResponse.json();

    if (!recipesSummary || recipesSummary.length === 0) {
        return [];
    }

    const recipeIds = recipesSummary.map(recipe => recipe.id).join(',');
    const bulkParams = new URLSearchParams({ apiKey: API_KEY, ids: recipeIds });
    const getInfoBulkResponse = await fetch(`${API_BASE_URL}/recipes/informationBulk?${bulkParams.toString()}`);

    if (!getInfoBulkResponse.ok) {
        const errorData = await getInfoBulkResponse.json();
        throw new Error(`[${getInfoBulkResponse.status}] ${errorData.message}`);
    }
    const recipesDetails: RecipeDetail[] = await getInfoBulkResponse.json();
    
    const combinedRecipes = recipesDetails.map((detail): Recipe => {
        const summary = recipesSummary.find(s => s.id === detail.id);
        return {
            ...detail,
            usedIngredients: summary?.usedIngredients || [],
            missedIngredients: summary?.missedIngredients || [],
            usedIngredientCount: summary?.usedIngredientCount || 0,
            missedIngredientCount: summary?.missedIngredientCount || 0,
        };
    });

    return combinedRecipes;

  } catch (error) {
    console.error("Error fetching from Spoonacular:", error);
    throw new Error("Failed to fetch recipes. The API might be unavailable. Please try again later.");
  }
};
