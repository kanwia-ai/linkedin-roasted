'use client';

import { motion } from 'framer-motion';

interface HeadlineResultProps {
  headline: string;
  userName: string;
}

export function HeadlineResult({ headline, userName }: HeadlineResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto p-8"
    >
      <div className="bg-white rounded-xl p-6 text-black">
        {/* Fake LinkedIn header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{userName}</h3>
            <p className="text-gray-600 text-sm leading-tight mt-1">
              {headline.split(' | ').slice(1).join(' | ')}
            </p>
          </div>
        </div>

        {/* Fake LinkedIn stats */}
        <div className="flex gap-4 text-xs text-gray-500 border-t pt-4">
          <span>500+ connections</span>
          <span>•</span>
          <span>Roasted by LinkedIn Roasted</span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-4">
        Your new LinkedIn headline (please don&apos;t actually use this)
      </p>
    </motion.div>
  );
}
