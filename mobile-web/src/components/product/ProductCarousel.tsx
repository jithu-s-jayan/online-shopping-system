import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, subtitle, products }) => {
  return (
    <section className="w-full py-4">
      {(title || subtitle) && (
        <div className="px-4 mb-3 flex items-end justify-between">
          <div>
            {title && <h2 className="font-serif text-xl font-semibold text-luxora-primary dark:text-luxora-dark-primary">{title}</h2>}
            {subtitle && <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Horizontal Touch Scrollable Track */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 snap-x snap-mandatory">
        {products.map((product) => (
          <div key={product._id} className="w-[170px] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
