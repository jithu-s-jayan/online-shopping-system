import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'dark' | 'success' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className = '' }) => {
  const variantStyles = {
    gold: 'bg-luxora-gold-soft text-luxora-gold-dark border border-luxora-gold/20',
    dark: 'bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
    outline: 'border border-luxora-divider text-luxora-secondary dark:border-luxora-dark-divider dark:text-luxora-dark-secondary'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
