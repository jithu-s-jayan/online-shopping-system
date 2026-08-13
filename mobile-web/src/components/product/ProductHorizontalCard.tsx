import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

interface ProductHorizontalCardProps {
  product: Product;
  onRemove?: () => void;
}

export const ProductHorizontalCard: React.FC<ProductHorizontalCardProps> = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useUIStore((state) => state.showToast);

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to bag`, 'success');
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.slug || product._id}`)}
      className="flex items-center gap-3 p-3 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/40 dark:border-luxora-dark-divider/40 shadow-subtle cursor-pointer"
    >
      <div className="w-20 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden shrink-0">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="label-caps text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary">
          {product.brand}
        </span>
        <h4 className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary truncate">
          {product.name}
        </h4>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary">
            ₹{(product.discountPrice || product.price).toLocaleString()}
          </span>
          {product.discountPrice && (
            <span className="font-sans text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="flex items-center gap-1 text-[11px] font-medium bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg px-3 py-1 rounded-md"
          >
            <ShoppingBag className="w-3 h-3" />
            Add to Bag
          </button>

          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 text-luxora-secondary dark:text-luxora-dark-secondary hover:text-luxora-error"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
