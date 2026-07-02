"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";
import { ApiError } from "@/lib/http/api-error";

export function useDeletePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => policiesApi.remove(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: policyKeys.detail(id) });
      qc.invalidateQueries({ queryKey: policyKeys.lists() });
      qc.invalidateQueries({ queryKey: policyKeys.expiring() });
      toast.success("Apólice excluída");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir a apólice.";
      toast.error("Erro ao excluir apólice", { description: message });
    },
  });
}
