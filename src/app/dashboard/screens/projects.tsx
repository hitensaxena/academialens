'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ProjectsScreen() {
  // Placeholder for future dynamic projects data
  // In the future, replace this with a Zustand store or API fetch
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    status: 'active' | 'archived' | 'draft';
    documentCount: number;
    updatedAt: string;
  }> = [
    {
      id: '1',
      title: 'Neuroscience Research',
      description: 'Exploring neural correlates of memory in rodents.',
      status: 'active',
      documentCount: 3,
      updatedAt: '2025-05-29T10:00:00Z',
    },
    {
      id: '2',
      title: 'Quantum Computing Survey',
      description: 'A literature review on quantum algorithms.',
      status: 'draft',
      documentCount: 5,
      updatedAt: '2025-05-27T08:30:00Z',
    },
    {
      id: '3',
      title: 'AI in Healthcare',
      description: 'Assessing the impact of AI on diagnostic accuracy.',
      status: 'archived',
      documentCount: 2,
      updatedAt: '2025-05-20T15:15:00Z',
    },
  ];

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
        {projects.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            <span>No projects yet. Start your first research project!</span>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="rounded-lg border bg-card p-6 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate" title={project.title}>
                  {project.title}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${project.status === 'active' ? 'bg-green-100 text-green-800' : project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <p
                className="mt-2 text-sm text-muted-foreground line-clamp-2"
                title={project.description}
              >
                {project.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.documentCount} documents</span>
                <span>
                  Updated{' '}
                  {new Date(project.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  Edit
                </Button>
                <Button size="sm" variant="ghost">
                  Insights
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
