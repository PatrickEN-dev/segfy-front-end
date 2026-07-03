"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/lib/use-count-up";
import { cn } from "@/lib/utils";

export type KpiTone = "primary" | "success" | "warning" | "neutral";

const toneStyles: Record<KpiTone, { icon: string; iconBg: string; accent: string; value: string }> =
  {
    primary: {
      icon: "text-primary",
      iconBg: "bg-primary-soft",
      accent: "bg-primary/70",
      value: "text-primary",
    },
    success: {
      icon: "text-success",
      iconBg: "bg-success/10",
      accent: "bg-success/70",
      value: "text-success",
    },
    warning: {
      icon: "text-warning",
      iconBg: "bg-warning/10",
      accent: "bg-warning/70",
      value: "text-warning",
    },
    neutral: {
      icon: "text-muted-foreground",
      iconBg: "bg-muted",
      accent: "bg-border",
      value: "text-foreground",
    },
  };

interface KpiCardProps {
  label: string;
  value: number;
  format?: (value: number) => string;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: KpiTone;
  href?: string;
  loading?: boolean;
  index?: number;
  className?: string;
}

const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function KpiCard({
  label,
  value,
  format,
  hint,
  icon,
  tone = "neutral",
  href,
  loading,
  index = 0,
  className,
}: KpiCardProps) {
  const styles = toneStyles[tone];
  const animated = useCountUp(loading ? 0 : value);
  const display = format ? format(animated) : integer.format(Math.round(animated));

  const body = (
    <>
      <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p
              className={cn(
                "mt-2 truncate text-3xl font-bold leading-none tracking-tight",
                styles.value,
              )}
            >
              {display}
            </p>
          )}
          {hint && <p className="mt-1.5 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && (
          <span
            aria-hidden
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg [&>svg]:h-[18px] [&>svg]:w-[18px]",
              styles.iconBg,
              styles.icon,
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div aria-hidden className={cn("h-0.5 w-full", styles.accent)} />
    </>
  );

  const shared = cn(
    "block overflow-hidden rounded-xl border border-border bg-card animate-fade-in [animation-fill-mode:backwards]",
    className,
  );
  const delay = { animationDelay: `${index * 70}ms` };

  if (href) {
    return (
      <Link
        href={href}
        style={delay}
        className={cn(
          shared,
          "transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {body}
      </Link>
    );
  }

  return (
    <div style={delay} className={shared}>
      {body}
    </div>
  );
}
