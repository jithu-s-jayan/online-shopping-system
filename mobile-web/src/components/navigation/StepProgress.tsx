import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number; // 1: Address, 2: Delivery, 3: Payment, 4: Review
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Address' },
    { number: 2, label: 'Delivery' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Review' }
  ];

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative max-w-sm mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-luxora-divider dark:bg-luxora-dark-divider -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-luxora-gold -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-luxora-gold text-white'
                    : isCurrent
                    ? 'bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg ring-4 ring-luxora-gold/20'
                    : 'bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider dark:border-luxora-dark-divider text-luxora-secondary'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${
                  isCurrent ? 'text-luxora-primary dark:text-luxora-dark-primary' : 'text-luxora-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
