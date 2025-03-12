import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.scss';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

// Mock cart items
const initialCartItems = [
  {
    id: '1',
    name: 'Букет "Весеннее настроение"',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    quantity: 1
  },
  {
    id: '2',
    name: 'Розы "Ред Наоми"',
    price: 3800, // discounted price
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1561181286-d5ef65c80e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    quantity: 2
  }
];

// Delivery options
const deliveryOptions = [
  { id: 'standard', name: 'Стандартная доставка', price: 350, description: 'Доставка в течение 1-2 дней' },
  { id: 'express', name: 'Экспресс-доставка', price: 500, description: 'Доставка в день заказа' },
  { id: 'pickup', name: 'Самовывоз', price: 0, description: 'Самовывоз из магазина' }
];

const CartPage: React.FC = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  // State for delivery option
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);
  
  // State for promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  
  // Get delivery price
  const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
  
  // Calculate total
  const total = subtotal + deliveryPrice - promoDiscount;
  
  // Update quantity handler
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Remove item handler
  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  // Apply promo code handler
  const applyPromoCode = () => {
    // Simple promo code logic for demonstration
    if (promoCode.toUpperCase() === 'FLORA20' && !promoApplied) {
      const discount = Math.round(subtotal * 0.2); // 20% off
      setPromoDiscount(discount);
      setPromoApplied(true);
    }
  };
  
  // Clear promo code handler
  const clearPromoCode = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
  };
  
  // Is cart empty
  const isCartEmpty = cartItems.length === 0;
  
  return (
    <div className={styles.cartPage}>
      <Navigation cartItemsCount={cartItems.reduce((count, item) => count + item.quantity, 0)} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Корзина</h1>
          
          {isCartEmpty ? (
            <div className={styles.emptyCart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2>Ваша корзина пуста</h2>
              <p>Добавьте товары в корзину, чтобы оформить заказ</p>
              <Link to="/catalog" className={styles.continueShopping}>
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className={styles.cartContent}>
              <div className={styles.cartItems}>
                <div className={styles.cartHeader}>
                  <div className={styles.productCol}>Товар</div>
                  <div className={styles.priceCol}>Цена</div>
                  <div className={styles.quantityCol}>Количество</div>
                  <div className={styles.totalCol}>Итого</div>
                  <div className={styles.actionCol}></div>
                </div>
                
                {cartItems.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.productCol}>
                      <div className={styles.productInfo}>
                        <div className={styles.productImage}>
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className={styles.productDetails}>
                          <h3 className={styles.productName}>
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.priceCol}>
                      {item.originalPrice ? (
                        <>
                          <span className={styles.discountPrice}>{item.price} ₽</span>
                          <span className={styles.originalPrice}>{item.originalPrice} ₽</span>
                        </>
                      ) : (
                        <span className={styles.price}>{item.price} ₽</span>
                      )}
                    </div>
                    
                    <div className={styles.quantityCol}>
                      <div className={styles.quantityControl}>
                        <button 
                          className={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className={styles.quantityInput}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          min="1"
                        />
                        <button 
                          className={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.totalCol}>
                      <span className={styles.itemTotal}>{item.price * item.quantity} ₽</span>
                    </div>
                    
                    <div className={styles.actionCol}>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                        aria-label="Удалить товар"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartSummary}>
                <h2 className={styles.summaryTitle}>Итого</h2>
                
                <div className={styles.summaryRow}>
                  <span>Товары ({cartItems.reduce((count, item) => count + item.quantity, 0)})</span>
                  <span>{subtotal} ₽</span>
                </div>
                
                <div className={styles.deliveryOptions}>
                  <h3 className={styles.deliveryTitle}>Способ доставки</h3>
                  
                  {deliveryOptions.map(option => (
                    <label key={option.id} className={styles.deliveryOption}>
                      <input 
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={selectedDelivery === option.id}
                        onChange={() => setSelectedDelivery(option.id)}
                      />
                      <div className={styles.deliveryInfo}>
                        <div className={styles.deliveryName}>{option.name}</div>
                        <div className={styles.deliveryDescription}>{option.description}</div>
                      </div>
                      <div className={styles.deliveryPrice}>
                        {option.price === 0 ? 'Бесплатно' : `${option.price} ₽`}
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className={styles.promoCode}>
                  {promoApplied ? (
                    <div className={styles.promoApplied}>
                      <div className={styles.promoInfo}>
                        <span className={styles.promoLabel}>Промокод FLORA20</span>
                        <span className={styles.promoDiscount}>-{promoDiscount} ₽</span>
                      </div>
                      <button 
                        className={styles.clearPromoButton}
                        onClick={clearPromoCode}
                      >
                        Удалить
                      </button>
                    </div>
                  ) : (
                    <div className={styles.promoForm}>
                      <input 
                        type="text"
                        className={styles.promoInput}
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <button 
                        className={styles.applyPromoButton}
                        onClick={applyPromoCode}
                        disabled={!promoCode}
                      >
                        Применить
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={styles.summaryTotal}>
                  <span className={styles.totalLabel}>Итого к оплате</span>
                  <span className={styles.totalAmount}>{total} ₽</span>
                </div>
                
                <button className={styles.checkoutButton}>
                  Оформить заказ
                </button>
                
                <Link to="/catalog" className={styles.continueShoppingLink}>
                  Продолжить покупки
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;