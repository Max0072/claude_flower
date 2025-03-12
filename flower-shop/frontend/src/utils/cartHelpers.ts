import { CartItem } from '../redux/api/cartApi';
import { Product } from '../redux/api/productsApi';
import { addItemToCart, setCart } from '../redux/slices/cartSlice';
import { store } from '../redux/store';
import { isAuthenticated } from './auth';

// Function to convert Product to CartItem when adding to cart
export const productToCartItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    imageUrl: product.imageUrl,
  };
};

// Function to handle adding items to cart (either local state or API call)
export const handleAddToCart = async (
  product: Product,
  quantity: number = 1,
  addToCartMutation?: any
): Promise<void> => {
  const cartItem = productToCartItem(product, quantity);
  
  if (isAuthenticated() && addToCartMutation) {
    try {
      // If authenticated, call the API
      const response = await addToCartMutation({
        productId: product.id,
        quantity,
      }).unwrap();
      
      // Update Redux store with the response from server
      store.dispatch(setCart(response));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Fallback to local cart if API fails
      store.dispatch(addItemToCart(cartItem));
    }
  } else {
    // Use local cart for guest users
    store.dispatch(addItemToCart(cartItem));
  }
};

// Calculate cart totals
export const calculateCartTotals = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};