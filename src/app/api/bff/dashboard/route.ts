import { NextResponse } from "next/server";
import { segfyGet, SegfyUpstreamError } from "@/lib/server/segfy-api";
import type {
  ExpiringResponse,
  Paginated,
  Policy,
} from "@/features/policies/types/policy-types";
import type {
  DashboardSummary,
  ExpiringBucket,
  ExpiringItem,
} from "@/features/dashboard/types";

export const dynamic = "force-dynamic";

const DAY_MS = 86_400_000;

function daysBetweenISO(fromISO: string, toISO: string): number {
  const from = Date.parse(`${fromISO.slice(0, 10)}T00:00:00Z`);
  const to = Date.parse(`${toISO.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) return Number.NaN;
  return Math.round((to - from) / DAY_MS);
}

function buildBuckets(items: ExpiringItem[], windowDays: number): ExpiringBucket[] {
  return [
    { fromDay: 0, toDay: 7 },
    { fromDay: 8, toDay: 14 },
    { fromDay: 15, toDay: 21 },
    { fromDay: 22, toDay: windowDays },
  ]
    .filter((edge) => edge.fromDay <= windowDays)
    .map((edge) => {
      const toDay = Math.min(edge.toDay, windowDays);
      return {
        label: `${edge.fromDay}–${toDay} d`,
        fromDay: edge.fromDay,
        toDay,
        count: items.filter(
          (item) => item.daysLeft >= edge.fromDay && item.daysLeft <= toDay,
        ).length,
      };
    });
}

export async function GET() {
  try {
    const [recent, actives, cancelled, expired, expiring] = await Promise.all([
      segfyGet<Paginated<Policy>>("/policies?page=1&pageSize=5"),
      segfyGet<Paginated<Policy>>(
        "/policies?status=Ativa&page=1&pageSize=100&sortBy=coverageEnd&sortDir=asc",
      ),
      segfyGet<Paginated<Policy>>("/policies?status=Cancelada&page=1&pageSize=1"),
      segfyGet<Paginated<Policy>>("/policies?status=Expirada&page=1&pageSize=1"),
      segfyGet<ExpiringResponse>("/policies/expiring"),
    ]);

    const reference = expiring.meta.reference;
    const items: ExpiringItem[] = expiring.data
      .map((policy) => ({
        ...policy,
        daysLeft: daysBetweenISO(reference, policy.coverageEnd),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);

    const summary: DashboardSummary = {
      totals: {
        policies: recent.meta.total,
        active: actives.meta.total,
        cancelled: cancelled.meta.total,
        expired: expired.meta.total,
      },
      activeMonthlyPremium: actives.data.reduce(
        (sum, policy) => sum + policy.premiumAmount,
        0,
      ),
      premiumIsPartial: actives.meta.total > actives.data.length,
      expiring: {
        count: expiring.data.length,
        windowDays: expiring.meta.windowDays,
        reference,
        buckets: buildBuckets(items, expiring.meta.windowDays),
        items,
      },
      recent: recent.data,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(summary);
  } catch (error) {
    if (error instanceof SegfyUpstreamError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Falha inesperada ao montar o resumo do dashboard.",
        },
      },
      { status: 500 },
    );
  }
}
