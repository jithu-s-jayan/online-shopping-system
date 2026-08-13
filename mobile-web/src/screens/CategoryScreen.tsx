import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import api from '../services/api';

export const CategoryScreen: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const setFilterOpen = useUIStore((state) => state.setFilterOpen);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products?category=${categorySlug}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error loading category products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  const formattedTitle = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : 'Category';

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto">
        {/* Header Bar */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="label-caps text-[10px] text-luxora-gold">CATEGORY EXPLORER</span>
              <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
                {formattedTitle}
              </h1>
            </div>
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 text-luxora-primary dark:text-luxora-dark-primary border border-luxora-divider dark:border-luxora-dark-divider rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Product Count Header */}
        <div className="px-4 py-2 border-b border-luxora-divider dark:border-luxora-dark-divider text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
          Showing {products.length} luxury products in {formattedTitle}
        </div>

        {/* Product Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                  <Skeleton className="w-2/3 h-4" />
                  <Skeleton className="w-1/3 h-3" />
                </div>
              ))
            : products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
