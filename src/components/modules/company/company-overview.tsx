"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import {
  ClipboardCheck,
  ClipboardList,
  Code2,
  Coins,
  CreditCard,
  type LucideIcon,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABELS } from "@/constants/roles";
import {
  useAssessmentCount,
  useCredits,
  useGetMe,
  useMyCompany,
  usePendingEvaluationCount,
  useProblemCount,
} from "@/hooks";
import type { CreditTransaction, UserRole } from "@/types";
import { formatDateTime } from "@/utils/format";

const ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}[] = [
  {
    label: "Create a problem",
    href: "/company/problems/new",
    icon: Code2,
    roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
  },
  {
    label: "Create an assessment",
    href: "/company/assessments/new",
    icon: ClipboardList,
    roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
  },
  {
    label: "Review submissions",
    href: "/company/evaluations",
    icon: ClipboardCheck,
    roles: ["COMPANY_OWNER", "EVALUATOR"],
  },
  {
    label: "Buy credits",
    href: "/company/billing",
    icon: CreditCard,
    roles: ["COMPANY_OWNER"],
  },
];

// "-" when a request failed, so one broken endpoint doesn't blank the page
const countValue = (query: UseQueryResult<number>) =>
  query.isError ? "-" : (query.data ?? 0);

const SIGNED_TYPES = new Set(["PURCHASE", "REFUND"]);

function signedAmount(tx: CreditTransaction) {
  if (tx.type === "ADJUSTMENT")
    return tx.amount > 0 ? `+${tx.amount}` : `${tx.amount}`;
  return SIGNED_TYPES.has(tx.type) ? `+${tx.amount}` : `-${tx.amount}`;
}

const transactionColumns: DataTableColumn<CreditTransaction>[] = [
  { key: "date", header: "Date", cell: (tx) => formatDateTime(tx.createdAt) },
  {
    key: "type",
    header: "Type",
    cell: (tx) => <StatusBadge status={tx.type} />,
  },
  {
    key: "amount",
    header: "Credits",
    className: "text-right",
    cell: (tx) => <span className="font-medium">{signedAmount(tx)}</span>,
  },
  {
    key: "balance",
    header: "Balance",
    className: "text-right",
    cell: (tx) => tx.balanceAfter,
  },
];

export default function CompanyOverview() {
  const user = useGetMe().data?.data;
  const role = user?.role;

  const isOwner = role === "COMPANY_OWNER";
  const canManageContent = isOwner || role === "ASSESSMENT_CREATOR";
  const canReview = isOwner || role === "EVALUATOR";

  // Each hook runs only for the roles that see its card
  const problems = useProblemCount(canManageContent);
  const assessments = useAssessmentCount(canManageContent);
  const pending = usePendingEvaluationCount(canReview);
  const company = useMyCompany(isOwner);
  const credits = useCredits(isOwner);

  // AuthGuard and RoleGuard in the layouts guarantee the user is loaded
  if (!user || !role) return null;

  const actions = ACTIONS.filter((action) => action.roles.includes(role));
  const recent = credits.data?.data.recentTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user.company?.companyName} &middot; {ROLE_LABELS[role]}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Credit balance"
          value={user.company?.creditBalance ?? 0}
          icon={Coins}
          description="One credit per invitation"
        />
        {canManageContent && (
          <StatCard
            title="Problems"
            value={countValue(problems)}
            icon={Code2}
            isLoading={problems.isLoading}
          />
        )}
        {canManageContent && (
          <StatCard
            title="Assessments"
            value={countValue(assessments)}
            icon={ClipboardList}
            isLoading={assessments.isLoading}
          />
        )}
        {canReview && (
          <StatCard
            title="Pending evaluations"
            value={countValue(pending)}
            icon={ClipboardCheck}
            isLoading={pending.isLoading}
            description="Waiting for a reviewer"
          />
        )}
        {isOwner && (
          <StatCard
            title="Team members"
            value={
              company.isError ? "-" : (company.data?.data.users.length ?? 0)
            }
            icon={UsersRound}
            isLoading={company.isLoading}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {actions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={buttonVariants({ variant: "outline" })}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent credit activity</CardTitle>
            <Link
              href="/company/billing"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              View billing
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={recent}
              getRowKey={(tx) => tx.id}
              isLoading={credits.isLoading}
              skeletonRows={3}
              empty={
                <EmptyState
                  icon={Coins}
                  title="No credit activity yet"
                  description="Purchases and invitations will show up here."
                />
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
