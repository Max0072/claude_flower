import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../redux/api/productsApi';
import { useAddToCartMutation } from '../../redux/api/cartApi';
import { handleAddToCart } from '../../utils/cartHelpers';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use the addToCart mutation from cartApi
  const [addToCartMutation, { isLoading }] = useAddToCartMutation();
  
  const addToCart = () => {
    handleAddToCart(product, 1, addToCartMutation);
  };
  
  return (
    <div className="product-card">
      <div className="product-card__image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      
      <div className="product-card__content">
        <h3 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        
        <p className="product-card__price">{product.price} ₽</p>
        
        <button
          className="btn btn-primary"
          onClick={addToCart}
          disabled={isLoading}
        >
          {isLoading ? 'Добавление...' : 'В корзину'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;