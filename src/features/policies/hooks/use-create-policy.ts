"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";
import { ApiError } from "@/lib/http/api-error";
import type { CreatePolicyInput } from "@/features/policies/schemas/policy-schemas";

export function useCreatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePolicyInput) => policiesApi.create(input),
    onSuccess: (policy) => {
      qc.invalidateQueries({ queryKey: policyKeys.lists() });
      qc.invalidateQueries({ queryKey: policyKeys.expiring() });
      toast.success("Apólice criada", {
        description: `Número ${policy.number} gerado com sucesso.`,
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
          : "Não foi possível criar a apólice.";
      toast.error("Erro ao criar apólice", { description: message });
    },
  });
}
