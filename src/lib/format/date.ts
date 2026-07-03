import { differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatISODate(iso: string): string {
  const d = parseISO(iso);
  if (!isValid(d)) return "";
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

export function formatISODateTime(iso: string): string {
  const d = parseISO(iso);
  if (!isValid(d)) return "";
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function daysUntil(iso: string, reference: Date = new Date()): number {
  const d = parseISO(iso);
  if (!isValid(d)) return Number.NaN;
  return differenceInCalendarDays(d, reference);
}
