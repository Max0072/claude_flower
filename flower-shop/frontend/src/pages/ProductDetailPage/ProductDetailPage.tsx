import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductDetailPage.module.scss';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';

// Mock product data
const products = [
  {
    id: '1',
    name: 'Букет "Весеннее настроение"',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567696153798-9a246a09bfa0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599733594230-5cc2b8cf2d2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Букеты',
    description: 'Яркий весенний букет из сезонных цветов, который подарит настроение и радость. Идеально подходит для поздравления с днем рождения, юбилеем или просто для того, чтобы порадовать близкого человека.',
    specifications: [
      { name: 'Состав', value: 'Тюльпаны, нарциссы, гиацинты, эустома' },
      { name: 'Количество цветов', value: '15-17 шт.' },
      { name: 'Размер', value: 'Средний' },
      { name: 'Упаковка', value: 'Крафт-бумага, атласная лента' }
    ],
    careInstructions: 'Поставьте букет в прохладное место, вдали от прямых солнечных лучей. Меняйте воду каждые 2 дня. Обрезайте стебли под углом раз в 2-3 дня.',
    isBestseller: true,
    relatedProductIds: ['4', '6', '2']
  },
  {
    id: '2',
    name: 'Розы "Ред Наоми"',
    price: 4200,
    discountPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494337095615-b5f370aaf0c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587728301856-7bd01421b740?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Розы',
    description: 'Роскошные красные розы сорта "Red Naomi" считаются одними из лучших в мире. Они отличаются насыщенным ярко-красным цветом, крупным бутоном и длительным сроком стояния в вазе.',
    specifications: [
      { name: 'Сорт', value: 'Red Naomi' },
      { name: 'Цвет', value: 'Красный' },
      { name: 'Длина стебля', value: '60-70 см' },
      { name: 'Размер бутона', value: '5-6 см' }
    ],
    careInstructions: 'Обрежьте стебли под углом 45 градусов. Удалите все листья, которые могут оказаться в воде. Добавьте в вазу специальный раствор для роз или 1/4 чайной ложки сахара. Меняйте воду каждые 2 дня.',
    relatedProductIds: ['6', '4', '1']
  },
  {
    id: '3',
    name: 'Монстера Делициоза',
    price: 2900,
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1632208906826-d78511b38525?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Растения',
    description: 'Монстера Делициоза - одно из самых популярных комнатных растений. Крупные резные листья с характерными отверстиями станут ярким акцентом в любом интерьере. Растение неприхотливо и подходит даже для начинающих.',
    specifications: [
      { name: 'Высота', value: '50-60 см' },
      { name: 'Размер горшка', value: '19 см' },
      { name: 'Освещение', value: 'Яркий рассеянный свет' },
      { name: 'Полив', value: 'Умеренный' }
    ],
    careInstructions: 'Разместите в месте с ярким рассеянным светом, избегая прямых солнечных лучей. Поливайте, когда верхний слой почвы подсохнет. Протирайте листья влажной тканью для удаления пыли.',
    isNew: true,
    relatedProductIds: ['5', '8', '7']
  },
  {
    id: '4',
    name: 'Букет "Нежное прикосновение"',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1599733594230-5cc2b8cf2d2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571667816025-4aa838e0ff8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Букеты',
    description: 'Нежный и элегантный букет в пастельных тонах. Идеально подойдет для романтического подарка или свадебного торжества.',
    specifications: [
      { name: 'Состав', value: 'Пионы, розы, эустома, гипсофила' },
      { name: 'Количество цветов', value: '11-13 шт.' },
      { name: 'Размер', value: 'Средний' },
      { name: 'Упаковка', value: 'Флористическая пленка, атласная лента' }
    ],
    careInstructions: 'Поставьте букет в прохладное место, вдали от прямых солнечных лучей и фруктов. Меняйте воду каждый день. Обрезайте стебли под углом раз в 1-2 дня.',
    relatedProductIds: ['1', '6', '2']
  }
];

// Find related products function
const findRelatedProducts = (relatedIds: string[]) => {
  return relatedIds.map(id => products.find(product => product.id === id)).filter(Boolean) as typeof products;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the current product
  const product = products.find(p => p.id === id);
  
  // State for selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // State for quantity
  const [quantity, setQuantity] = useState(1);
  
  // Handler for quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  
  // Handler for adding to cart (would be connected to redux in a real app)
  const handleAddToCart = () => {
    if (product) {
      console.log(`Adding ${quantity} of product ${product.id} to cart`);
    }
  };
  
  // If product not found
  if (!product) {
    return (
      <div className={styles.productDetailPage}>
        <Navigation cartItemsCount={0} />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.productNotFound}>
              <h1>Товар не найден</h1>
              <p>К сожалению, запрашиваемый товар не существует или был удален.</p>
              <Link to="/catalog" className={styles.backToCatalog}>
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get related products
  const relatedProducts = findRelatedProducts(product.relatedProductIds);
  
  // Calculate price to show (original or discounted)
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  
  return (
    <div className={styles.productDetailPage}>
      <Navigation cartItemsCount={0} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link to="/catalog" className={styles.breadcrumbLink}>Каталог</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link to={`/catalog?category=${product.category.toLowerCase()}`} className={styles.breadcrumbLink}>{product.category}</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{product.name}</span>
          </div>
          
          <div className={styles.productContent}>
            <div className={styles.productGallery}>
              <div className={styles.mainImage}>
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name} 
                  className={styles.mainImageImg}
                />
                
                {(product.isNew || product.isBestseller || hasDiscount) && (
                  <div className={styles.badges}>
                    {product.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>Новинка</span>}
                    {product.isBestseller && <span className={`${styles.badge} ${styles.badgeBestseller}`}>Хит продаж</span>}
                    {hasDiscount && (
                      <span className={`${styles.badge} ${styles.badgeDiscount}`}>
                        -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.thumbnails}>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.active : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} - изображение ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.productInfo}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              
              <div className={styles.productCategory}>
                Категория: <Link to={`/catalog?category=${product.category.toLowerCase()}`}>{product.category}</Link>
              </div>
              
              <div className={styles.productPricing}>
                {hasDiscount ? (
                  <>
                    <span className={styles.discountPrice}>{product.discountPrice} ₽</span>
                    <span className={styles.originalPrice}>{product.price} ₽</span>
                  </>
                ) : (
                  <span className={styles.price}>{product.price} ₽</span>
                )}
              </div>
              
              <div className={styles.productDescription}>
                <h2 className={styles.sectionTitle}>Описание</h2>
                <p>{product.description}</p>
              </div>
              
              <div className={styles.productSpecifications}>
                <h2 className={styles.sectionTitle}>Характеристики</h2>
                <ul className={styles.specsList}>
                  {product.specifications.map((spec, index) => (
                    <li key={index} className={styles.specItem}>
                      <span className={styles.specName}>{spec.name}:</span>
                      <span className={styles.specValue}>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.productCare}>
                <h2 className={styles.sectionTitle}>Уход</h2>
                <p>{product.careInstructions}</p>
              </div>
              
              <div className={styles.addToCartSection}>
                <div className={styles.quantityControl}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className={styles.quantityInput}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    min="1"
                    max="99"
                  />
                  <button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  Добавить в корзину за {(displayPrice * quantity)} ₽
                </button>
              </div>
            </div>
          </div>
          
          {relatedProducts.length > 0 && (
            <div className={styles.relatedProducts}>
              <h2 className={styles.relatedTitle}>Похожие товары</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    imageUrl={product.images[0]}
                    category={product.category}
                    isNew={product.isNew}
                    isBestseller={product.isBestseller}
                    onAddToCart={() => console.log(`Quick add ${product.id} to cart`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;