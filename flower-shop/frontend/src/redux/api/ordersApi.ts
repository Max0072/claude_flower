import { api } from './apiSlice';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrdersResponse {
  orders: Order[];
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi;