import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { SummaryBreakdown } from '../components/checkout/SummaryBreakdown';
import { EmptyState } from '../components/feedback/EmptyState';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import api from '../services/api';

export const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, fetchCart, updateQuantity, removeItem } = useCartStore();
  const showToast = useUIStore((state) => state.showToast);

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
      if (res.data.success) {
        setDiscountAmount(res.data.coupon.discountAmount);
        setAppliedCoupon(res.data.coupon.code);
        showToast(res.data.message, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid coupon code', 'error');
    }
  };

  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const shipping = subtotal > 10000 ? 0 : 499;
  const total = Math.max(0, subtotal - discountAmount + tax + shipping);

  const handleProceedCheckout = () => {
    // Save session discount info
    sessionStorage.setItem('luxora_checkout_discount', String(discountAmount));
    sessionStorage.setItem('luxora_checkout_coupon', appliedCoupon || '');
    navigate('/checkout/address');
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-28">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">YOUR SELECTION</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Shopping Bag ({items.length})
            </h1>
          </div>
        </div>

        {items.length > 0 ? (
          <>
            {/* Cart Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 p-3 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle"
                >
                  <div
                    onClick={() => navigate(`/product/${item.product.slug || item.product._id}`)}
                    className="w-20 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => removeItem(item._id!)}
                          className="text-luxora-secondary hover:text-luxora-error p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4
                        onClick={() => navigate(`/product/${item.product.slug || item.product._id}`)}
                        className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary truncate cursor-pointer"
                      >
                        {item.product.name}
                      </h4>

                      {(item.selectedColor || item.selectedSize) && (
                        <div className="text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary mt-0.5">
                          {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                          {item.selectedSize && <span>| Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-sans text-xs font-bold text-luxora-primary dark:text-luxora-dark-primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-luxora-divider dark:border-luxora-dark-divider rounded-lg overflow-hidden bg-luxora-bg dark:bg-luxora-dark-bg">
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                          className="p-1 text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                          className="p-1 text-luxora-primary dark:text-luxora-dark-primary hover:bg-neutral-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Input Box */}
            <div className="bg-luxora-surface dark:bg-luxora-dark-surface p-4 rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-2">
              <span className="label-caps text-[10px] text-luxora-gold flex items-center gap-1">
                <Tag className="w-3 h-3" />
                PROMO CODE
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. LUXORA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-transparent border border-luxora-divider dark:border-luxora-dark-divider rounded-lg font-mono uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-luxora-primary text-white text-xs font-semibold rounded-lg"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Coupon "{appliedCoupon}" applied (-₹{discountAmount.toLocaleString()})
                </p>
              )}
            </div>

            {/* Cost Breakdown */}
            <SummaryBreakdown
              subtotal={subtotal}
              discount={discountAmount}
              tax={tax}
              shipping={shipping}
              total={total}
            />
          </>
        ) : (
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8" />}
            title="Your Bag is Empty"
            description="Looks like you haven't added any luxury pieces to your shopping bag yet."
            actionLabel="Start Shopping"
            onAction={() => navigate('/shop')}
          />
        )}
      </main>

      {/* Sticky Bottom Action Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-luxora-divider dark:border-luxora-dark-divider p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto">
          <Button variant="gold" fullWidth onClick={handleProceedCheckout} className="gap-2">
            <span>Proceed to Checkout (₹{total.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};
