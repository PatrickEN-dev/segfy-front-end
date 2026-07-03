"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ExpiringBucket } from "@/features/dashboard/types";

interface ExpiringBucketsCardProps {
  buckets: ExpiringBucket[];
  windowDays: number;
  loading?: boolean;
}

/**
 * Colunas de série única (hue primário). Todos os valores são rotulados no
 * topo da coluna, então o gráfico dispensa eixo Y e legenda.
 */
export function ExpiringBucketsCard({
  buckets,
  windowDays,
  loading,
}: ExpiringBucketsCardProps) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="flex flex-col gap-5 rounded-md border border-border bg-card p-6">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          Vencimentos por semana
        </h2>
        <p className="text-xs text-muted-foreground">
          Apólices ativas vencendo nos próximos {windowDays} dias
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-36 w-full" />
      ) : total === 0 ? (
        <div className="flex h-36 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Nenhum vencimento na janela de {windowDays} dias.
          </p>
        </div>
      ) : (
        <div>
          {/* Baseline única (hairline) sob todas as colunas */}
          <div className="flex h-28 items-end justify-around gap-4 border-b border-[hsl(var(--hairline))]">
            {buckets.map((bucket) => (
              <div
                key={bucket.label}
                className="flex w-full max-w-[64px] flex-col items-center justify-end gap-1.5"
                title={`${bucket.label}: ${bucket.count} ${bucket.count === 1 ? "apólice" : "apólices"}`}
              >
                <span className="text-xs font-medium tabular-nums text-foreground">
                  {bucket.count}
                </span>
                <div
                  aria-hidden
                  className="w-6 rounded-t-[4px] bg-primary"
                  style={{
                    height: `${bucket.count === 0 ? 2 : Math.max(8, (bucket.count / max) * 84)}px`,
                    opacity: bucket.count === 0 ? 0.25 : 1,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-around gap-4 pt-1.5">
            {buckets.map((bucket) => (
              <span
                key={bucket.label}
                className="w-full max-w-[64px] text-center text-[11px] text-muted-foreground"
              >
                {bucket.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
