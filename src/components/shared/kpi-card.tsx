import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  loading,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-card p-5",
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <span className="text-2xl font-semibold tabular-nums leading-none text-foreground">
          {value}
        </span>
      )}
      {hint && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}
