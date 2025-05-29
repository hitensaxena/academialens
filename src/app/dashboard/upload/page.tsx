'use client';
import React, { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  type DocumentUploadResult = {
    url: string;
    type: string;
    size: number;
  };
  const [result, setResult] = useState<DocumentUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setResult(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <div className="font-semibold">Upload Successful!</div>
          <div>
            URL:{' '}
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {result.url}
            </a>
          </div>
          <div>Type: {result.type}</div>
          <div>Size: {Math.round(result.size / 1024)} KB</div>
        </div>
      )}
      {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}
    </div>
  );
}
