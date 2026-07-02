import { env } from "@/lib/env";
import { ApiError, type ApiErrorPayload } from "./api-error";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseError(response: Response): Promise<ApiError> {
  let payload: { error?: ApiErrorPayload } | null = null;
  try {
    payload = (await response.json()) as { error?: ApiErrorPayload };
  } catch {
    // response body was not JSON — fall through
  }

  const err = payload?.error;
  return new ApiError({
    status: response.status,
    code: err?.code ?? "UNKNOWN",
    message: err?.message ?? response.statusText ?? "Request failed",
    requestId: err?.requestId,
    details: err?.details,
  });
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, signal, query } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw cause;
    }
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Falha de rede. Verifique se a API está acessível.",
    });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const api = {
  get: <T,>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "GET", query, signal }),
  post: <T,>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "POST", body, signal }),
  put: <T,>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "PUT", body, signal }),
  delete: <T = void,>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "DELETE", signal }),
};
