"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { usePolicyHistory } from "@/features/policies/hooks/use-policy-history";
import { formatISODateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils";
import type { PolicyStatus } from "@/features/policies/types/policy-types";

const dotClass: Record<PolicyStatus, string> = {
  Ativa: "bg-success",
  Cancelada: "bg-destructive",
  Expirada: "bg-warning",
};

export function PolicyHistoryTimeline({ policyId }: { policyId: string }) {
  const { data, isLoading, error, refetch } = usePolicyHistory(policyId);
  const entries = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-tight">
          Histórico de status
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Mudanças registradas pela API, da mais recente para a mais antiga.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma mudança de status até agora. A apólice permanece como foi
            emitida.
          </p>
        ) : (
          <ol className="relative space-y-6 border-l border-[hsl(var(--hairline))] pl-5">
            {entries.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[26.5px] top-1 h-3 w-3 rounded-full ring-4 ring-card",
                    dotClass[entry.toStatus],
                  )}
                />
                <p className="text-sm font-medium text-foreground">
                  {entry.fromStatus}
                  <span className="mx-1.5 text-muted-foreground">para</span>
                  {entry.toStatus}
                </p>
                {entry.reason && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {entry.reason}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatISODateTime(entry.changedAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
