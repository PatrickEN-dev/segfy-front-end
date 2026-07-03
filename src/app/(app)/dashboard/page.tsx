"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PolicyStatusBadge } from "@/features/policies/components/policy-status-badge";
import { StatusDistributionCard } from "@/features/dashboard/components/status-distribution-card";
import { ExpiringBucketsCard } from "@/features/dashboard/components/expiring-buckets-card";
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary";
import { formatPolicyPlate } from "@/features/policies/utils/policy-formatters";
import { formatISODate } from "@/lib/format/date";
import { formatCurrencyBRL } from "@/lib/format/currency";
import { cn } from "@/lib/utils";

const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

function DaysLeftChip({ days }: { days: number }) {
  const urgent = days <= 7;
  const label =
    days <= 0 ? "vence hoje" : days === 1 ? "1 dia" : `${days} dias`;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
        urgent
          ? "bg-warning/15 text-warning"
          : "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

function ListCard({
  title,
  subtitle,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  hrefLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {hrefLabel}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
      {children}
    </div>
  );
}

function RowsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const summary = useDashboardSummary();
  const data = summary.data;

  const totals = data?.totals;
  const activeShare =
    totals && totals.policies > 0 ? totals.active / totals.policies : null;

  if (summary.error && !data) {
    return (
      <>
        <PageHeader
          title="Visão geral"
          description="Panorama da carteira de apólices."
        />
        <ErrorState
          title="Não foi possível carregar o painel"
          error={summary.error}
          onRetry={() => summary.refetch()}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Panorama da carteira de apólices."
        actions={
          <Button asChild>
            <Link href="/policies/new">Nova apólice</Link>
          </Button>
        }
      />

      <div
        className={cn(
          "space-y-8 transition-opacity duration-300",
          summary.isFetching && !summary.isLoading && "opacity-70",
        )}
      >
      <section
        aria-label="Indicadores"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Apólices na base"
          value={totals?.policies ?? 0}
          icon={<FileText aria-hidden />}
          tone="primary"
          href="/policies"
          index={0}
          hint={
            totals
              ? `${totals.cancelled} canceladas · ${totals.expired} expiradas`
              : undefined
          }
          loading={summary.isLoading}
        />
        <KpiCard
          label="Apólices ativas"
          value={totals?.active ?? 0}
          icon={<ShieldCheck aria-hidden />}
          tone="success"
          href="/policies?status=Ativa"
          index={1}
          hint={
            activeShare !== null
              ? `${percent.format(activeShare)} da base`
              : undefined
          }
          loading={summary.isLoading}
        />
        <KpiCard
          label="Vencendo em 30 dias"
          value={data?.expiring.count ?? 0}
          icon={<CalendarClock aria-hidden />}
          tone="warning"
          href="/expiring"
          index={2}
          hint={
            data?.expiring.reference
              ? `Ref. ${formatISODate(data.expiring.reference)}`
              : undefined
          }
          loading={summary.isLoading}
        />
        <KpiCard
          label="Prêmio mensal ativo"
          value={data?.activeMonthlyPremium ?? 0}
          format={formatCurrencyBRL}
          icon={<Wallet aria-hidden />}
          tone="neutral"
          index={3}
          hint={
            data?.premiumIsPartial
              ? "Somatório parcial das ativas"
              : "Somatório das apólices ativas"
          }
          loading={summary.isLoading}
        />
      </section>

      <section
        aria-label="Composição e vencimentos"
        className="grid grid-cols-1 gap-6 animate-fade-in [animation-delay:150ms] [animation-fill-mode:backwards] lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <ExpiringBucketsCard
            loading={summary.isLoading}
            windowDays={data?.expiring.windowDays ?? 30}
            buckets={data?.expiring.buckets ?? []}
          />
        </div>
        <StatusDistributionCard
          loading={summary.isLoading}
          total={totals?.policies ?? 0}
          slices={[
            { status: "Ativa", count: totals?.active ?? 0 },
            { status: "Expirada", count: totals?.expired ?? 0 },
            { status: "Cancelada", count: totals?.cancelled ?? 0 },
          ]}
        />
      </section>

      <section
        aria-label="Listas rápidas"
        className="grid grid-cols-1 gap-6 animate-fade-in [animation-delay:250ms] [animation-fill-mode:backwards] lg:grid-cols-2"
      >
        <ListCard
          title="Apólices recentes"
          subtitle="Últimas 5 emissões"
          href="/policies"
          hrefLabel="Ver todas"
        >
          {summary.isLoading ? (
            <RowsSkeleton />
          ) : !data || data.recent.length === 0 ? (
            <EmptyState
              title="Nenhuma apólice cadastrada"
              description="Comece cadastrando a primeira apólice."
              action={
                <Button asChild size="sm">
                  <Link href="/policies/new">Cadastrar apólice</Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-hairline">
              {data.recent.map((policy) => (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {policy.number}
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                        {formatPolicyPlate(policy.licensePlate)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Vigência até {formatISODate(policy.coverageEnd)}
                      <span className="mx-1.5 text-muted-foreground/50">·</span>
                      {formatCurrencyBRL(policy.premiumAmount)}
                    </p>
                  </div>
                  <PolicyStatusBadge status={policy.status} />
                </Link>
              ))}
            </div>
          )}
        </ListCard>

        <ListCard
          title="Próximos vencimentos"
          subtitle={`Ativas vencendo em até ${data?.expiring.windowDays ?? 30} dias`}
          href="/expiring"
          hrefLabel="Detalhar"
        >
          {summary.isLoading ? (
            <RowsSkeleton />
          ) : !data || data.expiring.items.length === 0 ? (
            <EmptyState
              title="Sem vencimentos próximos"
              description="Nenhuma apólice ativa vence nos próximos 30 dias."
            />
          ) : (
            <div className="divide-y divide-hairline">
              {data.expiring.items.slice(0, 5).map((policy) => (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {policy.number}
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                        {formatPolicyPlate(policy.licensePlate)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Vence em {formatISODate(policy.coverageEnd)}
                      <span className="mx-1.5 text-muted-foreground/50">·</span>
                      {formatCurrencyBRL(policy.premiumAmount)}
                    </p>
                  </div>
                  <DaysLeftChip days={policy.daysLeft} />
                </Link>
              ))}
            </div>
          )}
        </ListCard>
      </section>
      </div>
    </>
  );
}
