export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "DOMAIN_VALIDATION"
  | "NOT_FOUND"
  | "INVALID_STATE"
  | "INTERNAL_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  requestId?: string;
  details?: Record<string, string[]> | Record<string, unknown>;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly requestId?: string;
  readonly details?: ApiErrorPayload["details"];

  constructor(payload: ApiErrorPayload & { status: number }) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.status = payload.status;
    this.requestId = payload.requestId;
    this.details = payload.details;
  }

  fieldErrors(): Record<string, string[]> {
    if (!this.details || typeof this.details !== "object") return {};
    return Object.fromEntries(
      Object.entries(this.details).flatMap(([k, v]) =>
        Array.isArray(v) ? [[k, v as string[]]] : [],
      ),
    );
  }
}
