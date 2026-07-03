import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataRow } from "@/components/shared/data-row";
import { PolicyStatusBadge } from "./policy-status-badge";
import { formatCurrencyBRL } from "@/lib/format/currency";
import { formatISODate, formatISODateTime } from "@/lib/format/date";
import {
  formatPolicyDocument,
  formatPolicyPlate,
} from "@/features/policies/utils/policy-formatters";
import { documentKind } from "@/lib/format/document";
import type { Policy } from "@/features/policies/types/policy-types";

export function PolicySummaryCard({ policy }: { policy: Policy }) {
  const kind = documentKind(policy.document);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="font-mono text-lg tracking-tight">{policy.number}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Emitida em {formatISODateTime(policy.createdAt)}
          </p>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 gap-x-6 gap-y-1 p-6 md:grid-cols-2">
        <DataRow label={kind === "UNKNOWN" ? "Documento" : kind} mono>
          {formatPolicyDocument(policy.document)}
        </DataRow>
        <DataRow label="Placa do veículo" mono>
          {formatPolicyPlate(policy.licensePlate)}
        </DataRow>
        <DataRow label="Início da vigência">{formatISODate(policy.coverageStart)}</DataRow>
        <DataRow label="Fim da vigência">{formatISODate(policy.coverageEnd)}</DataRow>
        <DataRow label="Valor do prêmio" mono>
          {formatCurrencyBRL(policy.premiumAmount)}
        </DataRow>
        <DataRow label="Última atualização">{formatISODateTime(policy.updatedAt)}</DataRow>
      </CardContent>
    </Card>
  );
}
