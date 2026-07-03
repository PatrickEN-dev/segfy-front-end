import type { ListPoliciesParams } from "@/features/policies/types/policy-types";

export const policyKeys = {
  all: ["policies"] as const,
  lists: () => [...policyKeys.all, "list"] as const,
  list: (params: ListPoliciesParams) =>
    [...policyKeys.lists(), params] as const,
  details: () => [...policyKeys.all, "detail"] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
  history: (id: string) => [...policyKeys.detail(id), "history"] as const,
  expiring: () => [...policyKeys.all, "expiring"] as const,
};
