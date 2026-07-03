"use client";

import { RouteError } from "@/components/shared/route-error";

export default function NewPolicyError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError title="Não foi possível abrir o cadastro" {...props} />
  );
}
