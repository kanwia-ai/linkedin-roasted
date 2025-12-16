'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  "Reading your connection requests...",
  "Counting your coffee lies...",
  "Measuring your ghost energy...",
  "Calculating your cringe index...",
  "Analyzing your late-night activity...",
  "Detecting congratulations patterns...",
  "Finding the Gregs...",
  "This is worse than we expected...",
  "Actually, it's fine. Mostly.",
  "Preparing your roast...",
];

export function ProcessingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-[#8B5CF6] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: 'transparent' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-gray-400 text-lg text-center"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
