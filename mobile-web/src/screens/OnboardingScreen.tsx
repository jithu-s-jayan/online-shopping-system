import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useUIStore } from '../store/useUIStore';

const slides = [
  {
    title: 'Discover Your Style',
    subtitle: 'Curated luxury fashion, artisan footwear, and timeless accessories crafted for the modern aesthetic.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Shop Without Limits',
    subtitle: 'Seamless, mobile-first luxury shopping with effortless multi-method checkout and instant order tracking.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Delivered With Care',
    subtitle: 'White-glove courier delivery, complimentary gift wrapping, and hassle-free 30-day luxury returns.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  }
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const completeOnboarding = useUIStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      navigate('/home');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home');
  };

  return (
    <div className="fixed inset-0 z-40 bg-luxora-bg dark:bg-luxora-dark-bg flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10 pt-2">
        <span className="font-serif text-xl font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          LUXORA
        </span>
        <button
          onClick={handleSkip}
          className="text-xs font-semibold uppercase tracking-wider text-luxora-secondary dark:text-luxora-dark-secondary hover:text-luxora-primary"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Image Container */}
            <div className="w-full max-w-xs aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-elevated mb-6">
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-2">
              {slides[currentIndex].title}
            </h2>

            <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary max-w-xs leading-relaxed">
              {slides[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer & Controls */}
      <div className="flex flex-col items-center gap-6 z-10 pb-4">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-luxora-gold' : 'w-2 bg-luxora-divider dark:bg-luxora-dark-divider'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button variant="primary" fullWidth onClick={handleNext}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
