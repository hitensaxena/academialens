'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaSpinner,
  FaFileImage,
  FaFileExcel,
  FaFilePowerpoint,
  FaFile,
  FaTrash,
  FaDownload,
} from 'react-icons/fa';

type Document = {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  status?: 'processing' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
};

interface DocumentsTableProps {
  documents: Document[];
  onDocumentDeleted?: (id: string) => void;
  onDocumentDownload?: (id: string, fileName: string) => void;
}

export function DocumentsTable({
  documents,
  onDocumentDeleted,
  onDocumentDownload,
}: DocumentsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document'))
      return <FaFileWord className="text-blue-600" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet'))
      return <FaFileExcel className="text-green-600" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation'))
      return <FaFilePowerpoint className="text-orange-500" />;
    if (fileType.includes('image')) return <FaFileImage className="text-purple-500" />;
    if (fileType.includes('text')) return <FaFileAlt className="text-gray-500" />;
    return <FaFile className="text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      onDocumentDeleted?.(id);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id: string, fileName: string) => {
    setDownloadingId(id);
    try {
      // If there's a custom download handler, use it
      if (onDocumentDownload) {
        await onDocumentDownload(id, fileName);
        return;
      }

      // Otherwise, use the default download behavior
      const response = await fetch(`/api/documents/${id}/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No documents found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Size
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Uploaded
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map(doc => (
            <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{doc.fileType}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {doc.fileType.split('/').pop()?.toUpperCase() || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(doc.fileSize)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(doc.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doc.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : doc.status === 'processing'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {doc.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => handleDownload(doc.id, doc.title)}
                    disabled={downloadingId === doc.id}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                    title="Download"
                  >
                    {downloadingId === doc.id ? (
                      <FaSpinner className="animate-spin h-4 w-4" />
                    ) : (
                      <FaDownload className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === doc.id ? (
                      <FaSpinner className="animate-spin h-4 w-4" />
                    ) : (
                      <FaTrash className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
