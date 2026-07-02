export const POLICY_STATUS = ["Ativa", "Cancelada", "Expirada"] as const;
export type PolicyStatus = (typeof POLICY_STATUS)[number];

export interface Policy {
  id: string;
  number: string;
  document: string;
  licensePlate: string;
  premiumAmount: number;
  coverageStart: string;
  coverageEnd: string;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ExpiringResponse {
  data: Policy[];
  meta: {
    windowDays: number;
    reference: string;
  };
}

export interface ListPoliciesParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: PolicyStatus;
}
