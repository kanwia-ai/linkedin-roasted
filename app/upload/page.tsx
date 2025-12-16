'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingAnimation } from '@/components/ProcessingAnimation';
import { generateRoast } from '@/lib/generateRoast';
import type { RoastResult } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await generateRoast(file);

      // Store result in sessionStorage for the roast page
      sessionStorage.setItem('roastResult', JSON.stringify(result));

      // Navigate to roast page
      router.push('/roast');
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Something went wrong processing your file. Make sure it\'s a valid LinkedIn export.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {isProcessing ? (
        <ProcessingAnimation />
      ) : (
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Upload Your LinkedIn Export</h1>
            <p className="text-gray-400">
              Your data stays in your browser. We don&apos;t see it. We just judge it.
            </p>
          </div>

          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

          {error && (
            <p className="text-red-400 text-center">{error}</p>
          )}

          <div className="bg-gray-900 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">How to get your LinkedIn export:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>Go to LinkedIn → Settings → Data Privacy</li>
              <li>Click &quot;Get a copy of your data&quot;</li>
              <li>Select &quot;Download larger data archive&quot;</li>
              <li>Wait for the email (usually 24-72 hours)</li>
              <li>Download the ZIP and upload it here</li>
            </ol>
            <p className="text-sm text-gray-500">
              We only look at 2025 data. Your ancient history is safe.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
