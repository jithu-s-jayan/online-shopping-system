/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxora: {
          bg: '#FAF9F6',
          surface: '#FFFFFF',
          'surface-variant': '#EFEEEB',
          primary: '#1A1C1A',
          secondary: '#444748',
          gold: '#C59D5F',
          'gold-dark': '#795921',
          'gold-soft': '#E9DFC9',
          success: '#2E7D5B',
          error: '#BA1A1A',
          divider: '#E7E4DE',
          // Dark Mode Colors
          'dark-bg': '#0A0A0A',
          'dark-surface': '#151515',
          'dark-surface-2': '#202020',
          'dark-primary': '#F5F5F5',
          'dark-secondary': '#A8A8A8',
          'dark-divider': '#2A2A2A'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Sora"', 'sans-serif']
      },
      boxShadow: {
        subtle: '0px 4px 20px rgba(0, 0, 0, 0.04)',
        elevated: '0px 10px 40px rgba(0, 0, 0, 0.08)',
        gold: '0px 4px 20px rgba(197, 157, 95, 0.25)'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem'
      }
    }
  },
  plugins: []
};
