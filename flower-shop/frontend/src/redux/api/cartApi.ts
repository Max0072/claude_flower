import { api } from './apiSlice';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, AddToCartRequest>({
      query: (item) => ({
        url: '/cart',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, AddToCartRequest>({
      query: (item) => ({
        url: '/cart',
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;