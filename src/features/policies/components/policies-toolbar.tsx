"use client";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  POLICY_STATUS,
  type PolicyStatus,
} from "@/features/policies/types/policy-types";

export type StatusFilter = PolicyStatus | "all";

interface PoliciesToolbarProps {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onClear: () => void;
  hasFilters?: boolean;
  resultCount?: number;
  isFetching?: boolean;
}

export function PoliciesToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
  hasFilters = false,
  resultCount,
  isFetching = false,
}: PoliciesToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[hsl(var(--hairline))] px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por número, CPF/CNPJ ou placa"
            aria-label="Buscar apólices"
          />
          {isFetching && (
            <Loader2
              className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden
            />
          )}
        </div>

        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as StatusFilter)}
        >
          <SelectTrigger
            className="w-full md:w-[180px]"
            aria-label="Filtrar por status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {POLICY_STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            Limpar
          </Button>
        )}
      </div>

      {resultCount !== undefined && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          <strong className="font-medium text-foreground">{resultCount}</strong>{" "}
          {resultCount === 1 ? "resultado" : "resultados"}
        </p>
      )}
    </div>
  );
}
