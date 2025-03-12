import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/userApi';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Initialize from localStorage if available
const getUserFromStorage = (): Partial<UserState> => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      return {};
    }
  }
  return {};
};

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  token: null,
  isAuthenticated: false,
  error: null,
  ...getUserFromStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const { id, name, email, token } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify({ id, name, email, token, isAuthenticated: true }));
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear from localStorage
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setError, logout } = userSlice.actions;

export default userSlice.reducer;