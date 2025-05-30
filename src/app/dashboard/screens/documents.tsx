'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function DocumentsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage your uploaded documents and files.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Uploaded
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Size
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">Document_{i}.pdf</td>
                      <td className="p-4 align-middle">PDF</td>
                      <td className="p-4 align-middle">2 days ago</td>
                      <td className="p-4 align-middle">2.4 MB</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
