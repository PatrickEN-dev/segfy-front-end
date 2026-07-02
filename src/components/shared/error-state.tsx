"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/http/api-error";

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Não foi possível carregar os dados",
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const description =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Tente novamente em alguns instantes.";

  const requestId =
    error instanceof ApiError && error.requestId
      ? error.requestId
      : null;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 px-6 py-8 text-left",
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="max-w-md text-xs text-muted-foreground">
          {description}
        </p>
        {requestId && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Ref. {requestId}
          </p>
        )}
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
