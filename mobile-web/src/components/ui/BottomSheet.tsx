import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full max-w-lg bg-luxora-surface dark:bg-luxora-dark-surface rounded-t-2xl shadow-elevated overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
              <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-luxora-divider dark:border-luxora-dark-divider">
                <h3 className="font-serif text-lg font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 text-luxora-secondary dark:text-luxora-dark-secondary hover:text-luxora-primary dark:hover:text-luxora-dark-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content Area */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
