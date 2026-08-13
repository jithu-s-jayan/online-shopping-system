import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-luxora-surface dark:bg-luxora-dark-surface rounded-md shadow-subtle border border-luxora-divider/50 dark:border-luxora-dark-divider/50 overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-elevated transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
