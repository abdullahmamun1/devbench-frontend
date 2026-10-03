"use client";

import { UsersRound } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/constants/roles";
import { useMyCompany } from "@/hooks";
import type { CompanyMember } from "@/types";
import InviteMemberDialog from "./invite-member-dialog";

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
        <DataTable
          columns={columns}
          data={data?.data.users}
          getRowKey={(member) => member.id}
          isLoading={isLoading}
          skeletonRows={4}
          empty={
            <EmptyState
              icon={UsersRound}
              title="No team members yet"
              description="Invite an assessment creator or an evaluator to get started."
            />
          }
        />
      )}

      <p className="text-sm text-muted-foreground">
        Invitations are sent by email and expire if they aren&apos;t accepted. A
        member appears in this list once they accept.
      </p>
    </div>
  );
}
