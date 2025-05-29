'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFileAlt, FaSpinner } from 'react-icons/fa';

type Document = {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

interface DocumentsClientTableProps {
  documents: Document[];
}

export default function DocumentsClientTable({ documents }: DocumentsClientTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<Document[]>(documents);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`))
      return;
    setLoadingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const data: { success?: boolean; error?: string } = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete');
      setDocs(docs.filter(d => d.id !== id));
      setSuccess('Document deleted successfully.');
    } catch (e: unknown) {
      setError(String(e) || 'Error deleting');
    } finally {
      setLoadingId(null);
    }
  };

  function getFileIcon(type: string) {
    switch (type) {
      case 'PDF':
        return <FaFilePdf className="text-red-600 inline mr-1" title="PDF" />;
      case 'DOCX':
        return <FaFileWord className="text-blue-700 inline mr-1" title="DOCX" />;
      case 'TXT':
        return <FaFileAlt className="text-gray-500 inline mr-1" title="TXT" />;
      default:
        return <FaFileAlt className="text-gray-400 inline mr-1" title="File" />;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Uploaded Documents</h1>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full border rounded shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Size</th>
            <th className="p-2 text-left">Uploaded</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(doc => (
            <tr key={doc.id} className="border-t hover:bg-gray-50 transition">
              <td className="p-2 flex items-center">
                {getFileIcon(doc.fileType)} {doc.title}
              </td>
              <td className="p-2">{doc.fileType}</td>
              <td className="p-2">{Math.round(doc.fileSize / 1024)} KB</td>
              <td className="p-2">
                {new Date(doc.createdAt).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </td>
              <td className="p-2">
                <Link href={doc.fileUrl} target="_blank" className="text-blue-600 underline mr-2">
                  View
                </Link>
                <button
                  className="text-red-600 underline flex items-center"
                  disabled={loadingId === doc.id}
                  onClick={() => handleDelete(doc.id, doc.title)}
                >
                  {loadingId === doc.id ? <FaSpinner className="animate-spin mr-1" /> : null}
                  {loadingId === doc.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {docs.length === 0 && <div className="mt-6 text-gray-500">No documents uploaded yet.</div>}
    </div>
  );
}
