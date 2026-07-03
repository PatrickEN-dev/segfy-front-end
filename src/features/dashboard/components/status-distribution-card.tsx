"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartTooltip } from "@/features/dashboard/components/chart-tooltip";
import type { StatusSlice } from "@/features/dashboard/types";
import type { PolicyStatus } from "@/features/policies/types/policy-types";
import { cn } from "@/lib/utils";

const chartFill: Record<PolicyStatus, string> = {
  Ativa: "hsl(var(--chart-success))",
  Expirada: "hsl(var(--chart-warning))",
  Cancelada: "hsl(var(--chart-destructive))",
};

const dotClass: Record<PolicyStatus, string> = {
  Ativa: "bg-[hsl(var(--chart-success))]",
  Expirada: "bg-[hsl(var(--chart-warning))]",
  Cancelada: "bg-[hsl(var(--chart-destructive))]",
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

export function StatusDistributionCard({ slices, total, loading }: StatusDistributionCardProps) {
  const visible = slices.filter((slice) => slice.count > 0);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">Carteira por status</h2>
        <p className="text-xs text-muted-foreground">Composição das {total} apólices na base</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-40 w-40 rounded-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : total === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Sem apólices na base ainda.</p>
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-44 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                role="img"
                aria-label={slices.map((s) => `${s.status}: ${s.count}`).join(", ")}
              >
                <Tooltip
                  content={
                    <ChartTooltip
                      formatValue={(value) =>
                        `${value} ${value === 1 ? "apólice" : "apólices"} · ${percent.format(total > 0 ? value / total : 0)}`
                      }
                    />
                  }
                />
                <Pie
                  data={visible}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="68%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                  animationDuration={800}
                  animationBegin={100}
                >
                  {visible.map((slice) => (
                    <Cell key={slice.status} fill={chartFill[slice.status]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-2xl font-bold leading-none text-foreground">{total}</span>
              <span className="mt-1 text-[11px] text-muted-foreground">
                {total === 1 ? "apólice" : "apólices"}
              </span>
            </div>
          </div>

          <ul className="space-y-2.5">
            {slices.map((slice) => (
              <li key={slice.status} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    aria-hidden
                    className={cn("h-2.5 w-2.5 rounded-full", dotClass[slice.status])}
                  />
                  {slice.status}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  <strong className="font-medium text-foreground">{slice.count}</strong>
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
