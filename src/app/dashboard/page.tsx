'use client';

import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Upload as UploadIcon,
  Plus,
  Search,
  FileSearch,
  FileQuestion,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // Sample recent projects data
  const recentProjects = [
    {
      id: 1,
      title: 'Research Paper on AI Ethics',
      type: 'paper',
      lastUpdated: '2 hours ago',
      collaborators: 3,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Literature Review - Machine Learning',
      type: 'review',
      lastUpdated: '1 day ago',
      collaborators: 2,
      status: 'Draft',
    },
    {
      id: 3,
      title: 'Thesis Chapter 1 - Introduction',
      type: 'thesis',
      lastUpdated: '3 days ago',
      collaborators: 1,
      status: 'Completed',
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'paper':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <FileSearch className="h-5 w-5 text-green-500" />;
      case 'thesis':
        return <FileCode className="h-5 w-5 text-purple-500" />;
      default:
        return <FileQuestion className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your academic work today.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" className="gap-2">
              <UploadIcon className="h-4 w-4" />
              Upload Files
            </Button>
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search Documents
            </Button>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-primary hover:underline">
              View all projects
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map(project => (
              <div
                key={project.id}
                className="bg-card rounded-lg border p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">{getFileIcon(project.type)}</div>
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last updated {project.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(project.collaborators)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/documents/new"
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">New Document</h3>
                  <p className="text-sm text-muted-foreground">Start from scratch</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/upload"
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <UploadIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">Add PDFs, Word docs, and more</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/chat"
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Start Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about your documents
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Research Hub</h3>
                  <p className="text-sm text-muted-foreground">Find related papers</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
