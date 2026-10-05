import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogs } from "@/components/modules/admin/audit-logs";

export const metadata: Metadata = { title: "Audit logs" };

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit logs</h1>
        <p className="text-sm text-muted-foreground">
          A record of who did what across the platform, newest first.
        </p>
      </div>
      <Suspense>
        <AuditLogs />
      </Suspense>
    </div>
  );
}
