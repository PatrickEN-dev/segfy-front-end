"use client";

import { useQuery } from "@tanstack/react-query";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";

export function usePolicy(id: string | undefined) {
  return useQuery({
    queryKey: id ? policyKeys.detail(id) : [...policyKeys.details(), "empty"],
    queryFn: ({ signal }) => policiesApi.getById(id!, signal),
    enabled: Boolean(id),
  });
}
