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

const brlNumber = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function maskCurrencyBRL(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  const value = Number(digits) / 100;
  if (!Number.isFinite(value)) return "";
  return brlNumber.format(value);
}

export function numberToCurrencyInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  return maskCurrencyBRL(value.toFixed(2).replace(/\D/g, ""));
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
