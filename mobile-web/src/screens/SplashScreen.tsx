import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasOnboarding = localStorage.getItem('luxora_onboarding') === 'true';
      if (hasOnboarding) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-luxora-primary text-white dark:bg-luxora-dark-bg p-8 select-none">
      <div />

      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2"
        >
          LUXORA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-sans text-xs uppercase tracking-[0.25em] text-luxora-gold"
        >
          Elevate Your Everyday.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-16 h-0.5 bg-neutral-800 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-full h-full bg-luxora-gold"
        />
      </motion.div>
    </div>
  );
};
