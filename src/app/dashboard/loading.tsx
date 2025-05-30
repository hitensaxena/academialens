import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Skeleton className="h-10 w-48" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-10 w-48" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}
