import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './CatalogPage.module.scss';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';

// Mock categories for filter
const categories = [
  { id: 'all', name: 'Все товары' },
  { id: 'bouquets', name: 'Букеты' },
  { id: 'roses', name: 'Розы' },
  { id: 'plants', name: 'Растения' },
  { id: 'gifts', name: 'Подарки' },
];

// Mock products data
const products = [
  {
    id: '1',
    name: 'Букет "Весеннее настроение"',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'bouquets',
    isBestseller: true
  },
  {
    id: '2',
    name: 'Розы "Ред Наоми"',
    price: 4200,
    discountPrice: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'roses'
  },
  {
    id: '3',
    name: 'Монстера Делициоза',
    price: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'plants',
    isNew: true
  },
  {
    id: '4',
    name: 'Букет "Нежное прикосновение"',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1599733594230-5cc2b8cf2d2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'bouquets'
  },
  {
    id: '5',
    name: 'Фиалка африканская',
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1612722632782-539564602b29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'plants'
  },
  {
    id: '6',
    name: 'Букет из 25 роз',
    price: 6700,
    discountPrice: 5900,
    imageUrl: 'https://images.unsplash.com/photo-1561181287-b8bfa5ae181c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'bouquets'
  },
  {
    id: '7',
    name: 'Подарочный набор "Особый случай"',
    price: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'gifts'
  },
  {
    id: '8',
    name: 'Орхидея Фаленопсис',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1585938638468-2cf574694686?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'plants',
    isNew: true
  }
];

// Price ranges for filter
const priceRanges = [
  { id: 'all', name: 'Все цены' },
  { id: '0-1000', name: 'До 1000 ₽' },
  { id: '1000-3000', name: '1000 - 3000 ₽' },
  { id: '3000-5000', name: '3000 - 5000 ₽' },
  { id: '5000+', name: 'От 5000 ₽' }
];

// Sorting options
const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name-asc', label: 'А-Я' },
  { value: 'name-desc', label: 'Я-А' }
];

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL
  const categoryFilter = searchParams.get('category') || 'all';
  const priceFilter = searchParams.get('price') || 'all';
  const sortBy = searchParams.get('sort') || 'popular';
  const searchQuery = searchParams.get('q') || '';
  
  // Local state for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter products based on filters
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }
    
    // Filter by price
    if (priceFilter !== 'all') {
      const price = product.discountPrice || product.price;
      
      if (priceFilter === '0-1000' && price > 1000) return false;
      if (priceFilter === '1000-3000' && (price < 1000 || price > 3000)) return false;
      if (priceFilter === '3000-5000' && (price < 3000 || price > 5000)) return false;
      if (priceFilter === '5000+' && price < 5000) return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    
    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'popular':
      default:
        return 0; // In a real app, would use a popularity metric
    }
  });
  
  // Update filters
  const updateFilters = (
    key: string,
    value: string
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value === 'all' && key !== 'sort') {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    
    setSearchParams(newSearchParams);
  };
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  
  // Handler for adding to cart (would be connected to redux in a real app)
  const handleAddToCart = (id: string) => {
    console.log(`Adding product ${id} to cart`);
  };
  
  return (
    <div className={styles.catalogPage}>
      <Navigation cartItemsCount={0} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Каталог товаров</h1>
            
            <div className={styles.sortContainer}>
              <label htmlFor="sort" className={styles.sortLabel}>Сортировать:</label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => updateFilters('sort', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className={styles.mobileFilterToggle}
            onClick={toggleMobileFilters}
          >
            {showMobileFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
          
          <div className={styles.catalogContent}>
            <aside className={`${styles.filters} ${showMobileFilters ? styles.filtersVisible : ''}`}>
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Категории</h3>
                <ul className={styles.filterList}>
                  {categories.map(category => (
                    <li key={category.id} className={styles.filterItem}>
                      <button
                        className={`${styles.filterButton} ${categoryFilter === category.id ? styles.active : ''}`}
                        onClick={() => updateFilters('category', category.id)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Цена</h3>
                <ul className={styles.filterList}>
                  {priceRanges.map(range => (
                    <li key={range.id} className={styles.filterItem}>
                      <button
                        className={`${styles.filterButton} ${priceFilter === range.id ? styles.active : ''}`}
                        onClick={() => updateFilters('price', range.id)}
                      >
                        {range.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            
            <div className={styles.productsContainer}>
              {sortedProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                  {sortedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      discountPrice={product.discountPrice}
                      imageUrl={product.imageUrl}
                      category={categories.find(c => c.id === product.category)?.name}
                      isNew={product.isNew}
                      isBestseller={product.isBestseller}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Товары не найдены. Попробуйте изменить параметры фильтрации.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CatalogPage;