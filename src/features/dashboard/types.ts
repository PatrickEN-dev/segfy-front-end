import type { Policy, PolicyStatus } from "@/features/policies/types/policy-types";

export interface StatusSlice {
  status: PolicyStatus;
  count: number;
}

export interface ExpiringBucket {
  label: string;
  fromDay: number;
  toDay: number;
  count: number;
}

export interface ExpiringItem extends Policy {
  daysLeft: number;
}

export interface DashboardSummary {
  totals: {
    policies: number;
    active: number;
    cancelled: number;
    expired: number;
  };
  activeMonthlyPremium: number;
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
