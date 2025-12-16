// components/SlideRenderer.tsx
'use client';

import { useState, useEffect } from 'react';
import type { SlideData } from '@/lib/types';
import { getRoast } from '@/data/roastTemplates';

interface SlideRendererProps {
  slides: SlideData[];
  onComplete: () => void;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function SlideRenderer({ slides, onComplete }: SlideRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Get roast content
  const content = getRoast(slide.type, slide.flavor, slide.data);
  const lines = content.split('\n').filter(line => line.trim());

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => window.location.href = '/upload'} className="text-gray-500 hover:text-white text-sm">
          ← Start Over
        </button>
        <span className="text-gray-500 text-sm">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Slide card */}
      <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={handleClick}>
        <div
          className="w-full max-w-md roast-card p-6"
          style={{ aspectRatio: '4/5' }}
        >
          <div className="flex flex-col justify-center h-full space-y-4">
            {lines.map((line, i) => {
              const isFirst = i === 0;
              const isLast = i === lines.length - 1;

              return (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    isFirst
                      ? 'text-2xl font-bold stat-text'
                      : isLast
                        ? 'text-purple-400'
                        : 'text-lg text-gray-300'
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={`p-2 ${currentIndex === 0 ? 'text-gray-700' : 'text-gray-400 hover:text-white'}`}
        >
          <ChevronLeft />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-purple-500 scale-125' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === slides.length - 1}
          className={`p-2 ${currentIndex === slides.length - 1 ? 'text-gray-700' : 'text-gray-400 hover:text-white'}`}
        >
          <ChevronRight />
        </button>
      </div>

      <p className="text-center text-gray-600 text-xs mt-2">Tap left/right or use arrow keys</p>
    </div>
  );
}
