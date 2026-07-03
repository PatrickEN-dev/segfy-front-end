"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PolicySummaryCard } from "@/features/policies/components/policy-summary-card";
import { PolicyDeleteDialog } from "@/features/policies/components/policy-delete-dialog";
import { PolicyHistoryTimeline } from "@/features/policies/components/policy-history-timeline";
import {
  PolicyStatusDialog,
  type TerminalStatus,
} from "@/features/policies/components/policy-status-dialog";
import { usePolicy } from "@/features/policies/hooks/use-policy";

export default function PolicyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading, error, refetch } = usePolicy(params.id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [statusAction, setStatusAction] = useState<TerminalStatus | null>(null);

  return (
    <>
      <PageHeader
        title={data ? data.number : "Detalhes da apólice"}
        description={
          data ? undefined : "Carregando informações da apólice."
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Apólices", href: "/policies" },
              { label: data?.number ?? "Detalhes" },
            ]}
          />
        }
        actions={
          data ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/policies/${data.id}/edit`}>Editar</Link>
              </Button>
              {data.status === "Ativa" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Alterar status
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => setStatusAction("Cancelada")}
                    >
                      Cancelar apólice
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setStatusAction("Expirada")}
                    >
                      Marcar como expirada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmingDelete(true)}
              >
                Excluir
              </Button>
            </>
          ) : null
        }
      />

      {isLoading && <Skeleton className="h-64 w-full" />}

      {error && !data && (
        <ErrorState
          title="Apólice não encontrada"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <PolicySummaryCard policy={data} />
          <PolicyHistoryTimeline policyId={data.id} />
        </div>
      )}

      {data && (
        <>
          <PolicyDeleteDialog
            policy={data}
            open={confirmingDelete}
            onOpenChange={setConfirmingDelete}
            redirectOnSuccess="/policies"
          />
          <PolicyStatusDialog
            policy={data}
            action={statusAction}
            onOpenChange={(open) => {
              if (!open) setStatusAction(null);
            }}
          />
        </>
      )}
    </>
  );
}
