import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  discountPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  onAddToCart?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  category,
  discountPrice,
  isNew = false,
  isBestseller = false,
  onAddToCart
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const hasDiscount = !!discountPrice && discountPrice < price;

  return (
    <article className={styles.card} data-testid="product-card">
      <Link to={`/product/${id}`} className={styles.imageContainer}>
        <img src={imageUrl} alt={name} className={styles.image} />
        
        {/* Product badges */}
        {(isNew || isBestseller || hasDiscount) && (
          <div className={styles.badges}>
            {isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>Новинка</span>}
            {isBestseller && <span className={`${styles.badge} ${styles.badgeBestseller}`}>Хит продаж</span>}
            {hasDiscount && (
              <span className={`${styles.badge} ${styles.badgeDiscount}`}>
                -{Math.round(((price - discountPrice!) / price) * 100)}%
              </span>
            )}
          </div>
        )}
      </Link>
      
      <div className={styles.content}>
        <h3 className={styles.name}>
          <Link to={`/product/${id}`} className={styles.nameLink}>
            {name}
          </Link>
        </h3>
        
        {category && <p className={styles.category}>{category}</p>}
        
        <div className={styles.priceContainer}>
          {hasDiscount ? (
            <>
              <span className={styles.discountPrice}>{discountPrice} ₽</span>
              <span className={styles.originalPrice}>{price} ₽</span>
            </>
          ) : (
            <span className={styles.price}>{price} ₽</span>
          )}
        </div>
        
        <button 
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          data-testid="add-to-cart-button"
        >
          В корзину
        </button>
      </div>
    </article>
  );
};

export default ProductCard;