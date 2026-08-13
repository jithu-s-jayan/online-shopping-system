import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, PackageCheck, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/Button';
import { Order } from '../types';

export const OrderConfirmedScreen: React.FC = () => {
  const navigate = useNavigate();

  const lastOrderRaw = sessionStorage.getItem('luxora_last_order');
  const order: Order | null = lastOrderRaw ? JSON.parse(lastOrderRaw) : null;

  useEffect(() => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg flex flex-col justify-between p-6">
      <div />

      <div className="flex flex-col items-center text-center max-w-sm mx-auto my-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 bg-luxora-gold-soft/30 text-luxora-gold rounded-full flex items-center justify-center mb-6 shadow-gold"
        >
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </motion.div>

        <span className="label-caps text-luxora-gold text-[11px] mb-1">PURCHASE CONFIRMED</span>
        <h1 className="font-serif text-3xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-2">
          Thank you for your order.
        </h1>

        <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mb-6 leading-relaxed">
          Your order has been received and is being prepared with white-glove care by our luxury artisan partners.
        </p>

        {/* Order Reference Box */}
        {order && (
          <div className="w-full bg-luxora-surface dark:bg-luxora-dark-surface p-4 rounded-xl border border-luxora-divider dark:border-luxora-dark-divider space-y-2 mb-6 text-left shadow-subtle">
            <div className="flex justify-between items-center text-xs">
              <span className="text-luxora-secondary">Order Reference</span>
              <span className="font-mono font-bold text-luxora-primary dark:text-luxora-dark-primary">{order.orderNumber}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-luxora-secondary">Estimated Arrival</span>
              <span className="font-semibold text-luxora-gold">{order.deliveryMethod?.estimatedDays || '2-4 Days'}</span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-luxora-divider dark:border-luxora-dark-divider">
              <span className="text-luxora-secondary">Total Amount Paid</span>
              <span className="font-bold text-luxora-primary dark:text-luxora-dark-primary">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="w-full space-y-3">
          <Button
            variant="gold"
            fullWidth
            onClick={() => navigate(order ? `/order-tracking/${order._id}` : '/orders')}
            className="gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            Track Order Live
          </Button>

          <Button variant="outline" fullWidth onClick={() => navigate('/home')} className="gap-2">
            <Home className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>
      </div>

      <div className="text-center text-[11px] text-luxora-secondary">
        A order confirmation email has been sent to your registered address.
      </div>
    </div>
  );
};
