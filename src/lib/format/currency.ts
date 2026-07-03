const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrencyBRL(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "";
  return brl.format(n);
}

export function parseCurrencyBRL(input: string): number | null {
  if (!input) return null;
  const normalized = input
    .replace(/\s/g, "")
    .replace(/[R$ ]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
