import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '../api/cartApi';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  isLoading: false,
  error: null,
};

// For offline cart functionality - will sync with backend when user logs in
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set the cart from server response
    setCart: (state, action: PayloadAction<Cart>) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
    },
    
    // For offline/guest cart functionality
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === newItem.productId
      );
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Add new item
        state.items.push(newItem);
      }
      
      // Recalculate total
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productId === productId
      );
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
        
        // Recalculate total
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      
      // Recalculate total
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  setCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;