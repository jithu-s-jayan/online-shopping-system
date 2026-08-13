import { create } from 'zustand';
import { User, Address } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemoAccount: (role?: 'CUSTOMER' | 'ADMIN') => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, '_id'>) => Promise<boolean>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('luxora_token'),
  isAuthenticated: !!localStorage.getItem('luxora_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('luxora_token', token);
      set({ token, user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  loginDemoAccount: async (role = 'CUSTOMER') => {
    set({ isLoading: true, error: null });
    try {
      const email = role === 'ADMIN' ? 'admin@luxora.com' : 'jithu@example.com';
      const password = role === 'ADMIN' ? 'admin123' : 'password123';
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('luxora_token', token);
      set({ token, user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Demo login failed', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      const { token, user } = res.data;
      localStorage.setItem('luxora_token', token);
      set({ token, user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('luxora_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchProfile: async () => {
    const currentToken = get().token;
    if (!currentToken) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/profile');
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      set({ user: res.data.user });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update profile' });
      return false;
    }
  },

  addAddress: async (addressData) => {
    try {
      const res = await api.post('/auth/addresses', addressData);
      if (get().user) {
        set({ user: { ...get().user!, addresses: res.data.addresses } });
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to add address' });
      return false;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const res = await api.put(`/auth/addresses/${addressId}`, addressData);
      if (get().user) {
        set({ user: { ...get().user!, addresses: res.data.addresses } });
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update address' });
      return false;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const res = await api.delete(`/auth/addresses/${addressId}`);
      if (get().user) {
        set({ user: { ...get().user!, addresses: res.data.addresses } });
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to delete address' });
      return false;
    }
  }
}));
