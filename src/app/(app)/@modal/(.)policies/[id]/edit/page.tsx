"use client";

import { useRouter } from "next/navigation";
import { RouteModal } from "@/components/shared/route-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PolicyForm } from "@/features/policies/components/policy-form";
import { usePolicy } from "@/features/policies/hooks/use-policy";

export default function EditPolicyModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = usePolicy(params.id);

  return (
    <RouteModal
      title={data ? `Editar ${data.number}` : "Editar apólice"}
      description="Atualize os dados da apólice. Cancelada e Expirada são estados terminais."
    >
      {isLoading && <Skeleton className="h-72 w-full" />}
      {error && !data && (
        <ErrorState title="Apólice não encontrada" error={error} onRetry={() => refetch()} />
      )}
      {data && (
        <PolicyForm
          mode="edit"
          initial={data}
          embedded
          onSuccess={() => router.back()}
          onCancel={() => router.back()}
        />
      )}
    </RouteModal>
  );
}
