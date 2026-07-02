import { formatDocument } from "@/lib/format/document";
import { formatPlate } from "@/lib/format/plate";

export function formatPolicyDocument(digits: string): string {
  return formatDocument(digits);
}

export function formatPolicyPlate(plate: string): string {
  return formatPlate(plate);
}
