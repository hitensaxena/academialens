'use client';

import { FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">View and manage your uploaded documents.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No documents yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload your first document to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
