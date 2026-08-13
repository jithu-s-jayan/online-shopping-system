import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, TrendingUp, History, Sparkles } from 'lucide-react';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductHorizontalCard } from '../components/product/ProductHorizontalCard';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import api from '../services/api';

const trendingKeywords = ['Cashmere', 'Leather Boots', 'Swiss Watch', 'Face Serum', 'Titanium Eyewear', 'Silk Dress'];

export const SearchExperienceScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUIStore();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        setSuggestions(res.data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    addRecentSearch(searchTerm);
    navigate(`/search/results?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      {/* Search Input Bar Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit(query);
          }}
          className="flex-1 flex items-center gap-2 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-xl px-3.5 py-2 shadow-subtle focus-within:border-luxora-gold"
        >
          <Search className="w-4 h-4 text-luxora-secondary" />
          <input
            type="text"
            placeholder="Search products, brands & more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-sans text-luxora-primary dark:text-luxora-dark-primary placeholder:text-neutral-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-neutral-400 hover:text-luxora-primary">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Live Search Suggestions */}
        {query.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="label-caps text-[10px] text-luxora-gold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                INSTANT MATCHES
              </span>
              {isLoading && <span className="text-xs text-luxora-secondary animate-pulse">Searching...</span>}
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-2.5">
                {suggestions.map((product) => (
                  <ProductHorizontalCard key={product._id} product={product} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-8 text-xs text-luxora-secondary">
                No matching products found for "<strong className="text-luxora-primary">{query}</strong>".
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary flex items-center gap-1">
                    <History className="w-3 h-3" />
                    RECENT SEARCHES
                  </span>
                  <button onClick={clearRecentSearches} className="text-[11px] text-luxora-secondary hover:text-luxora-error">
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(term)}
                      className="px-3 py-1.5 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-full text-xs text-luxora-primary dark:text-luxora-dark-primary hover:border-luxora-gold transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Keywords */}
            <div>
              <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3" />
                TRENDING NOW
              </span>

              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchSubmit(kw)}
                    className="px-3 py-1.5 bg-luxora-gold-soft/30 dark:bg-luxora-gold/10 border border-luxora-gold/20 rounded-full text-xs font-medium text-luxora-gold-dark dark:text-luxora-gold hover:bg-luxora-gold hover:text-white transition-colors"
                  >
                    🔥 {kw}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};
