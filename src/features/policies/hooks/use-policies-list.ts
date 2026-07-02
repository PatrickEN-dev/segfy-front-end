"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { policiesApi } from "@/features/policies/api/policies-api";
import { policyKeys } from "./query-keys";
import type { ListPoliciesParams } from "@/features/policies/types/policy-types";

export function usePoliciesList(params: ListPoliciesParams = {}) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: ({ signal }) => policiesApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}
