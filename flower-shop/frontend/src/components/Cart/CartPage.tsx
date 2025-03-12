import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { useUpdateCartItemMutation, useRemoveFromCartMutation } from '../../redux/api/cartApi';
import { updateCartItemQuantity, removeItemFromCart } from '../../redux/slices/cartSlice';
import { useAppDispatch } from '../../redux/hooks';
import { isAuthenticated } from '../../utils/auth';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const authenticated = useAppSelector((state) => state.user.isAuthenticated);
  
  // API mutations for authenticated users
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  
  // Handle quantity change
  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    if (isAuthenticated()) {
      // For authenticated users - call API
      try {
        await updateCartItem({ productId, quantity }).unwrap();
      } catch (error) {
        console.error('Failed to update cart item:', error);
      }
    } else {
      // For guest users - update Redux state directly
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };
  
  // Handle remove item
  const handleRemoveItem = async (productId: string) => {
    if (isAuthenticated()) {
      // For authenticated users - call API
      try {
        await removeFromCart(productId).unwrap();
      } catch (error) {
        console.error('Failed to remove cart item:', error);
      }
    } else {
      // For guest users - update Redux state directly
      dispatch(removeItemFromCart(productId));
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы продолжить</p>
        <Link to="/products" className="btn btn-primary">
          Перейти к товарам
        </Link>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item__image">
              <img src={item.imageUrl} alt={item.name} />
            </div>
            
            <div className="cart-item__details">
              <h3 className="cart-item__name">
                <Link to={`/products/${item.productId}`}>{item.name}</Link>
              </h3>
              
              <p className="cart-item__price">{item.price} ₽</p>
            </div>
            
            <div className="cart-item__quantity">
              <button
                className="btn btn-sm"
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="btn btn-sm"
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div className="cart-item__total">
              {item.price * item.quantity} ₽
            </div>
            
            <button
              className="cart-item__remove btn btn-sm btn-secondary"
              onClick={() => handleRemoveItem(item.productId)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Итого: {totalAmount} ₽</h3>
        
        {authenticated ? (
          <Link to="/checkout" className="btn btn-primary">
            Оформить заказ
          </Link>
        ) : (
          <div className="cart-login">
            <p>Для оформления заказа необходимо войти в аккаунт</p>
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;