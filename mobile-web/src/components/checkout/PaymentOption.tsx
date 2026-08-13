import React from 'react';
import { CreditCard, Banknote, ShieldCheck, Zap } from 'lucide-react';

interface PaymentOptionProps {
  id: 'DEMO' | 'RAZORPAY' | 'STRIPE' | 'COD';
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const PaymentOption: React.FC<PaymentOptionProps> = ({ id, name, description, isSelected, onSelect }) => {
  const getIcon = () => {
    switch (id) {
      case 'DEMO':
        return <Zap className="w-5 h-5 text-luxora-gold" />;
      case 'RAZORPAY':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'STRIPE':
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      case 'COD':
        return <Banknote className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
        isSelected
          ? 'border-luxora-gold bg-luxora-gold-soft/20 dark:bg-luxora-gold/10 shadow-subtle'
          : 'border-luxora-divider dark:border-luxora-dark-divider bg-luxora-surface dark:bg-luxora-dark-surface'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">{getIcon()}</div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary flex items-center gap-2">
            {name}
            {id === 'DEMO' && (
              <span className="text-[9px] bg-luxora-gold text-white px-1.5 py-0.5 rounded font-bold uppercase">
                RECOMMENDED
              </span>
            )}
          </h4>
          <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mt-0.5">{description}</p>
        </div>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-luxora-gold bg-luxora-gold' : 'border-neutral-400'
        }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  );
};
