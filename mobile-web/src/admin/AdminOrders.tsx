import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { useUIStore } from '../store/useUIStore';
import { Order } from '../types';
import api from '../services/api';

const statusList = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useUIStore((state) => state.showToast);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchAdminOrders();
      }
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-luxora-divider pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">LUXORA MANAGEMENT</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Order Operations
            </h1>
          </div>
        </div>

        <button onClick={fetchAdminOrders} className="p-2 text-luxora-secondary hover:text-luxora-primary">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <Skeleton className="w-full h-32" />
        ) : orders.map((order) => (
          <div
            key={order._id}
            className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider shadow-subtle space-y-3 text-xs"
          >
            <div className="flex justify-between items-center border-b border-luxora-divider pb-2">
              <div>
                <span className="font-mono font-bold text-sm text-luxora-primary dark:text-luxora-dark-primary">
                  #{order.orderNumber}
                </span>
                <span className="text-[10px] text-luxora-secondary block">
                  Customer: {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-luxora-primary dark:text-luxora-dark-primary block">
                  ₹{order.total.toLocaleString()}
                </span>
                <span className="text-[10px] text-luxora-secondary">Method: {order.paymentMethod}</span>
              </div>
            </div>

            {/* Status Selector Control */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-luxora-secondary">Update Order Status:</span>
              <select
                value={order.orderStatus}
                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                className="px-3 py-1.5 bg-luxora-bg dark:bg-luxora-dark-bg border border-luxora-divider rounded-lg font-semibold text-luxora-gold focus:outline-none"
              >
                {statusList.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
