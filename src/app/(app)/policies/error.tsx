"use client";

import { RouteError } from "@/components/shared/route-error";

export default function PoliciesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError title="Não foi possível carregar as apólices" {...props} />
  );
}
