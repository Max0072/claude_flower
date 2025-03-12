import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { useGetCartQuery } from './redux/api/cartApi';
import { setCart } from './redux/slices/cartSlice';

// For now, let's just create placeholders for components we don't have yet
// These will be replaced by actual components created by Agent 1
const Home = () => <div>Home Page</div>;
const ProductList = () => <div>Product List Page</div>;
const ProductDetail = () => <div>Product Detail Page</div>;
const Cart = () => <div>Cart Page</div>;
const Checkout = () => <div>Checkout Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
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
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;