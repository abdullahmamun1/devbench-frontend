import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ErrorState from "./error-state";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[] | undefined;
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  /** Shown instead of the table when there are no rows */
  empty?: ReactNode;
  /** The request failed. Shown only when there are no rows to display */
  isError?: boolean;
  errorTitle?: string;
  onRetry?: () => void;
}

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRows = 6,
  empty,
  isError = false,
  errorTitle,
  onRetry,
}: DataTableProps<T>) {
  const rows = data ?? [];

  if (isError && !isLoading && rows.length === 0) {
    return <ErrorState title={errorTitle} onRetry={onRetry} />;
  }

  if (!isLoading && rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow key={getRowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
