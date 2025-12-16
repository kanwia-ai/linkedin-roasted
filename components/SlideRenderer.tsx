// components/SlideRenderer.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SlideData } from '@/lib/types';
import { Slide } from './Slide';

interface SlideRendererProps {
  slides: SlideData[];
  onComplete: () => void;
}

export function SlideRenderer({ slides, onComplete }: SlideRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 3) {
      goPrev();
    } else {
      goNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      goNext();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-[#0A0A0A] cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        <Slide
          key={currentIndex}
          slide={slides[currentIndex]}
          isActive={true}
        />
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-[#8B5CF6]' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-gray-600 text-sm">
        Tap to continue
      </div>
    </div>
  );
}
