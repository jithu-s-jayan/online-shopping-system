import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useUIStore } from '../store/useUIStore';
import { Product, Category } from '../types';
import api from '../services/api';

export const ShopScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const { isFilterOpen, isSortOpen, setFilterOpen, setSortOpen } = useUIStore();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSort) params.append('sort', selectedSort);
      if (minPrice) params.append('minPrice', String(minPrice));
      if (maxPrice) params.append('maxPrice', String(maxPrice));

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSort]);

  const handleApplyFilters = () => {
    fetchProducts();
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto">
        {/* Title Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">LUXORA CATALOG</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              All Collections
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-lg"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>

            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg rounded-lg shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Active Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-luxora-gold text-white shadow-gold'
                : 'bg-luxora-surface text-luxora-primary border border-luxora-divider dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border-luxora-dark-divider'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-luxora-gold text-white shadow-gold'
                  : 'bg-luxora-surface text-luxora-primary border border-luxora-divider dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border-luxora-dark-divider'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active Filter summary bar */}
        {(selectedCategory || minPrice || maxPrice) && (
          <div className="px-4 py-1.5 flex items-center justify-between text-xs bg-luxora-gold-soft/30 dark:bg-luxora-gold/10 text-luxora-gold-dark dark:text-luxora-gold">
            <span className="font-medium">
              Active Filters: {selectedCategory && `Category: ${selectedCategory} `}
              {minPrice && `Min ₹${minPrice} `}
              {maxPrice && `Max ₹${maxPrice}`}
            </span>
            <button onClick={handleClearFilters} className="p-0.5 hover:text-luxora-error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Products Grid */}
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

      {/* FILTER BOTTOM SHEET */}
      <BottomSheet isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} title="Filter Catalog">
        <div className="space-y-6">
          {/* Categories Filter */}
          <div>
            <label className="label-caps text-[11px] text-luxora-secondary block mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name === selectedCategory ? '' : cat.name)}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                    selectedCategory === cat.name
                      ? 'border-luxora-gold bg-luxora-gold-soft/30 text-luxora-gold-dark font-semibold'
                      : 'border-luxora-divider dark:border-luxora-dark-divider text-luxora-primary dark:text-luxora-dark-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="label-caps text-[11px] text-luxora-secondary block mb-2">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                className="p-2.5 text-xs bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-lg"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="p-2.5 text-xs bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="gold" fullWidth onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* SORT BOTTOM SHEET */}
      <BottomSheet isOpen={isSortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        <div className="space-y-2">
          {[
            { id: 'newest', label: 'Newest Arrivals' },
            { id: 'popular', label: 'Most Popular / Best Rated' },
            { id: 'price_asc', label: 'Price: Low to High' },
            { id: 'price_desc', label: 'Price: High to Low' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedSort(option.id);
                setSortOpen(false);
              }}
              className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left border transition-colors flex items-center justify-between ${
                selectedSort === option.id
                  ? 'border-luxora-gold bg-luxora-gold-soft/30 text-luxora-gold-dark dark:text-luxora-gold'
                  : 'border-luxora-divider dark:border-luxora-dark-divider text-luxora-primary dark:text-luxora-dark-primary'
              }`}
            >
              <span>{option.label}</span>
              {selectedSort === option.id && <span className="w-2 h-2 rounded-full bg-luxora-gold" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomNavigation />
    </div>
  );
};
