import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl shadow-elevated overflow-hidden"
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-luxora-divider dark:border-luxora-dark-divider">
                <h3 className="font-serif text-lg font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                  {title}
                </h3>
                <button onClick={onClose} className="p-1 text-luxora-secondary dark:text-luxora-dark-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
