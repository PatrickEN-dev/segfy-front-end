"use client";

import { RouteError } from "@/components/shared/route-error";

export default function ExpiringError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError title="Não foi possível carregar os vencimentos" {...props} />
  );
}
