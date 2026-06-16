"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Calendar, Eye } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { Booking } from "./data"
import { formatShortDate, paymentBadge, statusBadge } from "./shared"

export function BookingsTable({
  bookings,
  isLoading = false,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: {
  bookings: Booking[]
  isLoading?: boolean
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (booking: Booking) => void
}) {
  const columns = useMemo<ColumnDef<Booking, unknown>[]>(
    () => [
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customerName,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.customerName}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.customerEmail}</p>
          </div>
        ),
      },
      { accessorKey: "vendorName", header: "Vendor" },
      { accessorKey: "service", header: "Service" },
      {
        id: "dateTime",
        header: "Date & Time",
        accessorFn: (row) => row.date,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm text-secondary-000">{formatShortDate(row.original.date)}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.time}</p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-secondary-000">
            {row.original.amount > 0 ? `$${row.original.amount}` : "—"}
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
      data={bookings}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="appointments"
      minWidth="1000px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty
          icon={Calendar}
          title="No appointments found"
          description="Try adjusting status or search."
        />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} appointments`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}
