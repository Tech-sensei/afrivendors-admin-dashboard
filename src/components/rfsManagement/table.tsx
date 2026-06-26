"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, FileText } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { RfsRequest } from "./data"
import { formatMoney, formatShortDate, paymentBadge, statusBadge } from "./shared"

export function RfsTable({
  requests,
  isLoading = false,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: {
  requests: RfsRequest[]
  isLoading?: boolean
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (request: RfsRequest) => void
}) {
  const columns = useMemo<ColumnDef<RfsRequest, unknown>[]>(
    () => [
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customerName,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">
              {row.original.customerName}
            </p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.customerEmail}</p>
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Request",
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.title}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.category}</p>
          </div>
        ),
      },
      {
        id: "vendor",
        header: "Vendor",
        accessorFn: (row) => row.vendorName,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">
              {row.original.vendorName}
            </p>
            {row.original.vendorEmail !== "—" ? (
              <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.vendorEmail}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: "amount",
        header: "Agreed / Budget",
        cell: ({ row }) => {
          const { agreedAmount, budget } = row.original
          const showAgreed = agreedAmount > 0
          const showBudget = budget > 0 && (!showAgreed || Math.abs(budget - agreedAmount) > 0.01)

          return (
            <div>
              <p className="font-unageo text-sm font-semibold text-secondary-000">
                {showAgreed ? formatMoney(agreedAmount) : showBudget ? formatMoney(budget) : "—"}
              </p>
              {showAgreed && showBudget ? (
                <p className="mt-0.5 font-unageo text-xs text-accent-70">
                  Budget {formatMoney(budget)}
                </p>
              ) : null}
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Submitted",
        accessorFn: (row) => row.createdAt,
        cell: ({ row }) => (
          <span className="font-unageo text-sm text-secondary-000">
            {row.original.createdAt ? formatShortDate(row.original.createdAt) : "—"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => statusBadge(row.original.status),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        enableSorting: false,
        cell: ({ row }) => paymentBadge(row.original.paymentStatus),
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
              onViewDetails(row.original)
            }}
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
      data={requests}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="custom requests"
      minWidth="1100px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty
          icon={FileText}
          title="No custom requests found"
          description="Try adjusting status or search."
        />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} custom requests`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}
