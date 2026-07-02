"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Erro inesperado
        </p>
        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "Tente novamente em instantes."}
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </div>
  );
}
