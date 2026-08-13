import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuthStore } from '../store/useAuthStore';
import { Product, Category } from '../types';
import api from '../services/api';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, newRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
          api.get('/products?newArrival=true&limit=8')
        ]);
        setCategories(catRes.data.categories || []);
        setFeaturedProducts(featRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.firstName || 'Valued Guest';

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto">
        {/* User Greeting */}
        <section className="px-4 pt-4 pb-2">
          <span className="label-caps text-[11px] text-luxora-gold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            LUXORA EXCLUSIVE
          </span>
          <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mt-0.5">
            Discover something extraordinary today.
          </p>
        </section>

        {/* Search Field Trigger */}
        <section className="px-4 py-2">
          <div
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-xl px-4 py-3 shadow-subtle cursor-pointer hover:border-luxora-gold transition-colors"
          >
            <Search className="w-4 h-4 text-luxora-secondary" />
            <span className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
              Search products, brands & more...
            </span>
          </div>
        </section>

        {/* Scrollable Horizontal Categories */}
        <section className="py-3">
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="w-12 h-3" />
                  </div>
                ))
              : categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxora-divider dark:border-luxora-dark-divider group-hover:border-luxora-gold transition-colors p-0.5">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-[11px] font-medium text-luxora-primary dark:text-luxora-dark-primary group-hover:text-luxora-gold transition-colors">
                      {cat.name}
                    </span>
                  </button>
                ))}
          </div>
        </section>

        {/* Hero Promotional Banner */}
        <section className="px-4 py-2">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-elevated group cursor-pointer" onClick={() => navigate('/shop')}>
            <img
              src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&auto=format&fit=crop&q=80"
              alt="The New Standard Hero"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="label-caps text-luxora-gold text-[10px] mb-1">AUTUMN / WINTER 2026</span>
              <h2 className="font-serif text-2xl font-bold tracking-wide">THE NEW STANDARD</h2>
              <p className="text-xs text-neutral-200 mt-1 line-clamp-1">
                Minimalist cashmere outerwear & handcrafted leather.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-luxora-gold group-hover:translate-x-1 transition-transform">
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Collection Carousel */}
        <ProductCarousel
          title="Trending Essentials"
          subtitle="Curated high-demand luxury items"
          products={featuredProducts}
        />

        {/* Special Offer Banner */}
        <section className="px-4 py-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-luxora-primary to-neutral-900 text-white dark:from-luxora-dark-surface dark:to-neutral-900 border border-luxora-gold/20 shadow-elevated relative overflow-hidden">
            <div className="relative z-10">
              <span className="label-caps text-luxora-gold text-[10px]">LIMITED OFFER</span>
              <h3 className="font-serif text-xl font-bold mt-1">Get 20% Off Your Purchase</h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-[240px]">
                Use code <strong className="text-luxora-gold font-mono">ELEVATE20</strong> on orders over ₹15,000.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 px-4 py-2 bg-luxora-gold text-white text-xs font-semibold rounded-md shadow-gold hover:bg-luxora-gold-dark transition-colors"
              >
                Claim Discount
              </button>
            </div>
          </div>
        </section>

        {/* New Arrivals Grid */}
        <section className="px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                New Arrivals
              </h2>
              <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">Freshly added to the catalog</p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-semibold text-luxora-gold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-1/3 h-3" />
                  </div>
                ))
              : newArrivals.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="px-4 py-6 border-t border-luxora-divider dark:border-luxora-dark-divider my-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-luxora-gold mb-1" />
              <span className="text-[11px] font-semibold text-luxora-primary dark:text-luxora-dark-primary">Express Courier</span>
              <span className="text-[9px] text-luxora-secondary">Pan-India Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-luxora-gold mb-1" />
              <span className="text-[11px] font-semibold text-luxora-primary dark:text-luxora-dark-primary">100% Authentic</span>
              <span className="text-[9px] text-luxora-secondary">Guaranteed Quality</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-luxora-gold mb-1" />
              <span className="text-[11px] font-semibold text-luxora-primary dark:text-luxora-dark-primary">Easy Returns</span>
              <span className="text-[9px] text-luxora-secondary">30-Day Window</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};
