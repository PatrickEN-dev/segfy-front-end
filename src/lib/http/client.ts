import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { env } from "@/lib/env";
import { ApiError, type ApiErrorPayload } from "./api-error";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 60_000;

function pruneQuery(query?: RequestOptions["query"]): Record<string, string> | undefined {
  if (!query) return undefined;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = String(value);
  }
  return Object.keys(out).length ? out : undefined;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ""),
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

function toApiError(err: AxiosError): ApiError {
  if (err.response) {
    const payload = err.response.data as { error?: ApiErrorPayload } | null;
    const body = payload?.error;
    return new ApiError({
      status: err.response.status,
      code: body?.code ?? "UNKNOWN",
      message: body?.message ?? err.response.statusText ?? "Request failed",
      requestId: body?.requestId,
      details: body?.details,
    });
  }
  return new ApiError({
    status: 0,
    code: "NETWORK_ERROR",
    message: "Falha de rede. Verifique se a API está acessível.",
  });
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, signal, query, timeoutMs } = options;

  const config: AxiosRequestConfig = {
    url: path.startsWith("/") ? path : `/${path}`,
    method,
    params: pruneQuery(query),
    data: body,
    signal,
    timeout: timeoutMs ?? DEFAULT_TIMEOUT_MS,
    headers: new AxiosHeaders(),
  };

  if (body !== undefined) {
    (config.headers as AxiosHeaders).set("Content-Type", "application/json");
  }

  try {
    const response = await axiosClient.request<TResponse>(config);
    if (response.status === 204) return undefined as TResponse;
    return response.data as TResponse;
  } catch (cause) {
    if (axios.isCancel(cause)) throw cause;
    if (
      cause instanceof DOMException &&
      (cause.name === "AbortError" || cause.name === "CanceledError")
    ) {
      throw cause;
    }
    if (axios.isAxiosError(cause)) {
      throw toApiError(cause);
    }
    throw new ApiError({
      status: 0,
      code: "UNKNOWN",
      message: cause instanceof Error ? cause.message : "Erro desconhecido.",
    });
  }
}

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "GET", query, signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "POST", body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "PUT", body, signal }),
  delete: <T = void>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "DELETE", signal }),
};
