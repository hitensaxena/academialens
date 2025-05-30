'use client';
'use client';

import React from 'react';

export function DashboardScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your research today.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        {[
          { title: 'Total Documents', value: '12', change: '+2 from last month' },
          { title: 'Active Projects', value: '3', change: '+1 from last month' },
          { title: 'Storage Used', value: '1.2 GB', change: '+10% from last month' },
          { title: 'Tasks Completed', value: '8/10', change: '+2 from last week' },
        ].map((stat, index) => (
          <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-sm font-medium leading-none">{stat.title}</h3>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">U{i}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Document {i} uploaded</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <span>Upload New Document</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <span>Create New Project</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <span>Generate Report</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
