import Link from 'next/link';

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-white">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-lg text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center icon-box">
            <FlameIcon />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">LinkedIn</span>
          <br />
          <span className="text-white">Roasted</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl text-gray-400 mb-8">
          LinkedIn Wrapped, but it&apos;s mean.
        </p>

        {/* Description */}
        <p className="text-gray-500 mb-12 max-w-md mx-auto">
          Upload your LinkedIn data export. We&apos;ll tell you things about yourself you didn&apos;t want to know.
        </p>

        {/* CTA Button */}
        <Link
          href="/upload"
          className="inline-block px-8 py-4 rounded-full text-white font-semibold text-lg gradient-btn"
        >
          Get Roasted
        </Link>

        {/* Privacy note */}
        <p className="text-gray-600 text-sm mt-8">
          100% client-side. Your data never leaves your browser.
        </p>
      </div>
    </main>
  );
}
