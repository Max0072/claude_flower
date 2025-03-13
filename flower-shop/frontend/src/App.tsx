import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { useGetCartQuery } from './redux/api/cartApi';
import { setCart } from './redux/slices/cartSlice';

// Import our created UI components
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { LoginPage, RegisterPage } from './pages/AuthPage';

// Import global styles
import './styles/index.scss';

// Placeholder components for pages we haven't created yet
const Checkout = () => <div>Checkout Page</div>;
const Profile = () => <div>Profile Page</div>;
const NotFound = () => <div>404 Not Found</div>;

// Route guard for protected routes
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  
  // Fetch cart data if user is authenticated
  const { data: cartData, isSuccess } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Skip query if user is not authenticated
  });
  
  // Update cart state when cart data is fetched
  useEffect(() => {
    if (isSuccess && cartData) {
      dispatch(setCart(cartData));
    }
  }, [isSuccess, cartData, dispatch]);
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;