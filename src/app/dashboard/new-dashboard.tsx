'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Simple Card component
const Card = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className={`bg-gray-800 rounded-lg shadow p-6 ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </div>
);

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  change?: string;
};

const StatCard = ({ title, value, icon: Icon, trend, change }: StatCardProps) => {
  return (
    <Card className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          {change && (
            <div
              className={`mt-2 flex items-center text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            >
              {trend === 'up' ? (
                <ArrowUpRightIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowUpRightIcon className="h-4 w-4 mr-1 transform rotate-180" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gray-700">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </Card>
  );
};

type ProjectCardProps = {
  title: string;
  description: string;
  progress: number;
  lastUpdated: string;
  icon: React.ElementType;
  color: string;
};

const ProjectCard = ({
  title,
  description,
  progress,
  lastUpdated,
  icon: Icon,
  color,
  projectId,
}: ProjectCardProps & { projectId: string }) => {
  return (
    <Link
      href={`/dashboard/projects/${projectId}`}
      className="block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors duration-200"
    >
      <div className={`h-2 ${color}`}></div>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color} bg-opacity-20 mr-3`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${progress}%` }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Last updated {lastUpdated}</p>
        </div>
      </div>
    </Link>
  );
};

type ActivityItem = {
  id: number;
  type: 'upload' | 'analysis' | 'share' | 'create';
  title: string;
  time: string;
  user: string;
  userAvatar: string;
};

const ActivityItem = ({ type, title, time, user, userAvatar }: Omit<ActivityItem, 'id'>) => {
  const getIcon = () => {
    switch (type) {
      case 'upload':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'analysis':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'share':
        return <FolderIcon className="h-5 w-5 text-green-500" />;
      case 'create':
        return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
          {userAvatar ? (
            <Image
              className="h-10 w-10 rounded-full"
              src={userAvatar}
              alt={user}
              width={40}
              height={40}
              unoptimized
            />
          ) : (
            <span className="text-white font-medium">{user.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          <span className="text-blue-400">{user}</span>{' '}
          {type === 'upload' ? 'uploaded' : type === 'analysis' ? 'analyzed' : type} &quot;{title}
          &quot;
        </p>
        <div className="flex items-center mt-1">
          <div className="mr-2">{getIcon()}</div>
          <p className="text-xs text-gray-400">{time} ago</p>
        </div>
      </div>
    </div>
  );
};

const NewDashboard = () => {
  // const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [projects] = useState([
    {
      id: 'ai-research',
      title: 'AI Research Paper',
      description: 'Research on the impact of AI in scientific discovery',
      progress: 75,
      lastUpdated: '2 days ago',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      id: 'quantum-computing',
      title: 'Quantum Computing',
      description: 'Analysis of quantum algorithms and their applications',
      progress: 45,
      lastUpdated: '1 week ago',
      icon: FolderIcon,
      color: 'bg-purple-500',
    },
    {
      id: 'blockchain-study',
      title: 'Blockchain Study',
      description: 'Exploring blockchain technology and its implications',
      progress: 30,
      lastUpdated: '3 days ago',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch projects or other data here
    const timer = setTimeout(() => {
      setRecentActivity([
        {
          id: 1,
          type: 'upload',
          title: 'Research Paper on AI Ethics',
          time: '2 hours',
          user: 'Alex Johnson',
          userAvatar: '',
        },
        {
          id: 2,
          type: 'analysis',
          title: 'Quantum Computing Research',
          time: '5 hours',
          user: 'Sarah Williams',
          userAvatar: '',
        },
        {
          id: 3,
          type: 'share',
          title: 'Team Project Documents',
          time: '1 day',
          user: 'Michael Chen',
          userAvatar: '',
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value="1,248"
          icon={DocumentTextIcon}
          trend="up"
          change="12.5% from last month"
        />
        <StatCard
          title="Active Projects"
          value="24"
          icon={FolderIcon}
          trend="up"
          change="3 new this week"
        />
        <StatCard
          title="Pending Reviews"
          value="8"
          icon={ClockIcon}
          trend="down"
          change="2 resolved"
        />
        <StatCard
          title="Completed Tasks"
          value="156"
          icon={CheckCircleIcon}
          trend="up"
          change="24% from last month"
        />
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            progress={project.progress}
            lastUpdated={project.lastUpdated}
            icon={project.icon}
            color={project.color}
            projectId={project.id}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/projects/new"
              className="w-full flex items-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              <span>New Document</span>
            </Link>
            <Link
              href="/dashboard/projects/new"
              className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <FolderIcon className="h-5 w-5 mr-3" />
              <span>New Project</span>
            </Link>
            <button className="w-full flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
              <ChartBarIcon className="h-5 w-5 mr-3" />
              <span>Run Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
