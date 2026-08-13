import React from 'react';

interface SummaryBreakdownProps {
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
}

export const SummaryBreakdown: React.FC<SummaryBreakdownProps> = ({
  subtotal,
  discount = 0,
  shipping = 0,
  tax = 0,
  total
}) => {
  return (
    <div className="bg-luxora-surface dark:bg-luxora-dark-surface p-4 rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 space-y-2.5">
      <h3 className="font-serif text-base font-semibold text-luxora-primary dark:text-luxora-dark-primary border-b border-luxora-divider dark:border-luxora-dark-divider pb-2">
        Order Summary
      </h3>

      <div className="flex justify-between text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
        <span>Subtotal</span>
        <span className="font-semibold text-luxora-primary dark:text-luxora-dark-primary">₹{subtotal.toLocaleString()}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-xs text-luxora-gold">
          <span>Coupon Discount</span>
          <span className="font-semibold">-₹{discount.toLocaleString()}</span>
        </div>
      )}

      <div className="flex justify-between text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
        <span>Estimated Tax (GST 18%)</span>
        <span className="font-semibold text-luxora-primary dark:text-luxora-dark-primary">₹{tax.toLocaleString()}</span>
      </div>

      <div className="flex justify-between text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
        <span>Shipping</span>
        <span className="font-semibold text-luxora-primary dark:text-luxora-dark-primary">
          {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
        </span>
      </div>

      <div className="border-t border-luxora-divider dark:border-luxora-dark-divider pt-2.5 flex justify-between items-baseline">
        <span className="font-sans text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary">Total Amount</span>
        <span className="font-sans text-lg font-bold text-luxora-gold">₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
};
