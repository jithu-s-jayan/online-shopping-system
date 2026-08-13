import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, LogIn } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

export const TopAppBar: React.FC = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.totalItemsCount());
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 focus:outline-none text-left">
        <span className="font-serif text-2xl font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          LUXORA
        </span>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-luxora-primary dark:text-luxora-dark-primary hover:text-luxora-gold transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-luxora-gold rounded-full" />
        </button>

        {/* Shopping Bag / Cart */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/cart')}
          className="relative p-2 text-luxora-primary dark:text-luxora-dark-primary hover:text-luxora-gold transition-colors"
          aria-label="Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-luxora-primary text-white dark:bg-luxora-gold dark:text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
            >
              {totalItems}
            </motion.span>
          )}
        </motion.button>

        {/* User Avatar or Sign In button */}
        {isAuthenticated && user?.avatar ? (
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full overflow-hidden border border-luxora-divider dark:border-luxora-dark-divider ml-1"
          >
            <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 text-xs font-bold text-luxora-gold border border-luxora-gold/40 px-2.5 py-1 rounded-full hover:bg-luxora-gold/10 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
