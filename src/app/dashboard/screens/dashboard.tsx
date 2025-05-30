'use client';
'use client';

import React from 'react';
import PasteQuickTextButton from './PasteQuickTextButton';
import { useUserStore } from '@/store/user-store';
import { useDocumentStore } from '@/store/document-store';
import { Document as PrismaDocument } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FiHelpCircle } from 'react-icons/fi';
import { MdOutlineUploadFile } from 'react-icons/md';

export function DashboardScreen() {
  const user = useUserStore(state => state.user);
  const { documents } = useDocumentStore();

  const getLastName = (name?: string | null) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  // TODO: Replace with real stats from backend/store
  const stats = [
    {
      title: 'Knowledge Base Growth',
      value: '124',
      change: '+14 expansion this month',
      tooltip:
        'Total documents, projects, and notes added to your knowledge base. Every addition grows your research library.',
    },
    {
      title: 'Recent Uploads',
      value: '6',
      change: 'Past 7 days',
      tooltip: 'Documents, articles, or videos uploaded in the last week.',
    },
    {
      title: 'AI Value Generated',
      value: '18',
      change: 'Insights this month',
      tooltip: 'AI-generated insights, summaries, and analyses delivered to you this month.',
    },
    {
      title: 'Analysis Credits',
      value: '12',
      change: 'of 30 used',
      tooltip:
        'Analysis credits represent the number of AI-powered analyses you can run each month. Credits reset monthly and are only used for major analyses.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero / Snapshot Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-background rounded-xl p-6 border shadow-sm transition-shadow hover:shadow-md focus:shadow-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {user?.name ? <>Welcome back, Dr. {getLastName(user.name)}!</> : <>Welcome back!</>}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            size="lg"
            className="text-base font-semibold px-8 py-3 transition-shadow hover:shadow-md focus:shadow-md"
          >
            Start New Research
          </Button>
        </div>
      </div>

      {/* Stats Cards: Knowledge Base Growth & Usage Transparency */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-sm transition-transform hover:scale-[1.02] focus:scale-[1.02]"
          >
            <div className="p-6">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium leading-none">{stat.title}</h3>
                {stat.tooltip && (
                  <span
                    className="ml-1 cursor-pointer"
                    tabIndex={0}
                    aria-label="Help"
                    title={stat.tooltip}
                  >
                    <FiHelpCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              {/* Subtle badge for analysis credits */}
              {stat.title === 'Analysis Credits' && (
                <span className="inline-block ml-1 align-middle">
                  <span
                    className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    title={stat.tooltip}
                    aria-label="Analysis Credits Usage"
                  >
                    {stat.value} credits left
                  </span>
                </span>
              )}
              <p className="text-xs text-muted-foreground">{stat.change}</p>

              {/* Progress bar for knowledge base growth (first card only) */}
              {index === 0 && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: '78%' }}
                      aria-valuenow={78}
                      aria-valuemax={100}
                      aria-label="Knowledge base growth this month"
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>160 (goal)</span>
                  </div>
                  <div className="text-xs text-green-700 mt-2">
                    Keep growing your research library!
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md focus:shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold flex items-center justify-between">
              Recent Activity
              <a href="/documents" className="text-xs font-medium text-primary hover:underline">
                View All
              </a>
            </h2>
            <div className="mt-4 space-y-4">
              {documents && documents.length > 0 ? (
                documents.slice(0, 5).map((doc: PrismaDocument) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-2 transition-shadow hover:shadow-md focus:shadow-md"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <span className="text-sm font-medium truncate" title={doc.title}>
                          {doc.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-none truncate" title={doc.title}>
                          {doc.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {/* Status badge */}
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                            Uploaded
                          </span>
                          {/* Last updated */}
                          <span className="text-xs text-muted-foreground">
                            {doc.updatedAt
                              ? new Date(doc.updatedAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline">
                        Resume
                      </Button>
                      <Button size="sm" variant="ghost">
                        Insights
                      </Button>
                      <Button size="sm" variant="ghost">
                        Q&amp;A
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <MdOutlineUploadFile className="mx-auto mb-2 text-muted-foreground" size={32} />
                  <p className="text-sm">
                    No recent documents. Upload your first document to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 space-y-3 flex flex-col">
              <Button asChild className="w-full flex items-center justify-between" size="lg">
                <a href="/upload">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    Upload New Document
                  </span>
                </a>
              </Button>
              <Button
                asChild
                className="w-full flex items-center justify-between"
                size="lg"
                variant="secondary"
              >
                <a href="/projects">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Create New Project
                  </span>
                </a>
              </Button>
              <Button
                asChild
                className="w-full flex items-center justify-between"
                size="lg"
                variant="outline"
              >
                <a href="/analysis">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Generate Report
                  </span>
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Use these quick actions to jumpstart your workflow.
            </p>
          </div>
        </div>

        {/* Initiate New Research (Core Actions) */}
        <div className="col-span-7 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Initiate New Research</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                asChild
                className="w-full flex items-center justify-start gap-3 py-6 text-base"
                variant="outline"
              >
                <a href="/upload">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  Upload New Paper (PDF)
                </a>
              </Button>
              <Button
                asChild
                className="w-full flex items-center justify-start gap-3 py-6 text-base"
                variant="outline"
              >
                <a href="/analyze-url">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 2v2m8-2v2M2 8h2m16 0h2M2 16h2m16 0h2M8 22v-2m8 2v-2" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Analyze Web Article (URL)
                </a>
              </Button>
              <Button
                asChild
                className="w-full flex items-center justify-start gap-3 py-6 text-base"
                variant="outline"
              >
                <a href="/transcribe-video">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="2" y="7" width="20" height="15" rx="2" />
                    <polygon points="10 11 16 14 10 17 10 11" />
                  </svg>
                  Transcribe Video Lecture
                </a>
              </Button>
              <Button
                asChild
                className="w-full flex items-center justify-start gap-3 py-6 text-base"
                variant="outline"
              >
                <a href="/projects/new">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Start New Synthesis Project
                </a>
              </Button>
              {/* Paste Quick Text with Dialog and Toast */}
              <PasteQuickTextButton />
            </div>
          </div>
        </div>

        {/* Latest Discoveries & AI Insights */}
        <div className="col-span-7 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="M13 2v8h8" />
                <path d="M3 12a9 9 0 1 0 9-9" />
              </svg>
              Latest Discoveries & AI Insights
            </h2>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  summary:
                    'AI extracted a new hypothesis about memory formation from "Neuroscience Research".',
                  context: 'Project: Neuroscience Research',
                  date: '2025-05-30',
                  action: { label: 'View Insight', href: '/insights/1' },
                },
                {
                  id: 2,
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-600"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6v6H9z" />
                    </svg>
                  ),
                  summary:
                    'Summary generated for "Quantum Computing Survey". Key finding: Shor’s algorithm advances.',
                  context: 'Document: Quantum Computing Survey.pdf',
                  date: '2025-05-29',
                  action: { label: 'Go to Document', href: '/documents/2' },
                },
                {
                  id: 3,
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                  ),
                  summary:
                    'Transcription complete for "AI in Healthcare" video. 92% accuracy achieved.',
                  context: 'Video: AI in Healthcare Lecture',
                  date: '2025-05-28',
                  action: { label: 'View Transcript', href: '/transcripts/3' },
                },
              ].map(insight => (
                <Card
                  key={insight.id}
                  className="shadow-sm transition-transform hover:scale-[1.02] focus:scale-[1.02]"
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">{insight.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-card-foreground">
                        {insight.summary}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{insight.context}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {insight.date}
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <a href={insight.action.href}>{insight.action.label}</a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {/* Empty state for AI Insights */}
              {false && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2 text-muted-foreground"
                  >
                    <circle cx="16" cy="16" r="12" />
                    <path d="M12 16h8M16 12v8" />
                  </svg>
                  <p className="text-sm">
                    No AI insights yet. As you analyze documents, discoveries will appear here!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
