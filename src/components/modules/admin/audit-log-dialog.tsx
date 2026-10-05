"use client";

import StatusBadge from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAction } from "@/constants/audit";
import type { AuditLog } from "@/types";
import { formatDateTime } from "@/utils/format";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

interface AuditLogDialogProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditLogDialog({ log, onClose }: AuditLogDialogProps) {
  return (
    <Dialog
      open={log !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {log ? formatAction(log.action) : "Audit log"}
          </DialogTitle>
          <DialogDescription>
            {log ? formatDateTime(log.createdAt) : ""}
          </DialogDescription>
        </DialogHeader>

        {log && (
          <div className="space-y-4">
            <dl className="space-y-2">
              <Row label="Actor">
                <span className="font-medium">{log.actor.name}</span>{" "}
                <span className="text-muted-foreground">
                  ({log.actor.email})
                </span>
              </Row>
              <Row label="Role">
                <StatusBadge status={log.actorRole} />
              </Row>
              <Row label="Entity">{log.entityType}</Row>
              <Row label="Entity ID">
                <code className="font-mono text-xs">{log.entityId}</code>
              </Row>
              <Row label="Log ID">
                <code className="font-mono text-xs">{log.id}</code>
              </Row>
            </dl>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Details</p>
              {log.metadata && Object.keys(log.metadata).length > 0 ? (
                <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              ) : (
                <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  No extra details were recorded for this action.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
