export enum Category {
  Vegetables = 'Vegetables',
  Proteins = 'Proteins',
  Dairy = 'Dairy',
  Grains = 'Grains',
  Spices = 'Spices',
  Fruits = 'Fruits',
  Custom = 'Custom',
}

export interface Ingredient {
  name: string;
  category: Category;
}

export interface Filters {
  diet: string;
  cuisine: string;
  mealType: string;
  maxReadyTime: string;
}

export interface IngredientInfo {
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    image: string;
}

export type ShoppingListItem = IngredientInfo;

export interface RecipeSummary {
    id: number;
    title: string;
    image: string;
    imageType: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    missedIngredients: IngredientInfo[];
    usedIngredients: IngredientInfo[];
    likes: number;
}

export interface AnalyzedInstruction {
    name: string;
    steps: { number: number; step: string; }[];
}

export interface RecipeDetail {
    id: number;
    title: string;
    image: string;
    imageType: string;
    servings: number;
    readyInMinutes: number;
    sourceUrl: string;
    spoonacularScore: number;
    aggregateLikes: number;
    healthScore: number;
    summary: string;
    cuisines: string[];
    dishTypes: string[];
    diets: string[];
    analyzedInstructions: AnalyzedInstruction[];
    extendedIngredients: (IngredientInfo & { original: string })[];
}

export type Recipe = RecipeDetail & Pick<RecipeSummary, 'missedIngredients' | 'usedIngredients' | 'usedIngredientCount' | 'missedIngredientCount'>;
