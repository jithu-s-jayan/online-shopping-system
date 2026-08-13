import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageCheck, Truck, ChevronRight, ShoppingBag } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { EmptyState } from '../components/feedback/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Order } from '../types';
import api from '../services/api';

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const MyOrdersScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const query = activeTab !== 'All' ? `?status=${activeTab}` : '';
        const res = await api.get(`/orders${query}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">PURCHASE HISTORY</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              My Orders
            </h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-luxora-gold text-white shadow-gold'
                  : 'bg-luxora-surface text-luxora-primary border border-luxora-divider dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border-luxora-dark-divider'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-32 rounded-xl" />)
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/order-tracking/${order._id}`)}
                className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle cursor-pointer hover:border-luxora-gold transition-colors space-y-3"
              >
                <div className="flex justify-between items-center border-b border-luxora-divider/40 pb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-luxora-primary dark:text-luxora-dark-primary">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-luxora-secondary block">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-luxora-gold-soft/30 text-luxora-gold-dark dark:text-luxora-gold">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {order.items?.[0] && (
                    <img
                      src={order.items[0].image}
                      alt={order.items[0].name}
                      className="w-12 h-14 object-cover rounded-md bg-neutral-100"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-luxora-primary dark:text-luxora-dark-primary truncate">
                      {order.items?.[0]?.name}
                    </h4>
                    {order.items?.length > 1 && (
                      <p className="text-[10px] text-luxora-secondary">+{order.items.length - 1} more items</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-sans text-xs font-bold text-luxora-primary dark:text-luxora-dark-primary block">
                      ₹{order.total.toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-luxora-secondary ml-auto mt-1" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<ShoppingBag className="w-8 h-8" />}
              title="No Orders Found"
              description={`You have no orders in the "${activeTab}" category.`}
              actionLabel="Start Shopping"
              onAction={() => navigate('/shop')}
            />
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
