import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground">
          O recurso solicitado não existe ou foi removido.
        </p>
        <Button asChild>
          <Link href="/dashboard">Voltar para o painel</Link>
        </Button>
      </div>
    </div>
  );
}
