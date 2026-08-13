import { create } from 'zustand';

type ThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('luxora_theme') as ThemeMode) || 'LIGHT',

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('luxora_theme', theme);
    set({ theme });
    get().initTheme();
  },

  initTheme: () => {
    const currentTheme = get().theme;
    const root = document.documentElement;

    if (
      currentTheme === 'DARK' ||
      (currentTheme === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}));
