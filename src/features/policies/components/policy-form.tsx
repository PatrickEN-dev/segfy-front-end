"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/http/api-error";
import { apiErrorMessage, translateFieldErrors } from "@/lib/http/error-messages";
import { cn } from "@/lib/utils";
import {
  maskCurrencyBRL,
  numberToCurrencyInput,
  parseCurrencyBRL,
} from "@/lib/format/currency";
import {
  createPolicySchema,
  updatePolicySchema,
  type CreatePolicyInput,
  type UpdatePolicyInput,
} from "@/features/policies/schemas/policy-schemas";
import {
  type Policy,
  type PolicyStatus,
} from "@/features/policies/types/policy-types";
import { useCreatePolicy } from "@/features/policies/hooks/use-create-policy";
import { useUpdatePolicy } from "@/features/policies/hooks/use-update-policy";

const ALLOWED_TRANSITIONS: Record<PolicyStatus, PolicyStatus[]> = {
  Ativa: ["Ativa", "Cancelada", "Expirada"],
  Cancelada: ["Cancelada"],
  Expirada: ["Expirada"],
};

type Mode = "create" | "edit";

interface PolicyFormProps {
  mode: Mode;
  initial?: Policy;
  /** Sem card ao redor dos campos (para uso dentro de modal). */
  embedded?: boolean;
  /** Sobrescreve a navegação padrão pós-sucesso (push para o detalhe). */
  onSuccess?: (policy: Policy) => void;
  /** Sobrescreve o cancelar padrão (router.back). */
  onCancel?: () => void;
}

interface FormShape {
  document: string;
  licensePlate: string;
  premiumAmount: string;
  coverageStart: string;
  coverageEnd: string;
  status: PolicyStatus;
  statusReason: string;
}

function buildDefaults(policy?: Policy): FormShape {
  return {
    document: policy?.document ?? "",
    licensePlate: policy?.licensePlate ?? "",
    premiumAmount: policy ? numberToCurrencyInput(policy.premiumAmount) : "",
    coverageStart: policy?.coverageStart ?? "",
    coverageEnd: policy?.coverageEnd ?? "",
    status: policy?.status ?? "Ativa",
    statusReason: "",
  };
}

export function PolicyForm({
  mode,
  initial,
  embedded = false,
  onSuccess,
  onCancel,
}: PolicyFormProps) {
  const router = useRouter();
  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();

  const schema = mode === "create" ? createPolicySchema : updatePolicySchema;
  const form = useForm<FormShape>({
    defaultValues: buildDefaults(initial),
    mode: "onBlur",
  });
  const [rootError, setRootError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) form.reset(buildDefaults(initial));
  }, [initial, form]);

  /**
   * Distribui o erro da API: mensagens de campo vão para os inputs
   * (traduzidas) e qualquer erro sem campo associado vira um alerta geral,
   * garantindo que sempre haja um retorno visível ao usuário.
   */
  const applyServerError = (error: unknown) => {
    if (!(error instanceof ApiError)) {
      setRootError(apiErrorMessage(error, "Não foi possível salvar a apólice."));
      return;
    }

    const known = new Set<keyof FormShape>([
      "document",
      "licensePlate",
      "premiumAmount",
      "coverageStart",
      "coverageEnd",
      "status",
      "statusReason",
    ]);
    const toCamel = (raw: string) =>
      raw
        .replace(/[_\s]+([a-zA-Z0-9])/g, (_, ch) => ch.toUpperCase())
        .replace(/^([A-Z])/, (m) => m.toLowerCase());

    const fields = translateFieldErrors(error);
    let matchedField = false;
    for (const [name, messages] of Object.entries(fields)) {
      const first = messages[0];
      if (!first) continue;
      const candidate = toCamel(name);
      if (!known.has(candidate as keyof FormShape)) continue;
      matchedField = true;
      form.setError(candidate as keyof FormShape, {
        type: "server",
        message: first,
      });
    }

    // Sem campo mapeado (ex.: placa já ativa, transição inválida): mostra o
    // erro traduzido no alerta do formulário para não passar despercebido.
    if (!matchedField) {
      setRootError(apiErrorMessage(error));
    }
  };

  const onSubmit: SubmitHandler<FormShape> = async (raw) => {
    setRootError(null);
    const premium = parseCurrencyBRL(raw.premiumAmount);
    const parsed = schema.safeParse({
      document: raw.document,
      licensePlate: raw.licensePlate,
      premiumAmount: premium ?? Number.NaN,
      coverageStart: raw.coverageStart,
      coverageEnd: raw.coverageEnd,
      ...(mode === "edit"
        ? { status: raw.status, statusReason: raw.statusReason }
        : {}),
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") {
          form.setError(path as keyof FormShape, {
            type: "validation",
            message: issue.message,
          });
        }
      }
      return;
    }

    try {
      if (mode === "create") {
        const policy = await createMutation.mutateAsync(
          parsed.data as CreatePolicyInput,
        );
        if (onSuccess) onSuccess(policy);
        else router.push(`/policies/${policy.id}`);
      } else if (initial) {
        const policy = await updateMutation.mutateAsync({
          id: initial.id,
          input: parsed.data as UpdatePolicyInput,
        });
        if (onSuccess) onSuccess(policy);
        else router.push(`/policies/${policy.id}`);
      }
    } catch (error) {
      applyServerError(error);
    }
  };

  const submitting =
    createMutation.isPending || updateMutation.isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className={cn(embedded && "border-0 bg-transparent shadow-none")}>
          <CardContent
            className={cn(
              "grid grid-cols-1 gap-6 p-6 md:grid-cols-2",
              embedded && "p-0",
            )}
          >
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ do segurado</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Aceita CPF (11 dígitos) ou CNPJ (14 dígitos), com ou sem máscara.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa do veículo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC-1234 ou ABC1A23"
                      autoComplete="off"
                      className="font-mono uppercase"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Padrão brasileiro antigo ou Mercosul.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="premiumAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do prêmio (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="199,90"
                      {...field}
                      onChange={(event) =>
                        field.onChange(maskCurrencyBRL(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Valor mensal em reais. A formatação é aplicada automaticamente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "edit" && initial && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  const allowed = ALLOWED_TRANSITIONS[initial.status];
                  const isTerminal = allowed.length === 1;
                  return (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isTerminal}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allowed.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {isTerminal
                          ? `${initial.status} é um estado terminal e não pode ser alterado.`
                          : "Cancelada e Expirada são estados terminais."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {mode === "edit" &&
              initial &&
              form.watch("status") !== initial.status && (
                <FormField
                  control={form.control}
                  name="statusReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da mudança de status</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: cancelamento a pedido do cliente"
                          autoComplete="off"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Opcional. Fica registrado no histórico da apólice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <FormField
              control={form.control}
              name="coverageStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início da vigência</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverageEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fim da vigência</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {rootError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{rootError}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => (onCancel ? onCancel() : router.back())}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "create" ? "Cadastrar apólice" : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
