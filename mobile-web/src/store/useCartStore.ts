import { create } from 'zustand';
import { CartItem, Product } from '../types';
import api from '../services/api';

interface CartState {
  items: CartItem[];
  subtotal: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      if (res.data.cart) {
        set({ items: res.data.cart.items || [], subtotal: res.data.cart.subtotal || 0 });
      }
    } catch (err) {
      console.log('Cart fetch fallback to guest session');
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (product, selectedColor, selectedSize, quantity = 1) => {
    const price = product.discountPrice || product.price;

    try {
      const res = await api.post('/cart', {
        productId: product._id,
        selectedColor,
        selectedSize,
        quantity
      });
      if (res.data.cart) {
        set({ items: res.data.cart.items, subtotal: res.data.cart.subtotal });
        return;
      }
    } catch (err) {
      // Local fallback for offline/guest
      const currentItems = [...get().items];
      const existingIndex = currentItems.findIndex(
        (i) => i.product._id === product._id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        currentItems[existingIndex].quantity += quantity;
      } else {
        currentItems.push({
          _id: `guest-${Date.now()}`,
          product,
          selectedColor,
          selectedSize,
          quantity,
          price
        });
      }

      const subtotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      set({ items: currentItems, subtotal });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      if (res.data.cart) {
        set({ items: res.data.cart.items, subtotal: res.data.cart.subtotal });
        return;
      }
    } catch (err) {
      let currentItems = [...get().items];
      if (quantity <= 0) {
        currentItems = currentItems.filter((i) => i._id !== itemId);
      } else {
        const item = currentItems.find((i) => i._id === itemId);
        if (item) item.quantity = quantity;
      }
      const subtotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      set({ items: currentItems, subtotal });
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data.cart) {
        set({ items: res.data.cart.items, subtotal: res.data.cart.subtotal });
        return;
      }
    } catch (err) {
      const currentItems = get().items.filter((i) => i._id !== itemId);
      const subtotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      set({ items: currentItems, subtotal });
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
    } catch (err) {}
    set({ items: [], subtotal: 0 });
  },

  totalItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
