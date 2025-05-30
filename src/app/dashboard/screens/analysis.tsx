'use client';

export function AnalysisScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground">
          View and analyze your document insights and statistics.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Document Analytics</h2>
        <div className="mt-4 h-64 flex items-center justify-center bg-muted/50 rounded-md">
          <p className="text-muted-foreground">Analytics chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
