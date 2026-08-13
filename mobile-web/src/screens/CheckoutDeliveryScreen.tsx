import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Zap, CheckCircle2 } from 'lucide-react';
import { StepProgress } from '../components/navigation/StepProgress';
import { Button } from '../components/ui/Button';

const deliveryOptions = [
  {
    id: 'express',
    name: 'Express White-Glove Courier',
    estimatedDays: '2 Business Days',
    price: 499,
    description: 'Priority handling with insured express courier & signature delivery.',
    icon: Zap
  },
  {
    id: 'standard',
    name: 'Standard Insured Delivery',
    estimatedDays: '4-6 Business Days',
    price: 0,
    description: 'Complimentary insured shipping across India.',
    icon: Truck
  }
];

export const CheckoutDeliveryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>('express');

  const handleContinue = () => {
    const selected = deliveryOptions.find((d) => d.id === selectedId) || deliveryOptions[0];
    sessionStorage.setItem('luxora_selected_delivery', JSON.stringify(selected));
    navigate('/checkout/payment');
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-lg font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          Checkout
        </span>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <StepProgress currentStep={2} />

        <h2 className="font-serif text-lg font-semibold text-luxora-primary dark:text-luxora-dark-primary pt-2">
          Select Delivery Method
        </h2>

        <div className="space-y-3">
          {deliveryOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedId === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedId(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-luxora-gold bg-luxora-gold-soft/20 dark:bg-luxora-gold/10 shadow-subtle'
                    : 'border-luxora-divider dark:border-luxora-dark-divider bg-luxora-surface dark:bg-luxora-dark-surface'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                    <Icon className="w-5 h-5 text-luxora-gold" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                      {opt.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-luxora-gold block mt-0.5">
                      Est. Arrival: {opt.estimatedDays}
                    </span>
                    <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mt-1 max-w-[220px]">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-sans text-sm font-bold text-luxora-primary dark:text-luxora-dark-primary block">
                    {opt.price === 0 ? 'FREE' : `₹${opt.price}`}
                  </span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-luxora-gold ml-auto mt-2" />}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-luxora-divider dark:border-luxora-dark-divider p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto">
        <Button variant="gold" fullWidth onClick={handleContinue}>
          Continue to Payment Method
        </Button>
      </div>
    </div>
  );
};
