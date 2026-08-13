import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'underline' | 'box';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, variant = 'box', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-luxora-secondary dark:text-luxora-dark-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-luxora-secondary dark:text-luxora-dark-secondary">{leftIcon}</div>}
          <input
            ref={ref}
            className={`w-full font-sans text-sm text-luxora-primary dark:text-luxora-dark-primary bg-luxora-surface dark:bg-luxora-dark-surface placeholder:text-neutral-400 focus:outline-none transition-colors ${
              variant === 'underline'
                ? 'border-b border-luxora-divider dark:border-luxora-dark-divider py-3 focus:border-luxora-primary dark:focus:border-luxora-dark-primary rounded-none'
                : 'border border-luxora-divider dark:border-luxora-dark-divider rounded-md px-4 py-3 focus:border-luxora-gold dark:focus:border-luxora-gold'
            } ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? '!border-luxora-error' : ''} ${className}`}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-luxora-secondary dark:text-luxora-dark-secondary">{rightIcon}</div>}
        </div>
        {error && <p className="mt-1 text-xs text-luxora-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
