"use client";

import type { ReactNode } from "react";

interface TooltipItem {
  value?: number | string;
  name?: string;
  color?: string;
  payload?: { fill?: string } & Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  formatValue?: (value: number, item: TooltipItem) => ReactNode;
}

export function ChartTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  if (!item) return null;
  const value = typeof item.value === "number" ? item.value : Number(item.value ?? 0);
  const swatch = item.payload?.fill ?? item.color;
  const name = label ?? item.name;

  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="text-sm font-semibold text-popover-foreground">
        {formatValue ? formatValue(value, item) : value}
      </p>
      {name !== undefined && (
        <p className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
          {swatch && (
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: swatch }}
            />
          )}
          {String(name)}
        </p>
      )}
    </div>
  );
}
