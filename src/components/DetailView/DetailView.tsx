import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Meal } from '../../types/meal';
import { mealService } from '../../services/mealService';
import './DetailView.css';

const DetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMealIds, setAllMealIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);




  useEffect(() => {
    const fetchAllMealIds = async () => {
      try {
        const meals = await mealService.searchMeals('');
        const ids = meals.map(meal => meal.idMeal);
        setAllMealIds(ids);
        
        if (id) {
          const index = ids.indexOf(id);
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        console.error('Failed to fetch meal IDs:', error);
      }
    };

    fetchAllMealIds();
  }, [id]);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) {
        setError('No meal ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const mealData = await mealService.getMealById(id);
        if (mealData) {
          setMeal(mealData);
        } else {
          setError('Meal not found');
        }
      } catch (err) {
        setError('Failed to fetch meal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  const handlePrevious = () => {
    if (allMealIds.length > 0) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : allMealIds.length - 1;
      setCurrentIndex(newIndex);
      navigate(`/detail/${allMealIds[newIndex]}`);
    }
  };

  const handleNext = () => {
    if (allMealIds.length > 0) {
      const newIndex = currentIndex < allMealIds.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      navigate(`/detail/${allMealIds[newIndex]}`);
    }
  };

  const getIngredients = () => {
    if (!meal) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="detail-view">
        <div className="loading">Loading meal details...</div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="detail-view">
        <div className="error">
          <p>{error}</p>
          <Link to="/" className="back-link">← Back to List</Link>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();

  return (
    <div className="detail-view">
      <div className="detail-header">
        <Link to="/" className="back-link">← Back to List</Link>
        <div className="navigation-buttons">
          <button onClick={handlePrevious} className="nav-button">
            ← Previous
          </button>
          <span className="nav-info">
            {currentIndex + 1} of {allMealIds.length}
          </span>
          <button onClick={handleNext} className="nav-button">
            Next →
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="meal-image-section">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
          <div className="meal-tags">
            {meal.strCategory && <span className="tag category">{meal.strCategory}</span>}
            {meal.strArea && <span className="tag area">{meal.strArea}</span>}
            {meal.strTags && meal.strTags.split(',').map(tag => (
              <span key={tag} className="tag">{tag.trim()}</span>
            ))}
          </div>
        </div>

        <div className="meal-info-section">
          <h1 className="meal-title">{meal.strMeal}</h1>
          
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <span className="measure">{item.measure}</span>
                  <span className="ingredient">{item.ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions">
              {meal.strInstructions?.split('\r\n').filter(step => step.trim()).map((step, index) => (
                <p key={index} className="instruction-step">
                  {step}
                </p>
              ))}
            </div>
          </div>

          {meal.strYoutube && (
            <div className="video-section">
              <h2>Video Tutorial</h2>
              <a 
                href={meal.strYoutube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="youtube-link"
              >
                Watch on YouTube →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailView;