import { api } from "@/lib/http/client";
import type {
  ExpiringResponse,
  ListPoliciesParams,
  Paginated,
  Policy,
} from "@/features/policies/types/policy-types";
import type {
  CreatePolicyInput,
  UpdatePolicyInput,
} from "@/features/policies/schemas/policy-schemas";

const BASE = "/policies";

export const policiesApi = {
  list(params: ListPoliciesParams = {}, signal?: AbortSignal) {
    return api.get<Paginated<Policy>>(
      BASE,
      {
        page: params.page,
        pageSize: params.pageSize,
        q: params.q,
        status: params.status,
      },
      signal,
    );
  },
  getById(id: string, signal?: AbortSignal) {
    return api.get<Policy>(`${BASE}/${id}`, undefined, signal);
  },
  expiring(signal?: AbortSignal) {
    return api.get<ExpiringResponse>(`${BASE}/expiring`, undefined, signal);
  },
  create(input: CreatePolicyInput) {
    return api.post<Policy>(BASE, input);
  },
  update(id: string, input: UpdatePolicyInput) {
    return api.put<Policy>(`${BASE}/${id}`, input);
  },
  remove(id: string) {
    return api.delete<void>(`${BASE}/${id}`);
  },
};
