import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the user state
      const token = (getState() as RootState).user.token;
      
      // If we have a token, add it to the request headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Products', 'Product', 'Cart', 'Orders', 'User'],
  endpoints: () => ({}),
});