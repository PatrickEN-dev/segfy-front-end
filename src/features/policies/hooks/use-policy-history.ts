"use client";

import { useQuery } from "@tanstack/react-query";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";

export function usePolicyHistory(id: string | undefined) {
  return useQuery({
    queryKey: id
      ? policyKeys.history(id)
      : [...policyKeys.details(), "empty", "history"],
    queryFn: ({ signal }) => policiesApi.history(id!, signal),
    enabled: Boolean(id),
  });
}
