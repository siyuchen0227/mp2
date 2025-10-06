import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MealSummary } from '../../types/meal';
import { mealService } from '../../services/mealService';
import './GalleryView.css';

const GalleryView = () => {
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await mealService.getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        if (selectedCategory === 'all') {
          // 获取所有类别的餐点
          const allMeals: MealSummary[] = [];
          for (const category of categories) {
            const categoryMeals = await mealService.getMealsByCategory(category);
            const mealsWithCategory = categoryMeals.map(meal => ({
              ...meal,
              strCategory: category
            }));
            allMeals.push(...mealsWithCategory);
          }
          setMeals(allMeals);
        } else {
          // 获取特定类别的餐点
          const categoryMeals = await mealService.getMealsByCategory(selectedCategory);
          const mealsWithCategory = categoryMeals.map(meal => ({
            ...meal,
            strCategory: selectedCategory
          }));
          setMeals(mealsWithCategory);
        }
      } catch (error) {
        console.error('Failed to fetch gallery meals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchMeals();
    }
  }, [selectedCategory, categories]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="gallery-view">
      <h1>Meal Gallery</h1>
      
      <div className="filter-controls">
        <div className="category-filters">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading gallery...</div>}

      <div className="gallery-grid">
        {meals.map(meal => (
          <Link key={meal.idMeal} to={`/detail/${meal.idMeal}`} className="gallery-item">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="gallery-overlay">
              <h3>{meal.strMeal}</h3>
              {meal.strCategory && <span className="category-badge">{meal.strCategory}</span>}
            </div>
          </Link>
        ))}
      </div>

      {!loading && meals.length === 0 && (
        <div className="no-results">No meals found</div>
      )}
    </div>
  );
};

export default GalleryView;