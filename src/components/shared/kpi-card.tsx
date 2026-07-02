import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  accent?: "primary" | "accent" | "success" | "warning";
  className?: string;
}

const accentClasses: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function KpiCard({
  label,
  value,
  hint,
  icon,
  loading,
  accent = "primary",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:shadow-elevated",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5",
            accentClasses[accent],
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="font-display text-3xl font-semibold tabular-nums leading-none text-foreground">
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