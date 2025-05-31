'use client';

import Link from 'next/link';
import { FileText, Upload, Plus, Search, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Project = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  status: 'in-progress' | 'completed' | 'draft';
  members: number;
};

export default function HomePage() {
  const projects: Project[] = [
    {
      id: '1',
      title: 'Research Paper on AI Ethics',
      description:
        'A comprehensive analysis of ethical considerations in AI development and deployment.',
      lastUpdated: '2 hours ago',
      status: 'in-progress',
      members: 3,
    },
    {
      id: '2',
      title: 'Machine Learning Project',
      description: 'Implementation of various ML algorithms for predictive analysis.',
      lastUpdated: '1 day ago',
      status: 'completed',
      members: 5,
    },
    {
      id: '3',
      title: 'Blockchain Research',
      description: 'Exploring decentralized applications and smart contracts.',
      lastUpdated: '3 days ago',
      status: 'draft',
      members: 2,
    },
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>
                      {project.members} {project.members === 1 ? 'member' : 'members'}
                    </span>
                    <span>Updated {project.lastUpdated}</span>
                  </div>
                </div>
                <div className="border-t px-4 py-3 bg-muted/20">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm font-medium text-primary flex items-center justify-end gap-1"
                  >
                    View project <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
