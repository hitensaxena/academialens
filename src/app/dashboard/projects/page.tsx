'use client';

import { Folder } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">Manage your research projects and collaborations.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-sm text-muted-foreground">Create your first project to get started.</p>
        </div>
      </div>
    </div>
  );
}
