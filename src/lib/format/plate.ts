const OLD_PATTERN = /^[A-Z]{3}-?\d{4}$/;
const MERCOSUL_PATTERN = /^[A-Z]{3}\d[A-Z]\d{2}$/;

export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function formatPlate(raw: string): string {
  const value = normalizePlate(raw);
  if (value.length !== 7) return raw;
  if (/^[A-Z]{3}\d{4}$/.test(value)) {
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  }
  return value;
}

export function isValidPlate(raw: string): boolean {
  const value = normalizePlate(raw);
  if (value.length !== 7) return false;
  return OLD_PATTERN.test(value) || MERCOSUL_PATTERN.test(value);
}
