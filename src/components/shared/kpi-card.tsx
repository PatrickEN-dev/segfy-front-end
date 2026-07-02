import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  loading?: boolean;
}

export function KpiCard({ label, value, hint, loading }: KpiCardProps) {
  return (
    <div className="flex flex-col gap-1.5 border-l pl-4">
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-7 w-20" />
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
