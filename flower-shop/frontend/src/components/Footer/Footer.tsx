import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Флора</h3>
            <p className={styles.description}>
              Мы предлагаем лучшие цветы и растения для ваших особых моментов. Наша миссия — приносить радость и красоту в вашу жизнь через цветы.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="VKontakte">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2H3C2.4 2 2 2.4 2 3v18c0 0.6 0.4 1 1 1h18c0.6 0 1-0.4 1-1V3c0-0.6-0.4-1-1-1z"></path>
                  <path d="M6.7 14h1.8c0 0 0.6-0.1 0.8-0.5C9.5 13 10.4 10.6 11.7 11c1.3 0.4 0.9 3.3 1.1 4.2c0.1 0.3 0.3 0.7 0.9 0.7h1.8c0 0 0.6-0.1 0.4-0.9  c-0.4-1.6-1.9-4.2-1.9-5.4c0-1.1 0.7-1.6 1.5-1.6s3.4 4.5 4.2 6.4c0.3 0.7 0.9 0.6 0.9 0.6h2c0 0 1 0 0.5-1.4c-0.3-0.9-2.5-4.2-2.5-4.2s-0.1-0.3 0-0.5c0.1-0.2 0.5-0.7 1.3-1.8c1.3-1.8 2.4-3.8 1.8-4.6c-0.5-0.7-3 0-3 0h-2.1c0 0-0.3 0-0.6 0.2c-0.2 0.2-0.4 0.7-0.4 0.7s-1.5 3.5-2.5 5.2c-0.8 1.3-1.1 1.4-1.3 1.3c-0.3-0.2-0.2-0.9-0.2-1.4c0-1.5 0.2-4.3-0.1-4.8c-0.3-0.5-0.9-0.6-1.1-0.7c-0.4-0.1-0.9-0.1-1.4-0.1c-1.4 0-2.6 0-3.3 0.3c-0.5 0.2-0.8 0.6-0.6 0.6c0.3 0 0.9 0.1 1.2 0.5c0.4 0.4 0.4 1.5 0.4 1.5s0.3 3-0.6 3.5c-0.6 0.3-1.4-0.3-2.7-3.1c-0.8-1.3-1.4-2.5-1.4-2.5s-0.1-0.3-0.3-0.4c-0.2-0.1-0.6-0.2-0.6-0.2h-2c0 0-0.3 0-0.5 0.2c-0.1 0.1-0.1 0.4 0 0.5c0 0 3.1 7.6 6.9 11.4c3.4 3.4 7.7 3.2 7.7 3.2z"></path>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.91 6.763c-1.267.507-1.262 1.732-.05 2.29l3.95 1.674 2.023 6.68c.242.64.938.907 1.514.57a2 2 0 0 0 .524-.411l2.327-2.327 4.26 3.122c.735.54 1.78.288 2.135-.536l4.464-16.562a2.238 2.238 0 0 0-1.203-1.956 2.195 2.195 0 0 0-1.008-.328z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Каталог</h3>
            <ul className={styles.linkList}>
              <li><Link to="/catalog" className={styles.link}>Все товары</Link></li>
              <li><Link to="/bouquets" className={styles.link}>Букеты</Link></li>
              <li><Link to="/plants" className={styles.link}>Комнатные растения</Link></li>
              <li><Link to="/gifts" className={styles.link}>Подарки</Link></li>
              <li><Link to="/sales" className={styles.link}>Акции</Link></li>
              <li><Link to="/novelty" className={styles.link}>Новинки</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Информация</h3>
            <ul className={styles.linkList}>
              <li><Link to="/about" className={styles.link}>О компании</Link></li>
              <li><Link to="/delivery" className={styles.link}>Доставка и оплата</Link></li>
              <li><Link to="/care" className={styles.link}>Уход за цветами</Link></li>
              <li><Link to="/blog" className={styles.link}>Блог</Link></li>
              <li><Link to="/contacts" className={styles.link}>Контакты</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Контакты</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>г. Москва, ул. Цветочная, 123</span>
              </li>
              <li className={styles.contactItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+74951234567" className={styles.contactLink}>+7 (495) 123-45-67</a>
              </li>
              <li className={styles.contactItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:info@flora.ru" className={styles.contactLink}>info@flora.ru</a>
              </li>
              <li className={styles.contactItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Ежедневно с 9:00 до 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© {currentYear} Флора. Все права защищены.</p>
          <div className={styles.bottomLinks}>
            <Link to="/privacy" className={styles.bottomLink}>Политика конфиденциальности</Link>
            <Link to="/terms" className={styles.bottomLink}>Условия использования</Link>
          </div>
          <div className={styles.payments}>
            <span className={styles.paymentIcon}>Visa</span>
            <span className={styles.paymentIcon}>MasterCard</span>
            <span className={styles.paymentIcon}>МИР</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;