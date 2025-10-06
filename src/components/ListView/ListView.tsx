import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MealSummary, SortField, SortOrder } from '../../types/meal';
import { mealService } from '../../services/mealService';
import './ListView.css';

const ListView = () => {
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      if (searchQuery.trim() === '') {
        setMeals([]);
        return;
      }

      setLoading(true);
      try {
        const results = await mealService.searchMeals(searchQuery);
        setMeals(results);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMeals, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

const sortedMeals = useMemo(() => {
  return [...meals].sort((a: MealSummary, b: MealSummary) => {
    // Map sortField to actual meal property names
    const getSortValue = (meal: MealSummary, field: SortField): string => {
      switch (field) {
        case 'name':
          return meal.strMeal.toLowerCase();
        case 'category':
          return (meal.strCategory || '').toLowerCase();
        case 'area':
          return (meal.strArea || '').toLowerCase();
        default:
          return '';
      }
    };

    let aValue = getSortValue(a, sortField);
    let bValue = getSortValue(b, sortField);

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}, [meals, sortField, sortOrder]);

const SortIndicator: React.FC<{ field: SortField; currentField: SortField; order: SortOrder }> = 
  ({ field, currentField, order }) => {
  if (field !== currentField) return null;
  return <span>{order === 'asc' ? ' ↑' : ' ↓'}</span>;
};
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="list-view">
      <h1>Search Meals</h1>
      
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="sort-controls">
          <div className="sort-dropdown">
            <label htmlFor="sort-field">Sort by:</label>
            <select 
              id="sort-field"
              value={sortField} 
              onChange={(e) => handleSortChange(e.target.value as SortField)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="area">Area</option>
            </select>
          </div>
          
          <div className="order-controls">
            <label>Order:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="sort-order"
                  value="asc"
                  checked={sortOrder === 'asc'}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                />
                Ascending
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="sort-order"
                  value="desc"
                  checked={sortOrder === 'desc'}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                />
                Descending
              </label>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="meal-list">
        {sortedMeals.map(meal => (
          <Link key={meal.idMeal} to={`/detail/${meal.idMeal}`} className="meal-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="meal-info">
              <h3>{meal.strMeal}</h3>
              {meal.strCategory && <p>Category: {meal.strCategory}</p>}
              {meal.strArea && <p>Area: {meal.strArea}</p>}
            </div>
          </Link>
        ))}
      </div>

      {!loading && searchQuery && sortedMeals.length === 0 && (
        <div className="no-results">No meals found for "{searchQuery}"</div>
      )}
    </div>
  );
};

export default ListView;