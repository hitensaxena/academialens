'use client';

import { useState, useEffect } from 'react';
import { DocumentsTable } from './documents-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Document = {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
};

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocumentDeleted = (id: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const handleDocumentDownload = async (id: string, fileName: string) => {
    try {
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

      return true;
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchDocuments}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <DocumentsTable
        documents={documents}
        onDocumentDeleted={handleDocumentDeleted}
        onDocumentDownload={handleDocumentDownload}
      />
    </div>
  );
}
