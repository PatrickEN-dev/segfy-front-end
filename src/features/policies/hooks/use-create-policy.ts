"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";
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
    // Erros são exibidos, traduzidos, pelo formulário (campos + alerta geral).
  });
}
