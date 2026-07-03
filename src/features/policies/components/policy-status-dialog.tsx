"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePolicy } from "@/features/policies/hooks/use-update-policy";
import { apiErrorMessage } from "@/lib/http/error-messages";
import type { Policy, PolicyStatus } from "@/features/policies/types/policy-types";

export type TerminalStatus = Extract<PolicyStatus, "Cancelada" | "Expirada">;

const COPY: Record<TerminalStatus, { title: string; description: string; confirm: string }> = {
  Cancelada: {
    title: "Cancelar apólice",
    description: "A apólice ficará imutável após o cancelamento. Essa ação não pode ser desfeita.",
    confirm: "Cancelar apólice",
  },
  Expirada: {
    title: "Marcar como expirada",
    description:
      "A apólice será encerrada como expirada e ficará imutável. Essa ação não pode ser desfeita.",
    confirm: "Marcar expirada",
  },
};

interface PolicyStatusDialogProps {
  policy: Policy | null;
  action: TerminalStatus | null;
  onOpenChange: (open: boolean) => void;
}

export function PolicyStatusDialog({ policy, action, onOpenChange }: PolicyStatusDialogProps) {
  const mutation = useUpdatePolicy();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const open = Boolean(policy && action);

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
    }
  }, [open]);

  if (!policy || !action) return null;

  const copy = COPY[action];

  const submit = async () => {
    setError(null);
    try {
      await mutation.mutateAsync({
        id: policy.id,
        input: {
          document: policy.document,
          licensePlate: policy.licensePlate,
          premiumAmount: policy.premiumAmount,
          coverageStart: policy.coverageStart,
          coverageEnd: policy.coverageEnd,
          status: action,
          statusReason: reason.trim() || undefined,
        },
      });
      onOpenChange(false);
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível alterar o status."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            {policy.number} · {copy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="status-reason">Motivo (opcional)</Label>
          <Input
            id="status-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ex.: solicitação do cliente"
            maxLength={500}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Fica registrado no histórico de status da apólice.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant={action === "Cancelada" ? "destructive" : "default"}
            onClick={submit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
