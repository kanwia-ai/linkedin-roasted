import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          LinkedIn<br />
          <span className="text-[#8B5CF6]">Roasted</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400">
          LinkedIn Wrapped, but it&apos;s mean.
          <br />
          <span className="text-gray-500">(Affectionately.)</span>
        </p>

        <div className="pt-4">
          <Link
            href="/upload"
            className="inline-block px-8 py-4 bg-[#8B5CF6] text-white rounded-lg font-semibold text-lg hover:bg-[#7C3AED] transition-colors"
          >
            Get Roasted
          </Link>
        </div>

        <p className="text-sm text-gray-600 pt-8">
          Your data never leaves your browser. Promise.
        </p>
      </div>
    </main>
  );
}
