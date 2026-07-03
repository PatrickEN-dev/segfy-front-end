"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PoliciesTable } from "@/features/policies/components/policies-table";
import { useExpiringPolicies } from "@/features/policies/hooks/use-expiring-policies";
import { formatISODate } from "@/lib/format/date";

export default function ExpiringPage() {
  const { data, isLoading, error, refetch } = useExpiringPolicies();

  const description = data
    ? `Apólices ativas com vencimento em até ${data.meta.windowDays} dias. Referência ${formatISODate(data.meta.reference)}.`
    : "Apólices ativas com vencimento próximo.";

  return (
    <>
      <PageHeader title="Vencimentos" description={description} />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading && !data ? (
          <div className="space-y-2 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error && !data ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="Sem vencimentos próximos"
            description="Nenhuma apólice ativa vence nos próximos 30 dias."
          />
        ) : (
          <PoliciesTable policies={data.data} />
        )}
      </div>
    </>
  );
}
