'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ProjectsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your research and academic projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project {i}</h3>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Active
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Brief description of the project and its objectives.
            </p>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>3 documents</span>
              <span>Updated 2 days ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
