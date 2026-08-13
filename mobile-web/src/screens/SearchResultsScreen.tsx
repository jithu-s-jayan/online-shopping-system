import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, SearchX } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import api from '../services/api';

export const SearchResultsScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setFilterOpen = useUIStore((state) => state.setFilterOpen);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(query)}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Search results error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="label-caps text-[10px] text-luxora-gold">SEARCH RESULTS</span>
              <h1 className="font-serif text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary line-clamp-1">
                "{query}"
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

        <div className="px-4 py-2 border-b border-luxora-divider dark:border-luxora-dark-divider text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
          Found {products.length} luxury item{products.length === 1 ? '' : 's'} matching "{query}"
        </div>

        {isLoading ? (
          <div className="p-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-1/3 h-3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="p-4 grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<SearchX className="w-8 h-8" />}
            title="No Results Found"
            description={`We couldn't find any products matching "${query}". Try searching for another luxury keyword.`}
            actionLabel="Explore All Products"
            onAction={() => navigate('/shop')}
          />
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};
