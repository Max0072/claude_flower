import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCategory, setSearchTerm, setSortBy } from '../../redux/slices/productsSlice';

const ProductFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get current filter values from Redux
  const { selectedCategory, sortBy, searchTerm } = useAppSelector(
    (state) => state.products
  );
  
  // Local state for search input
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  // Handle category change
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = e.target.value === 'all' ? null : e.target.value;
    dispatch(setCategory(category));
  };
  
  // Handle sort change
  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as 'price_asc' | 'price_desc' | 'newest';
    dispatch(setSortBy(value));
  };
  
  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearch));
  };
  
  return (
    <div className="product-filters">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary">
          Найти
        </button>
      </form>
      
      <div className="filter-options">
        <div className="form-group">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={selectedCategory || 'all'}
            onChange={handleCategoryChange}
            className="form-control"
          >
            <option value="all">Все товары</option>
            <option value="roses">Розы</option>
            <option value="bouquets">Букеты</option>
            <option value="arrangements">Композиции</option>
            <option value="plants">Растения</option>
            <option value="gifts">Подарки</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="sort">Сортировка</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="form-control"
          >
            <option value="newest">Сначала новые</option>
            <option value="price_asc">Цена: по возрастанию</option>
            <option value="price_desc">Цена: по убыванию</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;