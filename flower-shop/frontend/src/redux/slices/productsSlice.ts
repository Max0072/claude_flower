import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../api/productsApi';

interface ProductsState {
  selectedCategory: string | null;
  searchTerm: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest';
  currentPage: number;
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  selectedCategory: null,
  searchTerm: '',
  sortBy: 'newest',
  currentPage: 1,
  featuredProducts: [],
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page when changing category
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSortBy: (state, action: PayloadAction<'price_asc' | 'price_desc' | 'newest'>) => {
      state.sortBy = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
  },
});

export const {
  setCategory,
  setSearchTerm,
  setSortBy,
  setCurrentPage,
  setFeaturedProducts,
} = productsSlice.actions;

export default productsSlice.reducer;