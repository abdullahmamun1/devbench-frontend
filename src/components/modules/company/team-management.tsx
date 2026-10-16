"use client";

import { UsersRound } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/constants/roles";
import { useLocalTable, useMyCompany } from "@/hooks";
import type { CompanyMember } from "@/types";
import InviteMemberDialog from "./invite-member-dialog";

const ROLE_OPTIONS = [
  { label: "Owner", value: "COMPANY_OWNER" },
  { label: "Creators", value: "ASSESSMENT_CREATOR" },
  { label: "Evaluators", value: "EVALUATOR" },
];

const matchesMember = (m: CompanyMember, term: string) =>
  m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term);
const hasRole = (m: CompanyMember, role: string) => m.role === role;

const columns: DataTableColumn<CompanyMember>[] = [
  {
    key: "name",
    header: "Name",
    cell: (member) => <span className="font-medium">{member.name}</span>,
  },
  { key: "email", header: "Email", cell: (member) => member.email },
  {
    key: "role",
    header: "Role",
    cell: (member) => (
      <Badge variant="outline">{ROLE_LABELS[member.role]}</Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (member) => <StatusBadge status={member.status} />,
  },
];

export default function TeamManagement() {
  const { data, isLoading, isError } = useMyCompany();
  const table = useLocalTable(data?.data.users, {
    matches: matchesMember,
    filter: hasRole,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold">Team</h1>
          <p className="text-sm text-muted-foreground">
            People who can work in your company workspace.
          </p>
        </div>
        <InviteMemberDialog />
      </div>

      {isError ? (
        <EmptyState
          icon={UsersRound}
          title="We couldn't load your team"
          description="Check your connection and refresh the page."
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs
              options={ROLE_OPTIONS}
              value={table.filterValue}
              onValueChange={table.setFilter}
            />
            <SearchInput
              placeholder="Search by name or email..."
              onSearch={table.setTerm}
            />
          </div>
          <DataTable
            columns={columns}
            data={table.pageRows}
            getRowKey={(member) => member.id}
            isLoading={isLoading}
            skeletonRows={4}
            empty={
              <EmptyState
                icon={UsersRound}
                title={
                  table.isFiltered
                    ? "No matching members"
                    : "No team members yet"
                }
                description={
                  table.isFiltered
                    ? "Try a different role or search term."
                    : "Invite an assessment creator or an evaluator to get started."
                }
              />
            }
          />
          <TablePagination
            page={table.page}
            limit={table.pageSize}
            total={table.total}
            onPageChange={table.setPage}
          />
        </>
      )}

      <p className="text-sm text-muted-foreground">
        Invitations are sent by email and expire if they aren&apos;t accepted. A
        member appears in this list once they accept.
      </p>
    </div>
  );
}
