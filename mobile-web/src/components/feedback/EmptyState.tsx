import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 my-8 min-h-[350px]"
    >
      <div className="p-4 bg-luxora-gold-soft/30 dark:bg-luxora-gold/10 text-luxora-gold rounded-full mb-4">
        {icon}
      </div>

      <h3 className="font-serif text-xl font-semibold text-luxora-primary dark:text-luxora-dark-primary mb-1">
        {title}
      </h3>

      <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary max-w-xs mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
