import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto w-full flex items-start gap-3 p-4 bg-luxora-primary text-white dark:bg-luxora-dark-surface dark:text-luxora-dark-primary dark:border dark:border-luxora-dark-divider rounded-xl shadow-elevated"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-luxora-gold shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-luxora-error shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              {toast.title && <h4 className="text-xs font-semibold uppercase tracking-wider mb-0.5">{toast.title}</h4>}
              <p className="text-xs text-neutral-200 dark:text-neutral-300 leading-snug">{toast.message}</p>
            </div>

            <button onClick={() => removeToast(toast.id)} className="text-neutral-400 hover:text-white p-0.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
