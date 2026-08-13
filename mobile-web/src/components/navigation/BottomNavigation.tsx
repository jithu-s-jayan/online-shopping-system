import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../../store/useWishlistStore';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);

  const tabs = [
    { id: 'home', label: 'Home', path: '/home', icon: Home },
    { id: 'search', label: 'Search', path: '/search', icon: Search },
    { id: 'shop', label: 'Shop', path: '/shop', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlistCount },
    { id: 'profile', label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-luxora-divider/40 dark:border-luxora-dark-divider/40 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around max-w-md mx-auto h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full text-luxora-primary dark:text-luxora-dark-primary focus:outline-none select-none"
            >
              <div className="relative py-1">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-luxora-primary dark:text-luxora-dark-primary stroke-[2.2]'
                      : 'text-luxora-secondary dark:text-luxora-dark-secondary stroke-[1.5]'
                  }`}
                />

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-luxora-gold text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-sans transition-colors tracking-tight ${
                  isActive
                    ? 'font-semibold text-luxora-primary dark:text-luxora-dark-primary'
                    : 'text-luxora-secondary dark:text-luxora-dark-secondary font-normal'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Gold Dot Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute bottom-1 w-1.5 h-1.5 bg-luxora-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
