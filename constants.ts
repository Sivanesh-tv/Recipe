
import type { Ingredient } from './types';
import { Category } from './types';

export const CATEGORY_STYLES: { [key in Category]: { bg: string; text: string; border: string } } = {
  [Category.Vegetables]: { bg: 'bg-green-900/50', text: 'text-green-300', border: 'border-green-500/50' },
  [Category.Proteins]: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-500/50' },
  [Category.Dairy]: { bg: 'bg-amber-900/50', text: 'text-amber-300', border: 'border-amber-500/50' },
  [Category.Grains]: { bg: 'bg-orange-900/50', text: 'text-orange-300', border: 'border-orange-500/50' },
  [Category.Spices]: { bg: 'bg-violet-900/50', text: 'text-violet-300', border: 'border-violet-500/50' },
  [Category.Fruits]: { bg: 'bg-pink-900/50', text: 'text-pink-300', border: 'border-pink-500/50' },
  [Category.Custom]: { bg: 'bg-gray-700/50', text: 'text-gray-300', border: 'border-gray-500/50' },
};

export const COMMON_INGREDIENTS: Ingredient[] = [
  { name: 'Chicken Breast', category: Category.Proteins },
  { name: 'Ground Beef', category: Category.Proteins },
  { name: 'Salmon', category: Category.Proteins },
  { name: 'Eggs', category: Category.Proteins },
  { name: 'Tofu', category: Category.Proteins },
  { name: 'Onion', category: Category.Vegetables },
  { name: 'Garlic', category: Category.Vegetables },
  { name: 'Tomato', category: Category.Vegetables },
  { name: 'Potato', category: Category.Vegetables },
  { name: 'Carrot', category: Category.Vegetables },
  { name: 'Bell Pepper', category: Category.Vegetables },
  { name: 'Broccoli', category: Category.Vegetables },
  { name: 'Spinach', category: Category.Vegetables },
  { name: 'Lettuce', category: Category.Vegetables },
  { name: 'Cucumber', category: Category.Vegetables },
  { name: 'Zucchini', category: Category.Vegetables },
  { name: 'Mushroom', category: Category.Vegetables },
  { name: 'Avocado', category: Category.Vegetables },
  { name: 'Apple', category: Category.Fruits },
  { name: 'Banana', category: Category.Fruits },
  { name: 'Lemon', category: Category.Fruits },
  { name: 'Lime', category: Category.Fruits },
  { name: 'Orange', category: Category.Fruits },
  { name: 'Berries', category: Category.Fruits },
  { name: 'Milk', category: Category.Dairy },
  { name: 'Cheese', category: Category.Dairy },
  { name: 'Yogurt', category: Category.Dairy },
  { name: 'Butter', category: Category.Dairy },
  { name: 'Sour Cream', category: Category.Dairy },
  { name: 'Rice', category: Category.Grains },
  { name: 'Pasta', category: Category.Grains },
  { name: 'Bread', category: Category.Grains },
  { name: 'Quinoa', category: Category.Grains },
  { name: 'Oats', category: Category.Grains },
  { name: 'Flour', category: Category.Grains },
  { name: 'Salt', category: Category.Spices },
  { name: 'Black Pepper', category: Category.Spices },
  { name: 'Olive Oil', category: Category.Spices },
  { name: 'Vegetable Oil', category: Category.Spices },
  { name: 'Paprika', category: Category.Spices },
  { name: 'Cumin', category: Category.Spices },
  { name: 'Chili Powder', category: Category.Spices },
  { name: 'Oregano', category: Category.Spices },
  { name: 'Basil', category: Category.Spices },
  { name: 'Thyme', category: Category.Spices },
  { name: 'Rosemary', category: Category.Spices },
  { name: 'Soy Sauce', category: Category.Spices },
  { name: 'Vinegar', category: Category.Spices },
  { name: 'Sugar', category: Category.Spices },
  { name: 'Honey', category: Category.Spices },
  { name: 'Mustard', category: Category.Spices },
  { name: 'Ketchup', category: Category.Spices },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
    { name: 'Chicken Breast', category: Category.Proteins },
    { name: 'Onion', category: Category.Vegetables },
    { name: 'Garlic', category: Category.Vegetables },
    { name: 'Olive Oil', category: Category.Spices },
];

export const DIETS = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Ketogenic', 'Pescetarian'];
export const CUISINES = ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'Japanese', 'Chinese', 'French', 'Thai'];
export const MEAL_TYPES = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'breakfast', 'soup', 'snack', 'drink'];
export const COOK_TIMES = [
    { label: 'Under 30 min', value: '30' },
    { label: 'Under 1 hour', value: '60' },
];
