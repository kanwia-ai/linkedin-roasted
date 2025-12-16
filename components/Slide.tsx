// components/Slide.tsx
'use client';

import { motion } from 'framer-motion';
import type { SlideData } from '@/lib/types';
import { getRoast } from '@/data/roastTemplates';

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
}

export function Slide({ slide, isActive }: SlideProps) {
  const content = getRoast(slide.type, slide.flavor, slide.data);
  const lines = content.split('\n').filter(line => line.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 50 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex items-center justify-center p-8"
    >
      <div className="max-w-lg text-center space-y-6">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`
              ${i === 0 ? 'text-2xl md:text-3xl font-bold' : 'text-lg md:text-xl text-gray-300'}
              ${i === lines.length - 1 ? 'text-[#8B5CF6]' : ''}
            `}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
