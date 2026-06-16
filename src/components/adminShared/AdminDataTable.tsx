"use client"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AdminListTableLoading } from "./AdminListTableLoading"
import { AdminTablePagination } from "./AdminTablePagination"

export type AdminDataTablePaginationConfig = {
  summary: React.ReactNode
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  prevLabel?: string
  nextLabel?: string
  /** Show footer even when totalPages is 1 (e.g. customer list metadata) */
  showWhenSinglePage?: boolean
}

export type AdminDataTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  isLoading?: boolean
  resourceLabel?: string
  minWidth?: string
  emptyState?: React.ReactNode
  getRowId?: (row: TData, index: number) => string
  onRowClick?: (row: TData) => void
  enableSorting?: boolean
  pagination?: AdminDataTablePaginationConfig
  footer?: React.ReactNode
}

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5 shrink-0 opacity-70" />
  if (direction === "desc") return <ArrowDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
  return <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />
}

export function AdminDataTable<TData>({
  data,
  columns,
  isLoading = false,
  resourceLabel = "records",
  minWidth = "720px",
  emptyState,
  getRowId,
  onRowClick,
  enableSorting = true,
  pagination,
  footer,
}: AdminDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getRowId,
    enableSortingRemoval: true,
  })

  if (isLoading) {
    return <AdminListTableLoading resourceLabel={resourceLabel} />
  }

  if (!data.length && emptyState) {
    return <>{emptyState}</>
  }

  if (!data.length) {
    return null
  }

  const showPaginationFooter =
    pagination &&
    (pagination.showWhenSinglePage || pagination.totalPages > 1 || Boolean(pagination.summary))

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border bg-secondary-800/50">
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align ?? "left"
                  const canSort = enableSorting && header.column.getCanSort()
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 font-unageo text-[11px] font-semibold uppercase tracking-wide text-accent-70",
                        align === "right" && "text-right",
                        align === "center" && "text-center",
                        header.column.columnDef.meta?.headerClassName,
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1.5 hover:text-secondary-000",
                            align === "right" && "ml-auto",
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortIndicator direction={header.column.getIsSorted()} />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  "border-b border-border transition last:border-b-0",
                  onRowClick && "cursor-pointer hover:bg-secondary-800/60",
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const align = cell.column.columnDef.meta?.align ?? "left"
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3",
                        align === "right" && "text-right",
                        align === "center" && "text-center",
                        cell.column.columnDef.meta?.cellClassName,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footer}

      {showPaginationFooter ? (
        <AdminTablePagination
          summary={pagination.summary}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          prevLabel={pagination.prevLabel}
          nextLabel={pagination.nextLabel}
        />
      ) : null}
    </section>
  )
}
