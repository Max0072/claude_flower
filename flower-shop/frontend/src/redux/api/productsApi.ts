import { api } from './apiSlice';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface ProductDetails extends Product {
  details: {
    composition: string[];
    size: string;
    freshness: string;
    careInstructions?: string;
  };
  reviews: any[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
}

export interface ProductsQueryParams {
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),
    getProductById: builder.query<ProductDetails, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;