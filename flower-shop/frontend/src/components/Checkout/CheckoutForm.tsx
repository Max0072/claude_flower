import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { useCreateOrderMutation } from '../../redux/api/ordersApi';
import { clearCart } from '../../redux/slices/cartSlice';
import { validateOrder, ValidationError } from '../../utils/validation';

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get cart items from Redux
  const { items } = useAppSelector((state) => state.cart);
  
  // Form state
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState<ValidationError>({});
  
  // Create order mutation
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateOrder(
      street,
      city,
      zipCode,
      paymentMethod
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (items.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }
    
    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street,
          city,
          zipCode,
        },
        paymentMethod,
      };
      
      // Create order
      const response = await createOrder(orderData).unwrap();
      
      // Clear cart on successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigate(`/orders/${response.id}`);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };
  
  return (
    <div className="checkout-form">
      <h2>Оформление заказа</h2>
      
      <form onSubmit={handleSubmit}>
        <h3>Адрес доставки</h3>
        
        <div className="form-group">
          <label htmlFor="street">Улица, дом, квартира</label>
          <input
            type="text"
            id="street"
            className={`form-control ${errors.street ? 'is-invalid' : ''}`}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          {errors.street && <div className="form-error">{errors.street}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="city">Город</label>
          <input
            type="text"
            id="city"
            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {errors.city && <div className="form-error">{errors.city}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="zipCode">Почтовый индекс</label>
          <input
            type="text"
            id="zipCode"
            className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          {errors.zipCode && <div className="form-error">{errors.zipCode}</div>}
        </div>
        
        <h3>Способ оплаты</h3>
        
        <div className="form-group">
          <div className="payment-methods">
            <div className="payment-method">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <label htmlFor="card">Банковская карта</label>
            </div>
            
            <div className="payment-method">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              <label htmlFor="cash">Наличные при получении</label>
            </div>
          </div>
          {errors.paymentMethod && (
            <div className="form-error">{errors.paymentMethod}</div>
          )}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;