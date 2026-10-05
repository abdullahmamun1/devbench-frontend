"use client";

import { useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import SearchInput from "@/components/shared/search-input";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { AUDIT_ENTITY_TYPES, formatAction, shortId } from "@/constants/audit";
import { useAuditLogs, useUrlState } from "@/hooks";
import type { AuditLog } from "@/types";
import { formatDateTime } from "@/utils/format";
import { AuditLogDialog } from "./audit-log-dialog";

const LIMIT = 20;

export function AuditLogs() {
  const { get, set } = useUrlState();
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const page = Number(get("page", "1")) || 1;
  const typeParam = get("entityType");
  const entityType = AUDIT_ENTITY_TYPES.find((t) => t === typeParam);
  const entityId = get("entityId");

  const { data, isLoading, isError } = useAuditLogs({
    page,
    limit: LIMIT,
    entityType,
    entityId: entityId || undefined,
  });

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: "when",
      header: "When",
      className: "whitespace-nowrap",
      cell: (log) => formatDateTime(log.createdAt),
    },
    {
      key: "action",
      header: "Action",
      cell: (log) => (
        <span className="font-medium">{formatAction(log.action)}</span>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      className: "hidden md:table-cell",
      cell: (log) => (
        <div className="min-w-0">
          <p className="truncate">{log.actor.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {log.actor.email}
          </p>
        </div>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      cell: (log) => (
        <div className="flex flex-col items-start gap-0.5">
          <span>{log.entityType}</span>
          <button
            type="button"
            title={`Show everything for ${log.entityId}`}
            onClick={() => set({ entityId: log.entityId })}
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {shortId(log.entityId)}
          </button>
        </div>
      ),
    },
    {
      key: "details",
      header: "",
      className: "text-right",
      cell: (log) => (
        <Button variant="outline" size="sm" onClick={() => setSelected(log)}>
          Details
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <EmptyState
        title="Could not load the audit log"
        description="Check your connection and refresh the page."
      />
    );
  }

  const hasFilters = Boolean(entityType || entityId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          aria-label="Entity type"
          value={entityType ?? ""}
          onChange={(e) => set({ entityType: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="">All entity types</option>
          {AUDIT_ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <SearchInput
          paramKey="entityId"
          placeholder="Entity ID (exact match)"
          className="sm:max-w-sm"
        />

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => set({ entityType: "", entityId: "" })}
          >
            Clear filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(log) => log.id}
        isLoading={isLoading}
        skeletonRows={10}
        empty={
          <EmptyState
            title={hasFilters ? "No matching entries" : "No activity yet"}
            description={
              hasFilters
                ? "Try a different entity type or ID."
                : "Actions across the platform are recorded here as they happen."
            }
          />
        }
      />

      <TablePagination
        page={page}
        limit={LIMIT}
        total={data?.meta?.total ?? 0}
        onPageChange={(p) => set({ page: p })}
      />

      <AuditLogDialog log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
