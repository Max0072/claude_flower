import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';

interface NavigationProps {
  cartItemsCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ cartItemsCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMobileMenu}>
            <h1>Флора</h1>
          </Link>
        </div>

        <button 
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink 
                to="/" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Главная
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/catalog" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Каталог
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/bouquets" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Букеты
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/plants" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Растения
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/delivery" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Доставка
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/about" 
                className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                О нас
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <NavLink 
            to="/search"
            className={styles.actionIcon}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </NavLink>
          <NavLink 
            to="/account"
            className={styles.actionIcon}
            aria-label="My Account"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </NavLink>
          <NavLink 
            to="/cart"
            className={styles.actionIcon}
            aria-label="Shopping Cart"
          >
            <div className={styles.cartIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItemsCount > 0 && (
                <span className={styles.cartBadge}>{cartItemsCount}</span>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navigation;