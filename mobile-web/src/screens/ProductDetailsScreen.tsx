import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, Zap } from 'lucide-react';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUIStore } from '../store/useUIStore';
import { Product, Review } from '../types';
import api from '../services/api';

export const ProductDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSpecs, setShowSpecs] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState('');

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const prodData = res.data.product;
        setProduct(prodData);
        if (prodData?.variants?.colors?.length) setSelectedColor(prodData.variants.colors[0]);
        if (prodData?.variants?.sizes?.length) setSelectedSize(prodData.variants.sizes[0]);

        const revRes = await api.get(`/reviews/products/${prodData._id}`);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 max-w-md mx-auto space-y-4">
        <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-5" />
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1);
    showToast(`${product.name} added to bag`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, 1);
    navigate('/cart');
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeStatus('Available for express delivery in 2 business days.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Pincode.');
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-28">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-serif text-lg font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          {product.brand}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              } else {
                showToast('Link copied to clipboard', 'info');
              }
            }}
            className="p-2 text-luxora-primary dark:text-luxora-dark-primary hover:text-luxora-gold"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              toggleWishlist(product).then((isAdded) =>
                showToast(isAdded ? 'Saved to wishlist' : 'Removed from wishlist', 'info')
              );
            }}
            className="p-2 text-luxora-primary dark:text-luxora-dark-primary hover:text-luxora-gold"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-luxora-error text-luxora-error' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Product Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Title, Brand & Price */}
        <div>
          <span className="label-caps text-luxora-gold text-[11px] mb-0.5 block">{product.brand}</span>
          <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-luxora-gold-soft/40 px-2 py-0.5 rounded text-xs font-semibold text-luxora-gold-dark">
              <Star className="w-3.5 h-3.5 fill-luxora-gold text-luxora-gold" />
              <span>{product.rating}</span>
            </div>
            <span className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
              ({product.reviewCount} customer reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <>
                <span className="font-sans text-sm text-luxora-secondary dark:text-luxora-dark-secondary line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-luxora-gold uppercase tracking-wider">
                  Save ₹{(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            )}
          </div>
          <p className="text-[10px] text-luxora-secondary dark:text-luxora-dark-secondary mt-1">
            Inclusive of all applicable taxes & duties.
          </p>
        </div>

        {/* Variant Selectors */}
        <VariantSelector
          colors={product.variants?.colors}
          sizes={product.variants?.sizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onSelectColor={setSelectedColor}
          onSelectSize={setSelectedSize}
        />

        {/* Stock Status */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
          <span className="font-semibold">In Stock — Ready to Dispatch</span>
          <span className="text-[10px] font-bold uppercase">{product.stock} Units Left</span>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-serif text-base font-semibold text-luxora-primary dark:text-luxora-dark-primary mb-1">
            Product Overview
          </h3>
          <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications Accordion */}
        <div className="border-t border-b border-luxora-divider dark:border-luxora-dark-divider py-3">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between font-serif text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary"
          >
            <span>Material & Specifications</span>
            {showSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSpecs && product.specifications && (
            <div className="mt-3 space-y-2 text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-luxora-divider/40 pb-1">
                  <span className="font-semibold">{key}:</span>
                  <span>{String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pincode / Delivery Estimator */}
        <div className="bg-luxora-surface dark:bg-luxora-dark-surface p-4 rounded-xl border border-luxora-divider dark:border-luxora-dark-divider space-y-2">
          <h4 className="font-serif text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-luxora-gold" />
            Check Delivery Availability
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-luxora-divider dark:border-luxora-dark-divider rounded-lg bg-transparent"
            />
            <button
              onClick={checkPincode}
              className="px-4 py-2 bg-luxora-primary text-white text-xs font-semibold rounded-lg"
            >
              Check
            </button>
          </div>
          {pincodeStatus && <p className="text-[11px] text-luxora-gold font-medium mt-1">{pincodeStatus}</p>}
        </div>

        {/* Verified Reviews Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-base font-semibold text-luxora-primary dark:text-luxora-dark-primary">
              Customer Reviews ({reviews.length})
            </h3>
          </div>

          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-3 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                      {rev.userName}
                    </span>
                    <div className="flex items-center gap-0.5 text-xs text-luxora-gold">
                      <Star className="w-3 h-3 fill-luxora-gold" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">{rev.comment}</p>
                  {rev.verifiedPurchase && (
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-luxora-secondary">No reviews submitted yet for this product.</p>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-luxora-divider dark:border-luxora-dark-divider p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto flex items-center gap-3">
        <Button variant="outline" fullWidth onClick={handleAddToCart} className="gap-2">
          <ShoppingBag className="w-4 h-4" />
          Add to Bag
        </Button>

        <Button variant="gold" fullWidth onClick={handleBuyNow} className="gap-2">
          <Zap className="w-4 h-4" />
          Buy Now
        </Button>
      </div>
    </div>
  );
};
