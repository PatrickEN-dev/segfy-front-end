"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PolicyStatusBadge } from "./policy-status-badge";
import { formatCurrencyBRL } from "@/lib/format/currency";
import { formatISODate } from "@/lib/format/date";
import {
  formatPolicyDocument,
  formatPolicyPlate,
} from "@/features/policies/utils/policy-formatters";
import type { Policy } from "@/features/policies/types/policy-types";

interface PoliciesTableProps {
  policies: Policy[];
  onDelete?: (policy: Policy) => void;
}

export function PoliciesTable({ policies, onDelete }: PoliciesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Segurado</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead className="text-right">Prêmio</TableHead>
          <TableHead>Vigência</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[60px] text-right">
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => (
          <TableRow key={policy.id}>
            <TableCell>
              <Link
                href={`/policies/${policy.id}`}
                className="font-mono text-sm font-medium tabular-nums text-foreground hover:underline"
              >
                {policy.number}
              </Link>
            </TableCell>
            <TableCell className="font-mono tabular-nums text-muted-foreground">
              {formatPolicyDocument(policy.document)}
            </TableCell>
            <TableCell className="font-mono text-muted-foreground">
              {formatPolicyPlate(policy.licensePlate)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrencyBRL(policy.premiumAmount)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
              {formatISODate(policy.coverageStart)}
              <span className="mx-1.5 text-muted-foreground/70">a</span>
              {formatISODate(policy.coverageEnd)}
            </TableCell>
            <TableCell>
              <PolicyStatusBadge status={policy.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground"
                    aria-label={`Ações da apólice ${policy.number}`}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href={`/policies/${policy.id}`}>Ver detalhes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/policies/${policy.id}/edit`}>Editar</Link>
                  </DropdownMenuItem>
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(event) => {
                          event.preventDefault();
                          onDelete(policy);
                        }}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
