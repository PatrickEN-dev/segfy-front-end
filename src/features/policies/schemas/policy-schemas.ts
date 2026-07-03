import { z } from "zod";
import { isValidCpfCnpj, onlyDigits } from "@/lib/format/document";
import { isValidPlate, normalizePlate } from "@/lib/format/plate";
import { POLICY_STATUS } from "@/features/policies/types/policy-types";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data em formato inválido (esperado AAAA-MM-DD).");

const documentField = z
  .string()
  .trim()
  .min(11, "Documento incompleto.")
  .refine(isValidCpfCnpj, "CPF/CNPJ inválido.")
  .transform(onlyDigits);

const plateField = z
  .string()
  .trim()
  .refine(isValidPlate, "Placa inválida. Use AAA-9999 ou AAA9A99.")
  .transform(normalizePlate);

const premiumField = z
  .number({ invalid_type_error: "Prêmio deve ser numérico." })
  .positive("Prêmio deve ser maior que zero.")
  .refine((v) => {
    if (!Number.isFinite(v)) return false;
    return Math.abs(Math.round(v * 100) / 100 - v) < 1e-9;
  }, "Máximo 2 casas decimais.");

const coverageRefinement = <
  T extends { coverageStart: string; coverageEnd: string },
>(
  data: T,
  ctx: z.RefinementCtx,
) => {
  if (data.coverageEnd <= data.coverageStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coverageEnd"],
      message: "Fim da vigência deve ser posterior ao início.",
    });
  }
};

export const createPolicySchema = z
  .object({
    document: documentField,
    licensePlate: plateField,
    premiumAmount: premiumField,
    coverageStart: isoDate,
    coverageEnd: isoDate,
  })
  .superRefine(coverageRefinement);

export const updatePolicySchema = z
  .object({
    document: documentField,
    licensePlate: plateField,
    premiumAmount: premiumField,
    coverageStart: isoDate,
    coverageEnd: isoDate,
    status: z.enum(POLICY_STATUS),
    statusReason: z
      .string()
      .trim()
      .max(500, "Motivo deve ter no máximo 500 caracteres.")
      .optional()
      .transform((v) => (v ? v : undefined)),
  })
  .superRefine(coverageRefinement);

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
