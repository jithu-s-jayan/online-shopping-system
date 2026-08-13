import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { SearchExperienceScreen } from './screens/SearchExperienceScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { WishlistScreen } from './screens/WishlistScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutAddressScreen } from './screens/CheckoutAddressScreen';
import { CheckoutDeliveryScreen } from './screens/CheckoutDeliveryScreen';
import { CheckoutPaymentScreen } from './screens/CheckoutPaymentScreen';
import { OrderConfirmedScreen } from './screens/OrderConfirmedScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { MyOrdersScreen } from './screens/MyOrdersScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AddressesScreen } from './screens/AddressesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';

// Admin
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCustomers } from './admin/AdminCustomers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export const App: React.FC = () => {
  const initTheme = useThemeStore((state) => state.initTheme);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    initTheme();
    fetchProfile();
  }, [initTheme, fetchProfile]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg text-luxora-primary dark:text-luxora-dark-primary font-sans antialiased">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/category/:categorySlug" element={<CategoryScreen />} />
              <Route path="/search" element={<SearchExperienceScreen />} />
              <Route path="/search/results" element={<SearchResultsScreen />} />
              <Route path="/shop" element={<ShopScreen />} />
              <Route path="/product/:id" element={<ProductDetailsScreen />} />
              
              <Route path="/wishlist" element={<WishlistScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/checkout/address" element={<CheckoutAddressScreen />} />
              <Route path="/checkout/delivery" element={<CheckoutDeliveryScreen />} />
              <Route path="/checkout/payment" element={<CheckoutPaymentScreen />} />
              <Route path="/order-confirmed" element={<OrderConfirmedScreen />} />
              <Route path="/order-tracking/:id" element={<OrderTrackingScreen />} />
              <Route path="/orders" element={<MyOrdersScreen />} />
              
              <Route path="/profile" element={<UserProfileScreen />} />
              <Route path="/addresses" element={<AddressesScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />

              {/* Admin Management Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
