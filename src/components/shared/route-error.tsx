"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RouteErrorProps {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Corpo padrão dos error boundaries de rota (error.tsx). Renderiza dentro
 * do layout do app, então sidebar e topbar continuam navegáveis.
 */
export function RouteError({ title, error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center"
    >
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Erro inesperado
      </p>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Tente novamente em alguns instantes."}
      </p>
      {error.digest && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Ref. {error.digest}
        </p>
      )}
      <Button size="sm" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
