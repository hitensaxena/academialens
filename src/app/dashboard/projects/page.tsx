'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, FileText, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui';

type Project = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
};

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects from the database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/projects');
        // const data = await response.json();
        // setProjects(data);

        // Mock data for now
        setTimeout(() => {
          setProjects([
            {
              id: '1',
              title: 'AI Research Paper',
              description: 'Research on the latest AI advancements',
              status: 'active',
              createdAt: '2023-06-15T10:30:00Z',
              updatedAt: '2023-06-20T14:45:00Z',
              documentsCount: 12,
            },
            {
              id: '2',
              title: 'Machine Learning Thesis',
              description: 'Thesis on deep learning applications',
              status: 'active',
              createdAt: '2023-05-10T09:15:00Z',
              updatedAt: '2023-06-18T11:20:00Z',
              documentsCount: 8,
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
            <p className="text-muted-foreground">
              Manage your research projects and collaborations
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/projects/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>
                    {project.documentsCount}{' '}
                    {project.documentsCount === 1 ? 'document' : 'documents'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                Updated {formatDate(project.updatedAt)}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="pt-12 pb-16">
            <div className="mx-auto flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Folder className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">No projects found</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                {searchQuery
                  ? 'No projects match your search. Try a different query.'
                  : 'Get started by creating a new project.'}
              </p>
              <Button onClick={() => router.push('/dashboard/projects/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
