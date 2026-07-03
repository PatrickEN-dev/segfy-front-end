import { api } from "@/lib/http/client";
import { onlyDigits } from "@/lib/format/document";
import { normalizePlate } from "@/lib/format/plate";
import type {
  ExpiringResponse,
  ListPoliciesParams,
  Paginated,
  Policy,
  StatusHistoryResponse,
} from "@/features/policies/types/policy-types";
import type {
  CreatePolicyInput,
  UpdatePolicyInput,
} from "@/features/policies/schemas/policy-schemas";

const BASE = "/policies";

type SearchTarget =
  | { kind: "number"; value: string }
  | { kind: "licensePlate"; value: string }
  | { kind: "document"; value: string }
  | null;

// A API não tem filtro "q" global. Ela expõe `document`, `licensePlate` e
// `number` (todos CONTAINS, combinados via AND). Roteamos a busca do usuário
// para o campo certo com base no formato do termo digitado.
function classifySearch(raw: string | undefined): SearchTarget {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Número da apólice (formato "SEG-2026-0001" ou parcial "SEG", "2026").
  if (/^seg([\s\-]?\d)?/i.test(trimmed) || /^seg/i.test(trimmed)) {
    return { kind: "number", value: trimmed.toUpperCase() };
  }

  const digits = onlyDigits(trimmed);
  const hasLetters = /[a-z]/i.test(trimmed);

  // Placa: contém letra E dígito. Normaliza (upper, sem hífen).
  if (hasLetters && digits.length > 0) {
    return { kind: "licensePlate", value: normalizePlate(trimmed) };
  }

  // Somente dígitos → CPF/CNPJ (o banco guarda só dígitos).
  if (digits.length > 0 && !hasLetters) {
    return { kind: "document", value: digits };
  }

  // Só letras (parte inicial da placa, ex: "ABC") → tenta placa também.
  if (hasLetters) {
    return { kind: "licensePlate", value: normalizePlate(trimmed) };
  }

  return null;
}

type ServerListParams = Record<
  string,
  string | number | boolean | undefined | null
>;

function toServerParams(params: ListPoliciesParams): ServerListParams {
  const out: ServerListParams = {
    page: params.page,
    pageSize: params.pageSize,
    status: params.status,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
  };
  const target = classifySearch(params.q);
  if (target) {
    out[target.kind] = target.value;
  }
  return out;
}

export const policiesApi = {
  list(params: ListPoliciesParams = {}, signal?: AbortSignal) {
    return api.get<Paginated<Policy>>(BASE, toServerParams(params), signal);
  },
  getById(id: string, signal?: AbortSignal) {
    return api.get<Policy>(`${BASE}/${id}`, undefined, signal);
  },
  expiring(signal?: AbortSignal) {
    return api.get<ExpiringResponse>(`${BASE}/expiring`, undefined, signal);
  },
  history(id: string, signal?: AbortSignal) {
    return api.get<StatusHistoryResponse>(
      `${BASE}/${id}/history`,
      undefined,
      signal,
    );
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
