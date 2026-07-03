import { cn } from "@/lib/utils";
import type { PolicyStatus } from "@/features/policies/types/policy-types";

const dotClass: Record<PolicyStatus, string> = {
  Ativa: "bg-[hsl(var(--success))]",
  Cancelada: "bg-[hsl(var(--destructive))]",
  Expirada: "bg-[hsl(var(--warning))]",
};

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", dotClass[status])} />
      {status}
    </span>
  );
}
