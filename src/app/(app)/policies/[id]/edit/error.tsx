"use client";

import { RouteError } from "@/components/shared/route-error";

export default function EditPolicyError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError title="Não foi possível abrir a edição" {...props} />
  );
}
