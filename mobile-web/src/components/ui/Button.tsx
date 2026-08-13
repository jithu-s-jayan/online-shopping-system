import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 rounded',
    md: 'text-sm px-5 py-3 rounded-md min-h-[48px]',
    lg: 'text-base px-6 py-4 rounded-md min-h-[52px]'
  };

  const variantStyles = {
    primary: 'bg-luxora-primary text-white hover:bg-neutral-800 dark:bg-luxora-dark-primary dark:text-luxora-dark-bg dark:hover:bg-neutral-200 shadow-subtle',
    secondary: 'bg-luxora-surface-variant text-luxora-primary hover:bg-neutral-200 dark:bg-luxora-dark-surface-2 dark:text-luxora-dark-primary',
    outline: 'border border-luxora-divider text-luxora-primary hover:bg-luxora-surface-variant dark:border-luxora-dark-divider dark:text-luxora-dark-primary',
    ghost: 'text-luxora-primary hover:bg-neutral-100 dark:text-luxora-dark-primary dark:hover:bg-neutral-800',
    gold: 'bg-luxora-gold text-white hover:bg-luxora-gold-dark shadow-gold',
    pill: 'bg-luxora-primary text-white rounded-full text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:bg-neutral-800 dark:bg-luxora-dark-primary dark:text-luxora-dark-bg'
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
