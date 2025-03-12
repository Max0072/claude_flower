import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Carousel from '../../components/Carousel';
import ProductCard from '../../components/ProductCard';

// Mock data for the carousel
const carouselSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Весенняя коллекция букетов',
    description: 'Встречайте весну с нашими яркими и свежими композициями',
    buttonText: 'Смотреть коллекцию',
    buttonLink: '/catalog/spring',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Комнатные растения',
    description: 'Озеленяем пространство и создаем уют в вашем доме',
    buttonText: 'Выбрать растение',
    buttonLink: '/plants',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1561128290-033a6755dce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Свадебная флористика',
    description: 'Особенный день требует особенных цветов',
    buttonText: 'Узнать подробнее',
    buttonLink: '/weddings',
  },
];

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Букет "Весеннее настроение"',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Букеты',
    isBestseller: true
  },
  {
    id: '2',
    name: 'Розы "Ред Наоми"',
    price: 4200,
    discountPrice: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Розы'
  },
  {
    id: '3',
    name: 'Монстера Делициоза',
    price: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Растения',
    isNew: true
  },
  {
    id: '4',
    name: 'Букет "Нежное прикосновение"',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1599733594230-5cc2b8cf2d2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Букеты'
  }
];

// Mock data for categories
const categories = [
  {
    id: 'bouquets',
    name: 'Букеты',
    image: 'https://images.unsplash.com/photo-1599733594230-5cc2b8cf2d2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/bouquets',
  },
  {
    id: 'roses',
    name: 'Розы',
    image: 'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/roses',
  },
  {
    id: 'plants',
    name: 'Растения',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/plants',
  },
  {
    id: 'gifts',
    name: 'Подарки',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    link: '/gifts',
  },
];

const HomePage: React.FC = () => {
  // Handler for adding to cart (would be connected to redux in a real app)
  const handleAddToCart = (id: string) => {
    console.log(`Adding product ${id} to cart`);
  };

  return (
    <div className={styles.homePage}>
      <Navigation cartItemsCount={0} />
      
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <Carousel slides={carouselSlides} />
        </section>

        <section className={styles.categories}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Категории</h2>
            <div className={styles.categoryGrid}>
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  to={category.link}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryImageContainer}>
                    <img src={category.image} alt={category.name} className={styles.categoryImage} />
                  </div>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.featuredProducts}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Популярные товары</h2>
            <div className={styles.productsGrid}>
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  imageUrl={product.imageUrl}
                  category={product.category}
                  isNew={product.isNew}
                  isBestseller={product.isBestseller}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <div className={styles.viewAllContainer}>
              <Link to="/catalog" className={styles.viewAllButton}>
                Смотреть все товары
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Быстрая доставка</h3>
                <p className={styles.featureDescription}>
                  Доставляем в день заказа при оформлении до 14:00
                </p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>100% свежие цветы</h3>
                <p className={styles.featureDescription}>
                  Гарантируем свежесть цветов до 7 дней
                </p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Безопасные платежи</h3>
                <p className={styles.featureDescription}>
                  Принимаем различные способы оплаты
                </p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Создаем с любовью</h3>
                <p className={styles.featureDescription}>
                  Каждый букет собирается вручную нашими флористами
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;