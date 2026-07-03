import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderSkeletonProps {
  withBreadcrumbs?: boolean;
  withAction?: boolean;
}

export function PageHeaderSkeleton({
  withBreadcrumbs,
  withAction,
}: PageHeaderSkeletonProps) {
  return (
    <div className="flex flex-col gap-4 pb-2 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {withBreadcrumbs && <Skeleton className="h-4 w-44" />}
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {withAction && <Skeleton className="h-10 w-32 md:mb-1" />}
    </div>
  );
}

interface TableCardSkeletonProps {
  rows?: number;
  withToolbar?: boolean;
}

export function TableCardSkeleton({
  rows = 6,
  withToolbar,
}: TableCardSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {withToolbar && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Skeleton className="h-9 w-full max-w-xs" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      )}
      <div className="space-y-2 p-6">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function FormCardSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
