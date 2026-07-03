"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartTooltip } from "@/features/dashboard/components/chart-tooltip";
import type { ExpiringBucket } from "@/features/dashboard/types";

interface ExpiringBucketsCardProps {
  buckets: ExpiringBucket[];
  windowDays: number;
  loading?: boolean;
}

export function ExpiringBucketsCard({ buckets, windowDays, loading }: ExpiringBucketsCardProps) {
  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Vencimentos por semana</h2>
          <p className="text-xs text-muted-foreground">
            Apólices ativas vencendo nos próximos {windowDays} dias
          </p>
        </div>
        {!loading && total > 0 && (
          <span className="shrink-0 rounded-full bg-[hsl(var(--warning))]/15 px-2.5 py-0.5 text-xs font-medium text-warning">
            {total} no período
          </span>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-56 w-full" />
      ) : total === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-sm text-muted-foreground">
            Nenhum vencimento na janela de {windowDays} dias.
          </p>
        </div>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={236}>
            <BarChart
              data={buckets}
              margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
              barCategoryGap="35%"
            >
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "hsl(var(--hairline))" }}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={6}
              />
              <YAxis hide domain={[0, "dataMax"]} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                content={
                  <ChartTooltip
                    formatValue={(value) => `${value} ${value === 1 ? "apólice" : "apólices"}`}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-primary))"
                maxBarSize={24}
                radius={[4, 4, 0, 0]}
                animationDuration={700}
                animationBegin={100}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                  fontWeight={500}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
