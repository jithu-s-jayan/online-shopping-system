import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartOff } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ProductHorizontalCard } from '../components/product/ProductHorizontalCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUIStore } from '../store/useUIStore';

export const WishlistScreen: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4">
        {/* Header Title */}
        <div className="mb-4">
          <span className="label-caps text-[10px] text-luxora-gold">SAVED CURATIONS</span>
          <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 ? (
          <div className="space-y-3">
            {wishlist.map((product) => (
              <ProductHorizontalCard
                key={product._id}
                product={product}
                onRemove={() => {
                  toggleWishlist(product);
                  showToast('Removed from wishlist', 'info');
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HeartOff className="w-8 h-8" />}
            title="Nothing Saved Yet"
            description="Find something worth keeping. Explore our luxury collection and save your favorite pieces here."
            actionLabel="Explore Products"
            onAction={() => navigate('/shop')}
          />
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};
