import axios from 'axios';
import { Meal, MealSummary } from '../types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; 

const withCache = async (key: string, apiCall: () => Promise<any>) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_DURATION) {
    return cache[key].data;
  }
  
  const data = await apiCall();
  cache[key] = { data, timestamp: now };
  return data;
};

export const mealService = {
  searchMeals: async (query: string): Promise<MealSummary[]> => {
    try {
      return await withCache(`search-${query}`, async () => {
        const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
        return response.data.meals || [];
      });
    } catch (error) {
      console.error('Search error:', error);
      return [
        {
          idMeal: '1',
          strMeal: 'Chicken Curry',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
          strCategory: 'Chicken',
          strArea: 'Indian'
        },
        {
          idMeal: '2', 
          strMeal: 'Beef Stroganoff',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/svprys1511176755.jpg',
          strCategory: 'Beef',
          strArea: 'Russian'
        }
      ];
    }
  },
  
  getMealById: async (id: string): Promise<Meal | null> => {
    try {
      return await withCache(`meal-${id}`, async () => {
        const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
        return response.data.meals ? response.data.meals[0] : null;
      });
    } catch (error) {
      console.error('Get meal error:', error);
      return null;
    }
  },
  
  getMealsByCategory: async (category: string): Promise<MealSummary[]> => {
    try {
      return await withCache(`category-${category}`, async () => {
        const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
        return response.data.meals || [];
      });
    } catch (error) {
      console.error('Category error:', error);
      return [];
    }
  },
  
  getCategories: async (): Promise<string[]> => {
    try {
      return await withCache('categories', async () => {
        const response = await axios.get(`${BASE_URL}/categories.php`);
        return response.data.categories.map((cat: any) => cat.strCategory);
      });
    } catch (error) {
      console.error('Categories error:', error);
      return ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 'Pasta', 'Pork', 'Seafood', 'Vegetarian'];
    }
  }
};