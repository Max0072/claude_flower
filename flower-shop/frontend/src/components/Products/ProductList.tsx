import React, { useEffect } from 'react';
import { useGetProductsQuery } from '../../redux/api/productsApi';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCurrentPage } from '../../redux/slices/productsSlice';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get filter state from Redux
  const { selectedCategory, sortBy, currentPage, searchTerm } = useAppSelector(
    (state) => state.products
  );
  
  // Fetch products using RTK Query with filters
  const { data, error, isLoading } = useGetProductsQuery({
    category: selectedCategory || undefined,
    sort: sortBy,
    page: currentPage,
    limit: 12, // Products per page
  });
  
  // Reset to page 1 when search/filters change
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [selectedCategory, sortBy, searchTerm, dispatch]);
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };
  
  if (isLoading) {
    return <div className="loading">Загрузка товаров...</div>;
  }
  
  if (error) {
    return <div className="error">Ошибка при загрузке товаров</div>;
  }
  
  if (!data || data.products.length === 0) {
    return <div className="no-products">Товары не найдены</div>;
  }
  
  return (
    <div className="product-list">
      <div className="product-grid">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Pagination */}
      {data.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn"
          >
            &laquo; Назад
          </button>
          
          <span className="current-page">
            Страница {currentPage} из {data.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === data.pages}
            className="btn"
          >
            Вперед &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;