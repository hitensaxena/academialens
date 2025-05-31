'use client';

import { useState } from 'react';
import { FileText, Upload, Search, FileUp, FileTextIcon, FileType2, FileClock } from 'lucide-react';
import Link from 'next/link';

// Mock data for documents
const documents = [
  {
    id: 1,
    name: 'Research_Paper.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploaded: '2 hours ago',
    status: 'Processed',
  },
  {
    id: 2,
    name: 'Meeting_Notes.docx',
    type: 'Word',
    size: '1.1 MB',
    uploaded: '1 day ago',
    status: 'Processed',
  },
  {
    id: 3,
    name: 'Project_Proposal.pdf',
    type: 'PDF',
    size: '3.2 MB',
    uploaded: '3 days ago',
    status: 'Processing',
  },
  {
    id: 4,
    name: 'References.txt',
    type: 'Text',
    size: '0.5 MB',
    uploaded: '1 week ago',
    status: 'Processed',
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(
    doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-red-500" />;
      case 'word':
        return <FileType2 className="h-5 w-5 text-blue-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    switch (status.toLowerCase()) {
      case 'processed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'processing':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FileClock className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
      case 'failed':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">View and manage your uploaded documents.</p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="overflow-hidden">
            <div className="min-w-full">
              <div className="bg-muted/50 border-b">
                <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-6 md:col-span-5">Name</div>
                  <div className="col-span-3 md:col-span-2 text-center">Type</div>
                  <div className="hidden md:block md:col-span-2 text-center">Size</div>
                  <div className="hidden md:block md:col-span-2 text-center">Uploaded</div>
                  <div className="col-span-3 md:col-span-1 text-right">Status</div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="hover:bg-muted/50 transition-colors">
                    <div className="grid grid-cols-12 px-6 py-4 items-center">
                      <div className="col-span-6 md:col-span-5 flex items-center">
                        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground truncate max-w-[200px] md:max-w-xs">
                            {doc.name}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-sm text-muted-foreground text-center">
                        {doc.type}
                      </div>
                      <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground text-center">
                        {doc.size}
                      </div>
                      <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground text-center">
                        {doc.uploaded}
                      </div>
                      <div className="col-span-3 md:col-span-1 flex justify-end">
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No documents found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term.'
                : 'Get started by uploading a new document.'}
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Upload Document
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
