"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeletePolicy } from "@/features/policies/hooks/use-delete-policy";
import type { Policy } from "@/features/policies/types/policy-types";

interface PolicyDeleteDialogProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectOnSuccess?: string;
}

export function PolicyDeleteDialog({
  policy,
  open,
  onOpenChange,
  redirectOnSuccess,
}: PolicyDeleteDialogProps) {
  const router = useRouter();
  const { mutateAsync, isPending } = useDeletePolicy();

  const handleConfirm = async () => {
    if (!policy) return;
    try {
      await mutateAsync(policy.id);
      onOpenChange(false);
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
    } catch {
      // toast já exibido pelo hook
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir apólice"
      description={
        policy ? (
          <span>
            Esta ação é irreversível. Confirmar exclusão de{" "}
            <strong>{policy.number}</strong>?
          </span>
        ) : null
      }
      confirmLabel="Excluir"
      destructive
      loading={isPending}
      onConfirm={handleConfirm}
    />
  );
}
