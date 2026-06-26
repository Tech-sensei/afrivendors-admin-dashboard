"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Scale } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { DisputeItem } from "@/types/admin-disputes"
import {
  customerAvatar,
  disputeStatusBadge,
  escrowStatusBadge,
  formatDisputeDateLabel,
  formatDisputeMoney,
} from "./shared"

export function DisputesTable({
  disputes,
  isLoading,
  filteredCount,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onViewCase,
}: {
  disputes: DisputeItem[]
  isLoading?: boolean
  filteredCount: number
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewCase: (dispute: DisputeItem) => void
}) {
  const columns = useMemo<ColumnDef<DisputeItem, unknown>[]>(
    () => [
      {
        accessorKey: "caseId",
        header: "Case",
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.caseId}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.orderTitle}</p>
          </div>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customerName,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            {customerAvatar(row.original.customerInitials)}
            <div className="min-w-0">
              <p className="truncate font-unageo text-sm font-semibold text-secondary-000">
                {row.original.customerName}
              </p>
              <p className="truncate font-unageo text-xs text-accent-70">{row.original.customerEmail}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "vendorName",
        header: "Vendor",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-unageo text-sm text-secondary-000">{row.original.vendorName}</p>
            <p className="mt-0.5 truncate font-unageo text-xs text-accent-70">{row.original.orderLabel}</p>
          </div>
        ),
      },
      {
        accessorKey: "reason",
        header: "Issue",
        enableSorting: false,
        meta: { cellClassName: "max-w-[240px]" },
        cell: ({ row }) => (
          <p className="line-clamp-2 font-unageo text-sm leading-relaxed text-accent-80">{row.original.reason}</p>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-secondary-000">
            {formatDisputeMoney(row.original.totalAmount)}
          </span>
        ),
      },
      {
        accessorKey: "dateRaised",
        header: "Raised",
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-unageo text-sm text-accent-70">
            {formatDisputeDateLabel(row.original.dateRaised)}
          </span>
        ),
      },
      {
        id: "escrow",
        header: "Escrow",
        enableSorting: false,
        cell: ({ row }) => escrowStatusBadge(row.original.escrowFrozen),
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.displayStatus,
        enableSorting: false,
        cell: ({ row }) => disputeStatusBadge(row.original.displayStatus),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onViewCase(row.original)
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ),
      },
    ],
    [onViewCase],
  )

  return (
    <AdminDataTable
      data={disputes}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="disputes"
      minWidth="1020px"
      getRowId={(row) => String(row.id)}
      onRowClick={onViewCase}
      enableSorting={false}
      emptyState={
        <AdminTableEmpty
          icon={Scale}
          title="No disputes found"
          description="Try adjusting your search or status filter"
        />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1}–${endIndex} of ${filteredCount} disputes`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}
