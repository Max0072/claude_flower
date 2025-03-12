import { User } from '../redux/api/userApi';
import { setUser, logout } from '../redux/slices/userSlice';
import { store } from '../redux/store';

// Check if the user is authenticated by verifying if token exists and is not expired
export const isAuthenticated = (): boolean => {
  const { token } = store.getState().user;
  
  if (!token) {
    return false;
  }
  
  // You could add JWT expiration check here if needed
  // This is a simple example without expiration check
  return true;
};

// Set user data in Redux and local storage
export const storeUserData = (userData: User): void => {
  store.dispatch(setUser(userData));
};

// Clear user data from Redux and local storage
export const clearUserData = (): void => {
  store.dispatch(logout());
};

// Get the auth token from Redux state
export const getAuthToken = (): string | null => {
  return store.getState().user.token;
};

// Function to handle authentication error (e.g., expired token)
export const handleAuthError = (): void => {
  clearUserData();
  // Could also redirect to login page
  window.location.href = '/login';
};