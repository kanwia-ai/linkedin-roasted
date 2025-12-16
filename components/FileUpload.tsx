'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    if (acceptedFiles.length === 0) {
      setError('Please upload a ZIP file');
      return;
    }

    const file = acceptedFiles[0];

    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file from LinkedIn');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-xl">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-gray-700 hover:border-gray-500'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isProcessing ? (
          <p className="text-gray-400">Processing your data...</p>
        ) : isDragActive ? (
          <p className="text-[#8B5CF6]">Drop your LinkedIn export here...</p>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📦</div>
            <p className="text-gray-300">
              Drag & drop your LinkedIn ZIP file here
            </p>
            <p className="text-gray-500 text-sm">
              or click to browse
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
