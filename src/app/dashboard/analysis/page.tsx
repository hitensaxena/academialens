'use client';

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Analysis</h2>
        <p className="text-muted-foreground">View your analysis results and insights.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p>Analysis content will be displayed here.</p>
      </div>
    </div>
  );
}
