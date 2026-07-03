const DEFAULT_DEV_TARGET = "http://localhost:5000";

export class SegfyUpstreamError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "SegfyUpstreamError";
    this.status = status;
    this.code = code;
  }
}

export function segfyBaseUrl(): string {
  const raw = process.env.SEGFY_API_URL?.trim();
  if (raw) {
    if (!/^https?:\/\//i.test(raw)) {
      throw new Error(`SEGFY_API_URL deve começar com http:// ou https:// (recebido: "${raw}").`);
    }
    return raw.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SEGFY_API_URL não está definida. Configure a variável de ambiente apontando para a URL pública do backend.",
    );
  }
  return DEFAULT_DEV_TARGET;
}

interface UpstreamErrorBody {
  error?: { code?: string; message?: string };
}

// O Render (free tier) dorme após 15 min; a primeira request pós-sleep pode
// levar ~30 s. O timeout precisa acomodar esse cold start.
const UPSTREAM_TIMEOUT_MS = 60_000;

export async function segfyGet<T>(path: string): Promise<T> {
  const url = `${segfyBaseUrl()}/api/v1${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (cause) {
    throw new SegfyUpstreamError(
      502,
      "UPSTREAM_UNAVAILABLE",
      cause instanceof Error && cause.name === "TimeoutError"
        ? "A API demorou demais para responder (cold start do Render?)."
        : "Não foi possível conectar à API de apólices.",
    );
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as UpstreamErrorBody | null;
    throw new SegfyUpstreamError(
      res.status,
      body?.error?.code ?? "UPSTREAM_ERROR",
      body?.error?.message ?? `A API respondeu com status ${res.status}.`,
    );
  }
  return (await res.json()) as T;
}
