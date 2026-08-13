import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface UIState {
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  removeToast: (id: string) => void;
  
  isFilterOpen: boolean;
  isSortOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  setSortOpen: (open: boolean) => void;

  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  showToast: (message, type = 'success', title) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, type, message, title };
    set({ toasts: [...get().toasts, newToast] });
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  isFilterOpen: false,
  isSortOpen: false,
  setFilterOpen: (open) => set({ isFilterOpen: open }),
  setSortOpen: (open) => set({ isSortOpen: open }),

  hasCompletedOnboarding: localStorage.getItem('luxora_onboarding') === 'true',
  completeOnboarding: () => {
    localStorage.setItem('luxora_onboarding', 'true');
    set({ hasCompletedOnboarding: true });
  },

  recentSearches: JSON.parse(localStorage.getItem('luxora_recent_searches') || '["Cashmere", "Boots", "Watch", "Serum"]'),
  addRecentSearch: (query) => {
    if (!query.trim()) return;
    const existing = get().recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query.trim(), ...existing].slice(0, 8);
    localStorage.setItem('luxora_recent_searches', JSON.stringify(updated));
    set({ recentSearches: updated });
  },
  clearRecentSearches: () => {
    localStorage.removeItem('luxora_recent_searches');
    set({ recentSearches: [] });
  }
}));
