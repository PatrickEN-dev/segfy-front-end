import { ApiError } from "./api-error";

/**
 * Traduz as mensagens de erro que a segfy-api devolve em inglês para pt-BR.
 *
 * A API expõe dois tipos de mensagem:
 *  - domain exceptions (DOMAIN_VALIDATION / INVALID_STATE / NOT_FOUND), com
 *    texto pronto e, às vezes, partes dinâmicas (placa, status);
 *  - erros do FluentValidation (VALIDATION_ERROR), com o padrão de mensagem
 *    default e o nome de exibição do campo entre aspas.
 *
 * Mapeamos as mensagens exatas e, para as parametrizadas, usamos regex que
 * preservam a parte dinâmica. Se nada casar, devolvemos a mensagem original.
 */

/** Nomes de exibição de campo (FluentValidation) -> rótulo em pt-BR. */
const FIELD_LABELS: Record<string, string> = {
  Document: "O documento",
  "License Plate": "A placa",
  LicensePlate: "A placa",
  "Premium Amount": "O valor do prêmio",
  PremiumAmount: "O valor do prêmio",
  "Coverage Start": "A data de início da vigência",
  CoverageStart: "A data de início da vigência",
  "Coverage End": "A data de fim da vigência",
  CoverageEnd: "A data de fim da vigência",
  Status: "O status",
  "Status Reason": "O motivo",
  StatusReason: "O motivo",
};

function fieldLabel(raw: string): string {
  return FIELD_LABELS[raw] ?? `O campo "${raw}"`;
}

/** Mensagens de domínio com texto fixo. */
const EXACT: Record<string, string> = {
  "CoverageStart is required.": "A data de início da vigência é obrigatória.",
  "CoverageEnd is required.": "A data de fim da vigência é obrigatória.",
  "CoverageEnd must be greater than CoverageStart.":
    "A data de fim da vigência deve ser posterior à data de início.",
  "CoverageEnd cannot be earlier than today.":
    "A data de fim da vigência não pode ser anterior a hoje.",
  "Status must be one of: Ativa, Cancelada, Expirada.":
    "O status deve ser Ativa, Cancelada ou Expirada.",
  "Document is invalid.": "CPF ou CNPJ inválido.",
  "License plate is invalid.": "Placa do veículo inválida.",
  "Premium must be greater than zero.":
    "O valor do prêmio deve ser maior que zero.",
  "Premium can have at most 2 decimal places.":
    "O valor do prêmio pode ter no máximo 2 casas decimais.",
  "Policy number year is out of range.":
    "O ano do número da apólice está fora do intervalo.",
  "Policy number sequential must be positive.":
    "O sequencial do número da apólice deve ser positivo.",
  "Policy number is invalid.": "Número da apólice inválido.",
};

/** Mensagens com partes dinâmicas (placa, status) ou geradas pelo FluentValidation. */
const PATTERNS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [
    /^There is already an active policy for vehicle (.+)\.$/,
    (m) => `Já existe uma apólice ativa para o veículo ${m[1]}.`,
  ],
  [/^Policy .+ not found\.$/, () => "Apólice não encontrada."],
  [
    /^Policy details can only be updated while status is Ativa\. Current status: (.+)\.$/,
    (m) =>
      `Os dados da apólice só podem ser alterados enquanto o status for Ativa. Status atual: ${m[1]}.`,
  ],
  [
    /^Cannot transition policy status from (.+) to (.+)\.$/,
    (m) => `Não é possível alterar o status da apólice de ${m[1]} para ${m[2]}.`,
  ],
  // FluentValidation defaults
  [
    /^'(.+?)' must not be empty\.$/,
    (m) => `${fieldLabel(m[1] ?? "")} é obrigatório.`,
  ],
  [
    /^The length of '(.+?)' must be (\d+) characters or fewer.*$/,
    (m) => `${fieldLabel(m[1] ?? "")} deve ter no máximo ${m[2]} caracteres.`,
  ],
  [
    /^'(.+?)' must be greater than '(.+?)'\.$/,
    (m) => `${fieldLabel(m[1] ?? "")} deve ser maior que ${m[2]}.`,
  ],
];

/** Traduz uma única mensagem vinda da API; devolve o original se não casar. */
export function translateApiMessage(message: string): string {
  if (!message) return message;
  const trimmed = message.trim();
  if (EXACT[trimmed]) return EXACT[trimmed];
  for (const [regex, build] of PATTERNS) {
    const match = trimmed.match(regex);
    if (match) return build(match);
  }
  return message;
}

/** Mensagens genéricas por código, quando não há texto de domínio útil. */
const CODE_FALLBACK: Record<string, string> = {
  VALIDATION_ERROR: "Há erros de validação. Revise os campos destacados.",
  NETWORK_ERROR: "Falha de rede. Verifique sua conexão e se a API está acessível.",
  INTERNAL_ERROR: "Ocorreu um erro inesperado no servidor. Tente novamente.",
  UNKNOWN: "Ocorreu um erro inesperado.",
};

/** Mensagem de topo, traduzida, para qualquer erro. */
export function apiErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiError) {
    const byCode = CODE_FALLBACK[error.code];
    if (byCode) return byCode;
    return translateApiMessage(error.message);
  }
  return fallback ?? "Ocorreu um erro inesperado.";
}

/** Erros por campo (details do VALIDATION_ERROR), já traduzidos. */
export function translateFieldErrors(error: ApiError): Record<string, string[]> {
  const fields = error.fieldErrors();
  const out: Record<string, string[]> = {};
  for (const [name, messages] of Object.entries(fields)) {
    out[name] = messages.map(translateApiMessage);
  }
  return out;
}
