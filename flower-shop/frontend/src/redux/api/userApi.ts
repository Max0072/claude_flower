import { api } from './apiSlice';

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = userApi;