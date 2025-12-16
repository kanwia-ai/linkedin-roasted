'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoast } from '@/lib/generateRoast';

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState('');

  const processingMessages = [
    'Reading your connection requests...',
    'Counting your coffee lies...',
    'Measuring your ghost energy...',
    'Calculating your cringe index...',
    'This is worse than we expected...',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.name?.endsWith('.zip')) {
      setFile(f);
      setError(null);
    } else {
      setError('Please upload a ZIP file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.name?.endsWith('.zip')) {
      setFile(f);
      setError(null);
    } else if (f) {
      setError('Please upload a ZIP file');
    }
  };

  const handleStartRoast = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    // Rotate through processing messages
    let msgIdx = 0;
    setProcessingMessage(processingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % processingMessages.length;
      setProcessingMessage(processingMessages[msgIdx]);
    }, 1500);

    try {
      const result = await generateRoast(file);

      // Store result in sessionStorage
      sessionStorage.setItem('roastResult', JSON.stringify(result));

      clearInterval(interval);
      router.push('/roast');
    } catch (err) {
      clearInterval(interval);
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process your LinkedIn export. Make sure it\'s a valid ZIP file.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center icon-box animate-pulse mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-white">
            <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Processing...</h2>
        <p className="text-gray-400">{processingMessage}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Upload Your LinkedIn Export</h2>

      {/* Instructions */}
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-4 text-white">How to get your data:</h3>
        <ol className="space-y-2 text-gray-400 text-sm">
          <li>1. LinkedIn → Settings → Data Privacy</li>
          <li>2. Click &quot;Get a copy of your data&quot;</li>
          <li>3. Select &quot;Download larger data archive&quot; for full roast</li>
          <li>4. Wait for email (10 min - 72 hours)</li>
          <li>5. Upload the ZIP here</li>
        </ol>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-md p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center
          ${isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : file
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className={`mx-auto mb-4 ${file ? 'text-green-500' : 'text-gray-500'}`}>
          <UploadIcon />
        </div>
        {file ? (
          <p className="text-lg font-medium text-green-500">{file.name}</p>
        ) : (
          <p className="text-lg text-gray-400">Drop your LinkedIn ZIP here</p>
        )}
      </div>

      {/* Start button */}
      {file && (
        <button
          onClick={handleStartRoast}
          className="mt-6 px-8 py-4 rounded-full text-white font-semibold text-lg gradient-btn"
        >
          Start the Roast 🔥
        </button>
      )}
    </main>
  );
}
