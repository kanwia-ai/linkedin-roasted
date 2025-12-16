'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RoastResult } from '@/lib/types';
import { SlideRenderer } from '@/components/SlideRenderer';
import { MatrixResult } from '@/components/MatrixResult';
import { HeadlineResult } from '@/components/HeadlineResult';
import ShareButton from '@/components/ShareButton';

type Phase = 'slides' | 'matrix' | 'headline';

export default function RoastPage() {
  const router = useRouter();
  const [roastData, setRoastData] = useState<RoastResult | null>(null);
  const [phase, setPhase] = useState<Phase>('slides');
  const matrixRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('roastResult');
    if (!stored) {
      router.push('/upload');
      return;
    }

    try {
      const data = JSON.parse(stored) as RoastResult;
      setRoastData(data);
    } catch (e) {
      console.error('Failed to parse roast data:', e);
      router.push('/upload');
    }
  }, [router]);

  const handleSlidesComplete = () => {
    setPhase('matrix');
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('roastResult');
    router.push('/upload');
  };

  if (!roastData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading your roast...</div>
      </div>
    );
  }

  if (phase === 'slides') {
    return (
      <SlideRenderer
        slides={roastData.slides}
        onComplete={handleSlidesComplete}
      />
    );
  }

  if (phase === 'matrix') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div ref={matrixRef} className="mb-8">
          <MatrixResult
            archetype={roastData.archetype}
            percentiles={roastData.percentiles}
            userName={roastData.userName}
          />
        </div>

        <ShareButton
          targetRef={matrixRef}
          filename="linkedin-roasted-matrix.png"
        />

        <button
          onClick={() => setPhase('headline')}
          className="mt-8 px-8 py-4 rounded-full text-white font-semibold text-lg gradient-btn"
        >
          See Your Headline →
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Your True LinkedIn Headline</h2>
        <p className="text-gray-400">What your profile should actually say</p>
      </div>

      <div ref={headlineRef} className="mb-8">
        <HeadlineResult
          headline={roastData.headline}
          userName={roastData.userName || 'LinkedIn User'}
        />
      </div>

      <ShareButton
        targetRef={headlineRef}
        filename="linkedin-roasted-headline.png"
      />

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setPhase('matrix')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-medium transition-colors"
        >
          ← Back to Matrix
        </button>
        <button
          onClick={handleStartOver}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors"
        >
          Roast Someone Else
        </button>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Made with questionable life choices at</p>
        <p className="font-bold text-purple-400">linkedinroasted.com</p>
      </div>
    </main>
  );
}
