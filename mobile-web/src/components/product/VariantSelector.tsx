import React from 'react';

interface VariantSelectorProps {
  colors?: string[];
  sizes?: string[];
  selectedColor?: string;
  selectedSize?: string;
  onSelectColor?: (color: string) => void;
  onSelectSize?: (size: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize
}) => {
  return (
    <div className="space-y-4 my-4">
      {/* Colors */}
      {colors && colors.length > 0 && (
        <div>
          <span className="label-caps text-[11px] text-luxora-secondary dark:text-luxora-dark-secondary block mb-2">
            Color: <strong className="text-luxora-primary dark:text-luxora-dark-primary normal-case font-semibold">{selectedColor}</strong>
          </span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onSelectColor && onSelectColor(color)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg border-luxora-primary dark:border-luxora-dark-primary shadow-sm'
                      : 'bg-luxora-surface text-luxora-primary border-luxora-divider dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border-luxora-dark-divider hover:border-luxora-gold'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <span className="label-caps text-[11px] text-luxora-secondary dark:text-luxora-dark-secondary block mb-2">
            Size: <strong className="text-luxora-primary dark:text-luxora-dark-primary normal-case font-semibold">{selectedSize}</strong>
          </span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onSelectSize && onSelectSize(size)}
                  className={`min-w-[40px] h-9 px-3 rounded-md text-xs font-semibold border transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-luxora-gold text-white border-luxora-gold shadow-gold'
                      : 'bg-luxora-surface text-luxora-primary border-luxora-divider dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border-luxora-dark-divider hover:border-luxora-gold'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
