"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PolicySummaryCard } from "@/features/policies/components/policy-summary-card";
import { PolicyDeleteDialog } from "@/features/policies/components/policy-delete-dialog";
import { usePolicy } from "@/features/policies/hooks/use-policy";

export default function PolicyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading, error, refetch } = usePolicy(params.id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Apólice"
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

      {data && <PolicySummaryCard policy={data} />}

      {data && (
        <PolicyDeleteDialog
          policy={data}
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          redirectOnSuccess="/policies"
        />
      )}
    </>
  );
}
