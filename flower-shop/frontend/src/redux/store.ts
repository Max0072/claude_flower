import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/apiSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;