export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatDocument(raw: string): string {
  const digits = onlyDigits(raw);
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return raw;
}

export function documentKind(raw: string): "CPF" | "CNPJ" | "UNKNOWN" {
  const len = onlyDigits(raw).length;
  if (len === 11) return "CPF";
  if (len === 14) return "CNPJ";
  return "UNKNOWN";
}

export function isValidCpfCnpj(raw: string): boolean {
  const digits = onlyDigits(raw);
  if (digits.length === 11) return validateCpf(digits);
  if (digits.length === 14) return validateCnpj(digits);
  return false;
}

function validateCpf(cpf: string): boolean {
  if (/^(\d)\1+$/.test(cpf)) return false;
  const calc = (base: string, factor: number) => {
    let sum = 0;
    for (const ch of base) {
      sum += Number(ch) * factor--;
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

function validateCnpj(cnpj: string): boolean {
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, ...weights1];
  const calc = (base: string, weights: number[]) => {
    const sum = base.split("").reduce((acc, ch, i) => acc + Number(ch) * (weights[i] ?? 0), 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const d1 = calc(cnpj.slice(0, 12), weights1);
  const d2 = calc(cnpj.slice(0, 13), weights2);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}
