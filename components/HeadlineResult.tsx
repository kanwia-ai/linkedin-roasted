'use client';

interface HeadlineResultProps {
  headline: string;
  userName: string;
}

export function HeadlineResult({ headline, userName }: HeadlineResultProps) {
  // Parse headline - format is "Name | Part 1 | Part 2"
  const parts = headline.split(' | ');
  const headlineText = parts.slice(1).join(' | ');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card mimicking LinkedIn profile */}
      <div className="bg-white rounded-xl overflow-hidden text-black">
        {/* Banner */}
        <div className="h-20 icon-box" />

        {/* Profile content */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-4xl">
              👤
            </div>
          </div>

          {/* Name and headline */}
          <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mt-1">
            {headlineText}
          </p>

          {/* Location and connections */}
          <div className="flex gap-2 text-xs text-gray-500 mt-3">
            <span>LinkedIn</span>
            <span>•</span>
            <span>500+ connections</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Your real LinkedIn headline (please don&apos;t actually use this)
      </p>

      <p className="text-center text-purple-400 text-sm mt-2 font-medium">
        #LinkedInRoasted
      </p>
    </div>
  );
}
