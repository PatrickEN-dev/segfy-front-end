"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError, type ApiErrorPayload } from "@/lib/http/api-error";
import type { DashboardSummary } from "@/features/dashboard/types";

async function fetchDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  const res = await fetch("/api/bff/dashboard", {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: ApiErrorPayload;
    } | null;
    throw new ApiError({
      status: res.status,
      code: body?.error?.code ?? "UNKNOWN",
      message: body?.error?.message ?? "Não foi possível carregar o resumo do painel.",
      requestId: body?.error?.requestId,
    });
  }
  return (await res.json()) as DashboardSummary;
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: ({ signal }) => fetchDashboardSummary(signal),
    refetchInterval: 60_000,
  });
}
