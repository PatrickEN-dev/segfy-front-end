import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  icon,
  loading,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-md border border-border bg-card p-5",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary-soft))] text-primary [&>svg]:h-5 [&>svg]:w-5"
        >
          {icon}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="truncate text-2xl font-semibold leading-none text-foreground">
            {value}
          </span>
        )}
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
