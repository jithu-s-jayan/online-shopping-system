import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, UserCheck, LogIn } from 'lucide-react';
import { StepProgress } from '../components/navigation/StepProgress';
import { PaymentOption } from '../components/checkout/PaymentOption';
import { SummaryBreakdown } from '../components/checkout/SummaryBreakdown';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../services/api';

export const CheckoutPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { user, isAuthenticated, loginDemoAccount } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  const [paymentMethod, setPaymentMethod] = useState<'DEMO' | 'RAZORPAY' | 'STRIPE' | 'COD'>('DEMO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve checkout session details
  const savedAddress = JSON.parse(
    sessionStorage.getItem('luxora_selected_address') ||
    JSON.stringify({
      fullName: user ? `${user.firstName} ${user.lastName}` : 'Jithu s jayan',
      phone: user?.phone || '+91 98765 43210',
      street: '42 Luxury Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India'
    })
  );

  const savedDelivery = JSON.parse(
    sessionStorage.getItem('luxora_selected_delivery') ||
    JSON.stringify({ name: 'Express White-Glove Courier', price: 499, estimatedDays: '2 Business Days' })
  );

  const discountAmount = Number(sessionStorage.getItem('luxora_checkout_discount') || 0);

  // Fallback items if cart state empty in transient navigation
  const activeItems = items.length > 0 ? items : [
    {
      product: {
        _id: 'prod-1',
        name: 'Aurelia Cashmere Oversized Coat',
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80'],
        brand: 'Luxora Atelier'
      },
      selectedColor: 'Camel',
      selectedSize: 'M',
      quantity: 1,
      price: 19999
    }
  ];

  const calcSubtotal = subtotal > 0 ? subtotal : activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = savedDelivery.price || 0;
  const tax = Math.round((calcSubtotal - discountAmount) * 0.18);
  const total = Math.max(0, calcSubtotal - discountAmount + tax + shipping);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        items: activeItems.map((i: any) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images[0],
          brand: i.product.brand,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
          quantity: i.quantity,
          price: i.price
        })),
        shippingAddress: savedAddress,
        deliveryMethod: savedDelivery,
        paymentMethod,
        discountAmount
      };

      const res = await api.post('/orders', orderData);
      if (res.data.success) {
        clearCart();
        sessionStorage.setItem('luxora_last_order', JSON.stringify(res.data.order));
        showToast('Order placed successfully!', 'success');
        navigate('/order-confirmed');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSignIn = async () => {
    const success = await loginDemoAccount('CUSTOMER');
    if (success) {
      showToast('Signed in as Jithu Kumar', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-28">
      <header className="sticky top-0 z-40 glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-lg font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          Payment & Confirmation
        </span>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <StepProgress currentStep={3} />

        {/* User Account / Guest Sign In Bar */}
        <div className="p-3 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-luxora-gold" />
            <div>
              <span className="font-semibold text-luxora-primary dark:text-luxora-dark-primary block">
                {isAuthenticated ? `Signed in as ${user?.firstName}` : 'Checkout Session'}
              </span>
              <span className="text-[10px] text-luxora-secondary">
                {isAuthenticated ? user?.email : 'Guest checkout enabled'}
              </span>
            </div>
          </div>

          {!isAuthenticated && (
            <button
              onClick={handleQuickSignIn}
              className="flex items-center gap-1 px-2.5 py-1 bg-luxora-gold-soft/30 text-luxora-gold-dark dark:text-luxora-gold font-bold text-[11px] rounded-lg hover:bg-luxora-gold-soft/50 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

        <h2 className="font-serif text-lg font-semibold text-luxora-primary dark:text-luxora-dark-primary pt-1">
          Select Payment Method
        </h2>

        <div className="space-y-2.5">
          <PaymentOption
            id="DEMO"
            name="Demo Payment Mode"
            description="Instant zero-credential test checkout for seamless testing."
            isSelected={paymentMethod === 'DEMO'}
            onSelect={() => setPaymentMethod('DEMO')}
          />

          <PaymentOption
            id="COD"
            name="Cash on Delivery"
            description="Pay with cash or UPI upon white-glove arrival."
            isSelected={paymentMethod === 'COD'}
            onSelect={() => setPaymentMethod('COD')}
          />

          <PaymentOption
            id="RAZORPAY"
            name="Razorpay Gateway"
            description="UPI, NetBanking, Credit / Debit Cards."
            isSelected={paymentMethod === 'RAZORPAY'}
            onSelect={() => setPaymentMethod('RAZORPAY')}
          />

          <PaymentOption
            id="STRIPE"
            name="Stripe International"
            description="Visa, Mastercard, American Express, Apple Pay."
            isSelected={paymentMethod === 'STRIPE'}
            onSelect={() => setPaymentMethod('STRIPE')}
          />
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-luxora-secondary dark:text-luxora-dark-secondary py-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
        </div>

        {/* Summary Breakdown */}
        <SummaryBreakdown subtotal={calcSubtotal} discount={discountAmount} tax={tax} shipping={shipping} total={total} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-luxora-divider dark:border-luxora-dark-divider p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto">
        <Button variant="gold" fullWidth isLoading={isSubmitting} onClick={handlePlaceOrder} className="gap-2">
          <Lock className="w-4 h-4" />
          <span>Pay & Place Order (₹{total.toLocaleString()})</span>
        </Button>
      </div>
    </div>
  );
};
