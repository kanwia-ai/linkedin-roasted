// components/MatrixResult.tsx
'use client';

import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Archetype, PercentileStats } from '@/lib/types';

interface MatrixResultProps {
  archetype: Archetype;
  percentiles: PercentileStats;
  userName: string;
}

// Generate fake dots for each quadrant
function generateFakeDots(count: number, quadrant: string): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];

  const ranges = {
    'top-left': { xMin: 5, xMax: 45, yMin: 5, yMax: 45 },
    'top-right': { xMin: 55, xMax: 95, yMin: 5, yMax: 45 },
    'bottom-left': { xMin: 5, xMax: 45, yMin: 55, yMax: 95 },
    'bottom-right': { xMin: 55, xMax: 95, yMin: 55, yMax: 95 },
  };

  const range = ranges[quadrant as keyof typeof ranges];

  for (let i = 0; i < count; i++) {
    dots.push({
      x: range.xMin + Math.random() * (range.xMax - range.xMin),
      y: range.yMin + Math.random() * (range.yMax - range.yMin),
    });
  }

  return dots;
}

export function MatrixResult({ archetype, percentiles, userName }: MatrixResultProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate fake population dots (memoized to prevent regeneration)
  const fakeDots = useMemo(() => ({
    'top-left': generateFakeDots(18, 'top-left'),
    'top-right': generateFakeDots(22, 'top-right'),
    'bottom-left': generateFakeDots(25, 'bottom-left'),
    'bottom-right': generateFakeDots(20, 'bottom-right'),
  }), []);

  // User's position based on percentiles
  const userPosition = useMemo(() => {
    const x = percentiles.isActive ? 55 + (percentiles.engagement / 100) * 40 : 5 + (percentiles.engagement / 100) * 40;
    const y = percentiles.isLoud ? 5 + (100 - percentiles.posting) / 100 * 40 : 55 + (100 - percentiles.posting) / 100 * 40;
    return { x, y };
  }, [percentiles]);

  const allDots = [
    ...fakeDots['top-left'],
    ...fakeDots['top-right'],
    ...fakeDots['bottom-left'],
    ...fakeDots['bottom-right'],
  ];

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Your LinkedIn Personality</h2>

      {/* Matrix */}
      <div className="relative aspect-square bg-gray-900 rounded-xl p-4">
        {/* Axis labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">LOUD</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">QUIET</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 -rotate-90">PASSIVE</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 rotate-90">ACTIVE</div>

        {/* Quadrant lines */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-700" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-700" />

        {/* Quadrant labels */}
        <div className="absolute top-6 left-6 text-xs text-gray-600">BROADCASTER</div>
        <div className="absolute top-6 right-6 text-xs text-gray-600">OPERATOR</div>
        <div className="absolute bottom-6 left-6 text-xs text-gray-600">LURKER</div>
        <div className="absolute bottom-6 right-6 text-xs text-gray-600">WHISPERER</div>

        {/* Fake population dots */}
        {allDots.map((dot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          />
        ))}

        {/* User's dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="absolute w-4 h-4 bg-[#8B5CF6] rounded-full border-2 border-white"
          style={{
            left: `${userPosition.x}%`,
            top: `${userPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Archetype */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-[#8B5CF6]">{archetype.name}</h3>
        <p className="text-gray-400 italic">&quot;{archetype.tagline}&quot;</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">POSTING</div>
          <div className="text-lg font-bold">{percentiles.posting}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">ENGAGEMENT</div>
          <div className="text-lg font-bold">{percentiles.engagement}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">COFFEE LIES</div>
          <div className="text-lg font-bold">{percentiles.coffeeLies}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">GHOST FACTOR</div>
          <div className="text-lg font-bold">{percentiles.ghostFactor}th percentile</div>
        </div>
      </div>

      {/* Roast paragraph */}
      <p className="text-gray-300 text-center leading-relaxed">
        {archetype.roast}
      </p>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center">
        Are these percentiles made up? Yes.<br />
        Are they directionally correct? Also yes.<br />
        #LinkedInRoasted
      </p>
    </div>
  );
}
