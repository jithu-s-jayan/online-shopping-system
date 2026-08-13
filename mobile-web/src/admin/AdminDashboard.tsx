import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, ShoppingBag, Users, Package, Clock, RefreshCw } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../services/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/metrics');
      setMetrics(res.data.metrics);
      setRecentOrders(res.data.recentOrders || []);
      setCategorySales(res.data.categorySales || []);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-luxora-divider dark:border-luxora-dark-divider pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="p-2 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider dark:border-luxora-dark-divider">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">LUXORA MANAGEMENT</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <button onClick={fetchMetrics} className="p-2 text-luxora-secondary hover:text-luxora-primary">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Top Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button className="px-4 py-2 bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg rounded-lg text-xs font-semibold">
          Overview Metrics
        </button>
        <button onClick={() => navigate('/admin/products')} className="px-4 py-2 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider text-luxora-primary dark:text-luxora-dark-primary rounded-lg text-xs font-semibold hover:border-luxora-gold">
          Products Catalog
        </button>
        <button onClick={() => navigate('/admin/orders')} className="px-4 py-2 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider text-luxora-primary dark:text-luxora-dark-primary rounded-lg text-xs font-semibold hover:border-luxora-gold">
          Order Processing
        </button>
        <button onClick={() => navigate('/admin/customers')} className="px-4 py-2 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider text-luxora-primary dark:text-luxora-dark-primary rounded-lg text-xs font-semibold hover:border-luxora-gold">
          Customer Directory
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-luxora-secondary">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            ₹{isLoading ? '...' : (metrics?.totalRevenue || 0).toLocaleString()}
          </h3>
        </div>

        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-luxora-secondary">Total Orders</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            {isLoading ? '...' : metrics?.totalOrders || 0}
          </h3>
        </div>

        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-luxora-secondary">Customers</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            {isLoading ? '...' : metrics?.totalCustomers || 0}
          </h3>
        </div>

        <div className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-luxora-secondary">Active Products</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            {isLoading ? '...' : metrics?.totalProducts || 0}
          </h3>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-5 bg-luxora-surface dark:bg-luxora-dark-surface rounded-2xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-luxora-divider pb-3">
          <h3 className="font-serif text-base font-semibold text-luxora-primary dark:text-luxora-dark-primary">
            Recent Orders Activity
          </h3>
          <button onClick={() => navigate('/admin/orders')} className="text-xs font-semibold text-luxora-gold">
            Manage Orders →
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <Skeleton className="w-full h-24" />
          ) : recentOrders.length > 0 ? (
            recentOrders.map((ord) => (
              <div
                key={ord._id}
                className="flex items-center justify-between p-3 bg-luxora-bg dark:bg-luxora-dark-bg rounded-xl border border-luxora-divider/40 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-luxora-primary dark:text-luxora-dark-primary">
                    #{ord.orderNumber}
                  </span>
                  <span className="text-luxora-secondary block">
                    {ord.user ? `${ord.user.firstName} ${ord.user.lastName}` : 'Guest Customer'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-luxora-primary dark:text-luxora-dark-primary block">
                    ₹{ord.total.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 bg-luxora-gold-soft/30 text-luxora-gold-dark text-[10px] font-semibold uppercase rounded">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-luxora-secondary text-center py-4">No recent orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
