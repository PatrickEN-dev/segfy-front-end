"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PolicyForm } from "@/features/policies/components/policy-form";
import { usePolicy } from "@/features/policies/hooks/use-policy";

export default function EditPolicyPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading, error, refetch } = usePolicy(params.id);

  return (
    <>
      <PageHeader
        title={data ? `Editar ${data.number}` : "Editar apólice"}
        description="Atualize os dados da apólice. Cancelada e Expirada são estados terminais."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Apólices", href: "/policies" },
              {
                label: data?.number ?? "…",
                href: data ? `/policies/${data.id}` : undefined,
              },
              { label: "Editar" },
            ]}
          />
        }
      />

      {isLoading && <Skeleton className="h-96 w-full" />}
      {error && !data && (
        <ErrorState
          title="Apólice não encontrada"
          error={error}
          onRetry={() => refetch()}
        />
      )}
      {data && <PolicyForm mode="edit" initial={data} />}
    </>
  );
}
