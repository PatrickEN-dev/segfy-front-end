"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { StatusSlice } from "@/features/dashboard/types";
import type { PolicyStatus } from "@/features/policies/types/policy-types";
import { cn } from "@/lib/utils";

const fillClass: Record<PolicyStatus, string> = {
  Ativa: "bg-success",
  Expirada: "bg-warning",
  Cancelada: "bg-destructive",
};

interface StatusDistributionCardProps {
  slices: StatusSlice[];
  total: number;
  loading?: boolean;
}

const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function StatusDistributionCard({
  slices,
  total,
  loading,
}: StatusDistributionCardProps) {
  const visible = slices.filter((slice) => slice.count > 0);

  return (
    <div className="flex flex-col gap-5 rounded-md border border-border bg-card p-6">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          Carteira por status
        </h2>
        <p className="text-xs text-muted-foreground">
          Composição das {total} apólices na base
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : total === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sem apólices na base ainda.
        </p>
      ) : (
        <>
          {/* Barra empilhada: gap de 2px na cor da superfície separa os segmentos */}
          <div
            role="img"
            aria-label={slices
              .map((s) => `${s.status}: ${s.count}`)
              .join(", ")}
            className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full"
          >
            {visible.map((slice) => (
              <div
                key={slice.status}
                className={cn("h-full rounded-[2px]", fillClass[slice.status])}
                style={{ width: `${(slice.count / total) * 100}%` }}
                title={`${slice.status}: ${slice.count}`}
              />
            ))}
          </div>

          <ul className="space-y-2.5">
            {slices.map((slice) => (
              <li
                key={slice.status}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      fillClass[slice.status],
                    )}
                  />
                  {slice.status}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  <strong className="font-medium text-foreground">
                    {slice.count}
                  </strong>
                  <span className="ml-2 inline-block w-10 text-right">
                    {percent.format(total > 0 ? slice.count / total : 0)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
