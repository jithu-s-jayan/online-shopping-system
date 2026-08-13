import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, Bell, Moon, Sun, Shield, LogOut, LogIn, ChevronRight, UserCheck } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useUIStore } from '../store/useUIStore';

export const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loginDemoAccount } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const showToast = useUIStore((state) => state.showToast);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleDemoLogin = async (role: 'CUSTOMER' | 'ADMIN') => {
    const success = await loginDemoAccount(role);
    if (success) {
      showToast(`Signed in as ${role === 'ADMIN' ? 'Admin' : 'Jithu Kumar'}`, 'success');
    }
  };

  const isDarkMode = theme === 'DARK';

  const toggleDarkMode = () => {
    const nextTheme = isDarkMode ? 'LIGHT' : 'DARK';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme.toLowerCase()} mode`, 'info');
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4 space-y-5">
        {/* User Avatar & Header */}
        <div className="p-5 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxora-gold p-0.5 shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.firstName || 'User Avatar'}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className="label-caps text-[10px] text-luxora-gold">
                {user?.role === 'ADMIN' ? 'LUXORA ADMIN' : isAuthenticated ? 'LUXORA VIP MEMBER' : 'GUEST SESSION'}
              </span>
              <h2 className="font-serif text-lg font-bold text-luxora-primary dark:text-luxora-dark-primary truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest Explorer'}
              </h2>
              <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary truncate">
                {user?.email || 'guest@luxora.com'}
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 bg-luxora-gold text-white font-bold text-xs rounded-xl shadow-gold shrink-0 flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

        {/* Quick Demo Sign In Switcher */}
        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-2">
          <span className="label-caps text-[10px] text-luxora-secondary">ONE-TAP ACCOUNT SIGN IN</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="p-2.5 bg-luxora-bg dark:bg-luxora-dark-bg border border-luxora-divider dark:border-luxora-dark-divider rounded-lg text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:border-luxora-gold text-left flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-luxora-gold shrink-0" />
              <div className="truncate">
                <span className="block text-[11px] font-bold">Jithu Kumar</span>
                <span className="text-[9px] text-luxora-secondary">Customer</span>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2.5 bg-luxora-bg dark:bg-luxora-dark-bg border border-luxora-divider dark:border-luxora-dark-divider rounded-lg text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:border-luxora-gold text-left flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-luxora-gold shrink-0" />
              <div className="truncate">
                <span className="block text-[11px] font-bold">Luxora Admin</span>
                <span className="text-[9px] text-luxora-secondary">Admin Portal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: Shopping */}
        <div className="space-y-1">
          <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary px-1">
            SHOPPING & ORDERS
          </span>

          <div className="bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 overflow-hidden divide-y divide-luxora-divider/40">
            <button
              onClick={() => navigate('/orders')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-luxora-gold" />
                <span>My Orders & Live Tracking</span>
              </div>
              <ChevronRight className="w-4 h-4 text-luxora-secondary" />
            </button>

            <button
              onClick={() => navigate('/wishlist')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-luxora-gold" />
                <span>Saved Wishlist</span>
              </div>
              <ChevronRight className="w-4 h-4 text-luxora-secondary" />
            </button>

            <button
              onClick={() => navigate('/addresses')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-luxora-gold" />
                <span>Shipping Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-luxora-secondary" />
            </button>
          </div>
        </div>

        {/* Section: Preferences & Admin */}
        <div className="space-y-1">
          <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary px-1">
            ACCOUNT & PREFERENCES
          </span>

          <div className="bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 overflow-hidden divide-y divide-luxora-divider/40">
            <button
              onClick={toggleDarkMode}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Sun className="w-4 h-4 text-luxora-gold" /> : <Moon className="w-4 h-4 text-luxora-gold" />}
                <span>Appearance Mode</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxora-gold">
                {theme}
              </span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-luxora-gold" />
                <span>Notifications & Alerts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-luxora-secondary" />
            </button>

            {/* Admin Management Link */}
            {(user?.role === 'ADMIN' || true) && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-luxora-gold bg-luxora-gold-soft/20 hover:bg-luxora-gold-soft/40"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-luxora-gold" />
                  <span>Admin Management Portal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-luxora-gold" />
              </button>
            )}
          </div>
        </div>

        {/* Logout / Sign In Button */}
        <div className="pt-2">
          {isAuthenticated ? (
            <Button variant="outline" fullWidth onClick={handleLogout} className="gap-2 text-luxora-error border-luxora-error/30 hover:bg-luxora-error/10">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="gold" fullWidth onClick={() => navigate('/login')} className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In to Account
            </Button>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
