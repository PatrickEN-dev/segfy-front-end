"use client";

import { useQuery } from "@tanstack/react-query";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";

export function useExpiringPolicies() {
  return useQuery({
    queryKey: policyKeys.expiring(),
    queryFn: ({ signal }) => policiesApi.expiring(signal),
  });
}
