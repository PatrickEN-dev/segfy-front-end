"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PolicyStatusBadge } from "@/features/policies/components/policy-status-badge";
import { usePoliciesList } from "@/features/policies/hooks/use-policies-list";
import { useExpiringPolicies } from "@/features/policies/hooks/use-expiring-policies";
import { formatISODate } from "@/lib/format/date";
import { formatCurrencyBRL } from "@/lib/format/currency";

export default function DashboardPage() {
  const list = usePoliciesList({ page: 1, pageSize: 5 });
  const expiring = useExpiringPolicies();

  const totalPolicies = list.data?.meta.total ?? 0;
  const expiringCount = expiring.data?.data.length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Painel operacional"
        title="Visão geral"
        description="Panorama das apólices ativas na corretora."
      />

      <section
        aria-label="Indicadores"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <KpiCard
          label="Apólices na base"
          value={totalPolicies}
          icon={<FileText />}
          accent="primary"
          loading={list.isLoading}
        />
        <KpiCard
          label="Vencendo em 30 dias"
          value={expiringCount}
          icon={<CalendarClock />}
          accent="warning"
          hint={
            expiring.data?.meta.reference
              ? `Ref. ${formatISODate(expiring.data.meta.reference)}`
              : undefined
          }
          loading={expiring.isLoading}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-base font-semibold tracking-tight">
                Apólices recentes
              </h2>
              <p className="text-xs text-muted-foreground">
                As últimas 5 emissões
              </p>
            </div>
            <Link
              href="/policies"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-hairline">
            {list.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-3">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : list.error ? (
              <ErrorState error={list.error} onRetry={() => list.refetch()} />
            ) : !list.data || list.data.data.length === 0 ? (
              <EmptyState
                title="Nenhuma apólice cadastrada"
                description="Comece cadastrando a primeira apólice."
                action={
                  <Button asChild size="sm" variant="brand">
                    <Link href="/policies/new">Cadastrar apólice</Link>
                  </Button>
                }
              />
            ) : (
              list.data.data.map((policy) => (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-3 -mx-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      {policy.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vigência até {formatISODate(policy.coverageEnd)}
                      <span className="mx-1.5 text-muted-foreground/50">·</span>
                      {formatCurrencyBRL(policy.premiumAmount)}
                    </p>
                  </div>
                  <PolicyStatusBadge status={policy.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-base font-semibold tracking-tight">
                Próximos vencimentos
              </h2>
              <p className="text-xs text-muted-foreground">
                Ativas que vencem em até 30 dias
              </p>
            </div>
            <Link
              href="/expiring"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Detalhar
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-hairline">
            {expiring.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-3">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : expiring.error ? (
              <ErrorState
                error={expiring.error}
                onRetry={() => expiring.refetch()}
              />
            ) : !expiring.data || expiring.data.data.length === 0 ? (
              <EmptyState
                title="Sem vencimentos próximos"
                description="Nenhuma apólice ativa vence nos próximos 30 dias."
              />
            ) : (
              expiring.data.data.slice(0, 5).map((policy) => (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-3 -mx-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      {policy.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vence em {formatISODate(policy.coverageEnd)}
                    </p>
                  </div>
                  <PolicyStatusBadge status={policy.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}