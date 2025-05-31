'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  FileText,
  FileSpreadsheet,
  FileImage,
  Folder,
  HardDrive,
  MoreVertical,
  Search,
  Upload,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Types
type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'processing' | 'completed' | 'error' | 'synced';
  url?: string;
  version?: number;
  folder?: string;
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
};

type ProjectActivity = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  document?: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  progress: number;
  storage: {
    used: number;
    total: number;
  };
  documentsCount: number;
  teamMembers?: TeamMember[];
  documents?: Document[];
  recentActivity?: ProjectActivity[];
};

// Helper function to format dates
const formatDate = (dateString: string, formatStr = 'MMM d, yyyy') => {
  return format(new Date(dateString), formatStr);
};

// Helper function to get file icon based on type
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'ppt':
    case 'pptx':
      return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'gif':
      return <FileImage className="h-5 w-5 text-purple-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileText className="h-5 w-5 text-yellow-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

// Mock data
const mockProject: Project = {
  id: '1',
  title: 'Acme Website Redesign',
  description:
    'Complete redesign of the Acme Corp website with modern UI/UX and improved performance.',
  status: 'active',
  createdAt: '2023-06-15T10:30:00Z',
  updatedAt: '2023-06-28T09:15:00Z',
  dueDate: '2023-12-31T23:59:59Z',
  progress: 65,
  storage: {
    used: 1250,
    total: 5000,
  },
  documentsCount: 24,
  teamMembers: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: '/avatars/01.png',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      avatar: '/avatars/02.png',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'member',
      avatar: '/avatars/03.png',
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Project Brief.pdf',
      type: 'pdf',
      size: '2.5',
      uploadedAt: '2023-06-15T10:30:00Z',
      uploadedBy: 'John Doe',
      status: 'synced',
      url: '/documents/1',
      version: 2,
    },
    {
      id: '2',
      name: 'Design Mockups.sketch',
      type: 'sketch',
      size: '8.7',
      uploadedAt: '2023-06-18T14:20:00Z',
      uploadedBy: 'Jane Smith',
      status: 'synced',
      url: '/documents/2',
      folder: 'Design',
    },
  ],
  recentActivity: [
    {
      id: '1',
      action: 'uploaded',
      user: 'Jane Smith',
      timestamp: '2023-06-28T09:15:00Z',
      document: 'Design Mockups.sketch',
    },
    {
      id: '2',
      action: 'updated',
      user: 'John Doe',
      timestamp: '2023-06-25T11:30:00Z',
      document: 'Project Brief.pdf',
    },
  ],
};

const ProjectPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [project, setProject] = useState<Project>(mockProject);

  // Stats calculations
  const storagePercentage = Math.round((project.storage.used / project.storage.total) * 100);
  const storageText = `${project.storage.used.toFixed(1)} MB of ${project.storage.total} MB used`;

  // ... (rest of the code remains the same)
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.name.split('.').pop() || 'file',
        size: (file.size / (1024 * 1024)).toFixed(1),
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'You',
        status: 'synced',
        version: 1,
      };

      setProject(prev => ({
        ...prev,
        documents: [newDoc, ...(prev.documents || [])],
        documentsCount: (prev.documents?.length || 0) + 1,
        storage: {
          ...prev.storage,
          used: prev.storage.used + file.size / (1024 * 1024),
        },
      }));

      setIsUploading(false);
      toast({
        title: 'File uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });

      event.target.value = '';
    }, 1000);
  };

  // Filter documents by search query and group by folder
  const getDocumentsByFolder = () => {
    const filtered =
      project.documents?.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || [];

    return filtered.reduce<Record<string, Document[]>>((acc, doc) => {
      const folder = doc.folder || 'Uncategorized';
      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(doc);
      return acc;
    }, {});
  };

  const documentsByFolder = getDocumentsByFolder();

  // Handle document click
  const handleDocumentClick = (docId: string) => {
    router.push(`/dashboard/documents/${docId}`);
  };

  // Overview tab content
  const overviewContent = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.documentsCount}</div>
            <p className="text-xs text-muted-foreground">
              {project.documents?.length || 0} in this project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.teamMembers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {project.teamMembers?.length === 1 ? 'Member' : 'Members'} in project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <p className="text-xs text-muted-foreground">
              {project.dueDate
                ? `Due ${format(new Date(project.dueDate), 'MMM d, yyyy')}`
                : 'No due date'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storagePercentage}%</div>
            <p className="text-xs text-muted-foreground">{storageText}</p>
            <Progress value={storagePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.recentActivity?.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {activity.user
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.user} <span className="text-muted-foreground">{activity.action}</span>{' '}
                    {activity.document}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.teamMembers?.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {overviewContent}
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Folder className="h-4 w-4" />
                  New Folder
                </Button>
                <Button size="sm" className="gap-2 relative">
                  <Upload className="h-4 w-4" />
                  Upload
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </Button>
              </div>
            </div>

            {Object.entries(documentsByFolder).map(([folder, docs]) => (
              <div key={folder} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">{folder}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    View all
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {docs.map(doc => (
                    <Card
                      key={doc.id}
                      className="group cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleDocumentClick(doc.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-md bg-secondary/50">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} MB • {formatDate(doc.uploadedAt, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage who has access to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers?.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback>
                            {member.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground capitalize">
                        {member.role}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.recentActivity?.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {activity.user
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {activity.user}{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        {activity.document && (
                          <span className="font-medium">{activity.document}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
