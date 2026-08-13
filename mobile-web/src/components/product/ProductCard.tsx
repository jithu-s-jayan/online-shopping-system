import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useUIStore((state) => state.showToast);

  const wishlisted = isWishlisted(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    added.then((isAdded) => {
      showToast(isAdded ? 'Saved to wishlist' : 'Removed from wishlist', 'info');
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.variants?.colors?.[0];
    const defaultSize = product.variants?.sizes?.[0];
    addToCart(product, defaultColor, defaultSize, 1);
    showToast(`${product.name} added to bag`, 'success');
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.slug || product._id}`)}
      className="group relative flex flex-col bg-luxora-surface dark:bg-luxora-dark-surface rounded-lg overflow-hidden border border-luxora-divider/40 dark:border-luxora-dark-divider/40 shadow-subtle cursor-pointer select-none"
    >
      {/* Product Image Container (4:5 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-luxora-gold text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-full glass-panel shadow-sm text-luxora-primary dark:text-white hover:scale-110 active:scale-90 transition-all z-10"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-luxora-error text-luxora-error' : 'text-neutral-600 dark:text-neutral-300'}`} />
        </button>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2.5 right-2.5 p-2.5 bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg rounded-full shadow-md hover:bg-neutral-800 active:scale-90 transition-all z-10"
          aria-label="Add to Cart"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary block mb-0.5">
            {product.brand}
          </span>
          <h3 className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary line-clamp-1 group-hover:text-luxora-gold transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-semibold text-sm text-luxora-primary dark:text-luxora-dark-primary">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="font-sans text-[11px] text-luxora-secondary dark:text-luxora-dark-secondary line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
            <Star className="w-3 h-3 fill-luxora-gold text-luxora-gold" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
