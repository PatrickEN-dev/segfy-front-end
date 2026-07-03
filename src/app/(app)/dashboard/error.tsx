"use client";

import { RouteError } from "@/components/shared/route-error";

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError title="Não foi possível carregar o painel" {...props} />;
}
