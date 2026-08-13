import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageCheck, MapPin, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { Skeleton } from '../components/ui/Skeleton';
import { Order } from '../types';
import api from '../services/api';

const statusSteps = [
  { id: 'PLACED', label: 'Order Placed' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' }
];

export const OrderTrackingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order tracking:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 max-w-md mx-auto space-y-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="w-full h-32 rounded-xl" />
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.id === order.orderStatus);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/orders')} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">ORDER TRACKER</span>
            <h1 className="font-serif text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Order #{order.orderNumber}
            </h1>
          </div>
        </div>

        {/* Status Card */}
        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-luxora-secondary">Current Status</span>
            <span className="px-2.5 py-1 bg-luxora-gold-soft/30 text-luxora-gold-dark dark:text-luxora-gold text-xs font-bold uppercase tracking-wider rounded-md">
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Timeline Visual Progress */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-luxora-divider dark:before:bg-luxora-dark-divider">
            {statusSteps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-center gap-3">
                  <div
                    className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isPassed
                        ? 'bg-luxora-gold text-white shadow-gold'
                        : 'bg-luxora-surface border border-luxora-divider text-neutral-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-luxora-gold text-sm'
                          : isPassed
                          ? 'text-luxora-primary dark:text-luxora-dark-primary'
                          : 'text-luxora-secondary'
                      }`}
                    >
                      {step.label}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address & Details */}
        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-2 text-xs">
          <h3 className="font-serif text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary border-b border-luxora-divider pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-luxora-gold" />
            Destination Address
          </h3>
          <p className="font-semibold text-luxora-primary dark:text-luxora-dark-primary">
            {order.shippingAddress?.fullName}
          </p>
          <p className="text-luxora-secondary dark:text-luxora-dark-secondary">
            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} —{' '}
            {order.shippingAddress?.postalCode}
          </p>
          <p className="text-luxora-secondary">Phone: {order.shippingAddress?.phone}</p>
        </div>

        {/* Items Summary */}
        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-3">
          <h3 className="font-serif text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary border-b border-luxora-divider pb-2">
            Items in Order ({order.items.length})
          </h3>

          <div className="space-y-2.5">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-md bg-neutral-100" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-luxora-primary dark:text-luxora-dark-primary truncate">{item.name}</h4>
                  <p className="text-[10px] text-luxora-secondary">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-luxora-primary dark:text-luxora-dark-primary">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
