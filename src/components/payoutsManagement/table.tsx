"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DollarSign, Eye } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { PayoutRequest } from "./data"
import { statusBadge } from "./shared"

export function PayoutsTable({
  payouts,
  isLoading = false,
  filteredCount,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onViewDetails,
}: {
  payouts: PayoutRequest[]
  isLoading?: boolean
  filteredCount: number
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewDetails: (payout: PayoutRequest) => void
}) {
  const columns = useMemo<ColumnDef<PayoutRequest, unknown>[]>(
    () => [
      {
        id: "vendor",
        header: "Vendor",
        accessorFn: (row) => row.vendorName,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.vendorName}</p>
            <p className="mt-0.5 max-w-[320px] truncate font-unageo text-xs text-accent-70">
              {row.original.vendorEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-secondary-000">
            ${row.original.amount.toLocaleString()}
          </span>
        ),
      },
      {
        id: "bank",
        header: "Bank Details",
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm text-secondary-000">
              {row.original.bankName === "—" ? "—" : row.original.bankName}
            </p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">
              {row.original.accountNumber === "—" ? "Not provided" : row.original.accountNumber}
            </p>
          </div>
        ),
      },
      {
        id: "dateRequested",
        header: "Date Requested",
        accessorFn: (row) => row.dateRequested,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm text-secondary-000">{row.original.dateRequested}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.timeRequested}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => statusBadge(row.original.status),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onViewDetails(row.original)}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ),
      },
    ],
    [onViewDetails],
  )

  return (
    <AdminDataTable
      data={payouts}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="payouts"
      minWidth="1080px"
      getRowId={(row) => row.id}
      emptyState={
        <AdminTableEmpty
          icon={DollarSign}
          title="No payout requests found"
          description="Try adjusting filters or search."
        />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} payout requests`,
              currentPage,
              totalPages,
              onPageChange,
              prevLabel: "Previous",
            }
          : undefined
      }
    />
  )
}
