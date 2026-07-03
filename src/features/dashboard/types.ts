import type { Policy, PolicyStatus } from "@/features/policies/types/policy-types";

export interface StatusSlice {
  status: PolicyStatus;
  count: number;
}

export interface ExpiringBucket {
  /** Rótulo curto, ex. "0–7 d". */
  label: string;
  fromDay: number;
  toDay: number;
  count: number;
}

export interface ExpiringItem extends Policy {
  /** Dias corridos até o fim da vigência, relativo à data de referência da API. */
  daysLeft: number;
}

export interface DashboardSummary {
  totals: {
    policies: number;
    active: number;
    cancelled: number;
    expired: number;
  };
  /** Somatório do prêmio mensal das apólices ativas. */
  activeMonthlyPremium: number;
  /** true quando havia mais ativas do que a página agregada (soma parcial). */
  premiumIsPartial: boolean;
  expiring: {
    count: number;
    windowDays: number;
    reference: string;
    buckets: ExpiringBucket[];
    items: ExpiringItem[];
  };
  recent: Policy[];
  generatedAt: string;
}
