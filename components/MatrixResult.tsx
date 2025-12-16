// components/MatrixResult.tsx
'use client';

import { useMemo } from 'react';
import type { Archetype, PercentileStats } from '@/lib/types';

interface MatrixResultProps {
  archetype: Archetype;
  percentiles: PercentileStats;
  userName: string;
}

// Generate fake dots for each quadrant
function generateFakeDots(count: number, quadrant: string): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];

  const ranges: Record<string, { xMin: number; xMax: number; yMin: number; yMax: number }> = {
    'top-left': { xMin: 8, xMax: 42, yMin: 8, yMax: 42 },
    'top-right': { xMin: 58, xMax: 92, yMin: 8, yMax: 42 },
    'bottom-left': { xMin: 8, xMax: 42, yMin: 58, yMax: 92 },
    'bottom-right': { xMin: 58, xMax: 92, yMin: 58, yMax: 92 },
  };

  const range = ranges[quadrant];
  if (!range) return dots;

  for (let i = 0; i < count; i++) {
    dots.push({
      x: range.xMin + Math.random() * (range.xMax - range.xMin),
      y: range.yMin + Math.random() * (range.yMax - range.yMin),
    });
  }

  return dots;
}

export function MatrixResult({ archetype, percentiles, userName }: MatrixResultProps) {
  // Generate fake population dots (memoized to prevent regeneration)
  const fakeDots = useMemo(() => ([
    ...generateFakeDots(18, 'top-left'),
    ...generateFakeDots(22, 'top-right'),
    ...generateFakeDots(25, 'bottom-left'),
    ...generateFakeDots(20, 'bottom-right'),
  ]), []);

  // User's position based on percentiles
  const userPosition = useMemo(() => {
    const x = percentiles.isActive ? 58 + (percentiles.engagement / 100) * 34 : 8 + (percentiles.engagement / 100) * 34;
    const y = percentiles.isLoud ? 8 + (100 - percentiles.posting) / 100 * 34 : 58 + (100 - percentiles.posting) / 100 * 34;
    return { x, y };
  }, [percentiles]);

  return (
    <div className="w-full max-w-md mx-auto roast-card p-6">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Your LinkedIn Personality</p>
        <h2 className="text-2xl font-bold stat-text">{archetype.name}</h2>
      </div>

      {/* Matrix */}
      <div className="relative mb-4">
        {/* Axis labels */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">LOUD</div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">QUIET</div>
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 -rotate-90 text-xs text-gray-500">PASSIVE</div>
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 rotate-90 text-xs text-gray-500">ACTIVE</div>

        {/* Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
          {[
            { q: 'top-left', label: 'Broadcaster' },
            { q: 'top-right', label: 'Operator' },
            { q: 'bottom-left', label: 'Lurker' },
            { q: 'bottom-right', label: 'Whisperer' },
          ].map(({ q, label }) => (
            <div
              key={q}
              className="flex items-center justify-center p-2"
              style={{ backgroundColor: archetype.quadrant === q ? 'rgba(139, 92, 246, 0.2)' : '#1F2937' }}
            >
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}

          {/* Fake population dots - positioned absolutely over the grid */}
          {fakeDots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full opacity-30"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            />
          ))}

          {/* User's dot */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg icon-box"
            style={{
              left: `${userPosition.x}%`,
              top: `${userPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      {/* Tagline */}
      <p className="text-center text-gray-400 text-sm italic mb-4">&quot;{archetype.tagline}&quot;</p>

      {/* Stats bars */}
      <div className="space-y-2 mb-4">
        {[
          { label: 'Posting', value: percentiles.posting },
          { label: 'Engagement', value: percentiles.engagement },
          { label: 'Coffee Lies', value: percentiles.coffeeLies },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-20">{label}</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full icon-box"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-14 text-right">{value}th %ile</span>
          </div>
        ))}
      </div>

      {/* Roast */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{archetype.roast}</p>

      {/* Disclaimer */}
      <div className="text-center mt-auto">
        <p className="text-xs text-gray-600">Are these percentiles made up? Yes. Directionally correct? Also yes.</p>
        <p className="text-sm mt-2 font-medium text-purple-400">#LinkedInRoasted</p>
      </div>
    </div>
  );
}
