import { create } from 'zustand';
import { Product } from '../types';
import api from '../services/api';

interface WishlistState {
  wishlist: Product[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<boolean>;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/wishlist');
      if (res.data.wishlist) {
        set({ wishlist: res.data.wishlist });
      }
    } catch (err) {
      console.log('Guest wishlist fallback');
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (product) => {
    const currentList = [...get().wishlist];
    const exists = currentList.some((p) => p._id === product._id);

    try {
      const res = await api.post(`/wishlist/${product._id}`);
      if (res.data.wishlist) {
        set({ wishlist: res.data.wishlist });
        return res.data.isWishlisted;
      }
    } catch (err) {}

    // Fallback guest toggling
    if (exists) {
      const updated = currentList.filter((p) => p._id !== product._id);
      set({ wishlist: updated });
      return false;
    } else {
      currentList.push(product);
      set({ wishlist: currentList });
      return true;
    }
  },

  isWishlisted: (productId) => {
    return get().wishlist.some((p) => p._id === productId);
  }
}));
