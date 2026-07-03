"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";
import { ApiError } from "@/lib/http/api-error";
import type { UpdatePolicyInput } from "@/features/policies/schemas/policy-schemas";

interface UpdateArgs {
  id: string;
  input: UpdatePolicyInput;
}

export function useUpdatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: UpdateArgs) => policiesApi.update(id, input),
    onSuccess: (policy) => {
      qc.setQueryData(policyKeys.detail(policy.id), policy);
      qc.invalidateQueries({ queryKey: policyKeys.history(policy.id) });
      qc.invalidateQueries({ queryKey: policyKeys.lists() });
      qc.invalidateQueries({ queryKey: policyKeys.expiring() });
      toast.success("Apólice atualizada", {
        description: `Alterações em ${policy.number} salvas.`,
      });
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.code === "VALIDATION_ERROR" || error.code === "DOMAIN_VALIDATION")
      ) {
        return;
      }
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível atualizar a apólice.";
      toast.error("Erro ao atualizar apólice", { description: message });
    },
  });
}
