"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PoliciesTable } from "@/features/policies/components/policies-table";
import { PolicyDeleteDialog } from "@/features/policies/components/policy-delete-dialog";
import {
  PoliciesToolbar,
  SORT_OPTIONS,
  type SortOption,
  type StatusFilter,
} from "@/features/policies/components/policies-toolbar";
import { usePoliciesList } from "@/features/policies/hooks/use-policies-list";
import {
  POLICY_STATUS,
  type Policy,
  type PolicySortDir,
  type PolicySortField,
  type PolicyStatus,
} from "@/features/policies/types/policy-types";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const DEFAULT_PAGE_SIZE = 20;
const STATUS_SET = new Set<PolicyStatus>(POLICY_STATUS);

function readInt(
  value: string | null,
  fallback: number,
  min: number,
  max?: number,
): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min) return fallback;
  if (max !== undefined && parsed > max) return fallback;
  return parsed;
}

function readStatus(value: string | null): StatusFilter {
  if (value && STATUS_SET.has(value as PolicyStatus)) {
    return value as PolicyStatus;
  }
  return "all";
}

function readSort(value: string | null): SortOption {
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : "recent";
}

function sortToParams(sort: SortOption): {
  sortBy?: PolicySortField;
  sortDir?: PolicySortDir;
} {
  if (sort === "recent") return {};
  const [sortBy, sortDir] = sort.split(":") as [PolicySortField, PolicySortDir];
  return { sortBy, sortDir };
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={<PoliciesPageFallback />}>
      <PoliciesPageInner />
    </Suspense>
  );
}

function PoliciesPageFallback() {
  return (
    <>
      <PageHeader
        title="Apólices"
        description="Cadastro de apólices de seguro automóvel."
      />
      <div className="rounded-md border border-border bg-background">
        <div className="space-y-2 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}

function PoliciesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = readInt(searchParams.get("page"), 1, 1);
  const pageSize = readInt(
    searchParams.get("pageSize"),
    DEFAULT_PAGE_SIZE,
    1,
    100,
  );
  const urlSearch = searchParams.get("q") ?? "";
  const status = readStatus(searchParams.get("status"));
  const sort = readSort(searchParams.get("sort"));

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const query = usePoliciesList({
    page,
    pageSize,
    q: urlSearch || undefined,
    status: status === "all" ? undefined : status,
    ...sortToParams(sort),
  });
  const [toDelete, setToDelete] = useState<Policy | null>(null);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(
        params.toString() ? `/policies?${params.toString()}` : "/policies",
      );
    },
    [router, searchParams],
  );

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === urlSearch) return;
    updateParams({ q: trimmed || null, page: "1" });
  }, [debouncedSearch, urlSearch, updateParams]);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const setPage = useCallback(
    (next: number) => updateParams({ page: String(next) }),
    [updateParams],
  );

  const setStatus = useCallback(
    (value: StatusFilter) =>
      updateParams({ status: value === "all" ? null : value, page: "1" }),
    [updateParams],
  );

  const setSort = useCallback(
    (value: SortOption) =>
      updateParams({ sort: value === "recent" ? null : value, page: "1" }),
    [updateParams],
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    updateParams({ q: null, status: null, page: "1" });
  }, [updateParams]);

  const hasFilters = urlSearch.trim().length > 0 || status !== "all";
  const policies = query.data?.data ?? [];
  const meta = query.data?.meta;

  let content: React.ReactNode;
  if (query.isLoading && !query.data) {
    content = (
      <div className="space-y-2 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  } else if (query.error && !query.data) {
    content = <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  } else if (policies.length === 0 && !hasFilters) {
    content = (
      <EmptyState
        title="Nenhuma apólice cadastrada"
        description="Cadastre a primeira apólice para começar a operar."
        action={
          <Button asChild size="sm">
            <Link href="/policies/new">Cadastrar apólice</Link>
          </Button>
        }
      />
    );
  } else if (policies.length === 0) {
    content = (
      <EmptyState
        title="Nenhum resultado"
        description="Nenhuma apólice corresponde aos filtros aplicados."
        action={
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        <PoliciesTable policies={policies} onDelete={setToDelete} />
        {meta && (
          <Pagination
            page={meta.page}
            pageSize={meta.pageSize}
            total={meta.total}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Apólices"
        description="Cadastro de apólices de seguro automóvel."
        actions={
          <Button asChild>
            <Link href="/policies/new">Nova apólice</Link>
          </Button>
        }
      />

      <div className="rounded-md border border-border bg-background">
        <PoliciesToolbar
          search={searchInput}
          status={status}
          sort={sort}
          onSearchChange={setSearchInput}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onClear={clearFilters}
          hasFilters={hasFilters}
          resultCount={meta?.total}
          isFetching={query.isFetching && !query.isLoading}
        />
        {content}
      </div>

      <PolicyDeleteDialog
        policy={toDelete}
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      />
    </>
  );
}
