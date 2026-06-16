"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { CheckCircle, Eye, Star, Users } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { Vendor } from "@/components/vendorManagement/data"
import { statusBadge } from "./shared"

export function VendorsTable({
  vendors,
  isLoading = false,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: {
  vendors: Vendor[]
  isLoading?: boolean
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (vendor: Vendor) => void
}) {
  const columns = useMemo<ColumnDef<Vendor, unknown>[]>(
    () => [
      {
        id: "vendor",
        header: "Vendor",
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.name}</p>
            <p className="mt-0.5 inline-flex max-w-[320px] items-center gap-1 truncate font-unageo text-xs text-accent-70">
              {row.original.email}
              {row.original.verified ? <CheckCircle className="h-3.5 w-3.5 shrink-0 text-chart-2" /> : null}
            </p>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "country", header: "Country" },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => statusBadge(row.original.status),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
            <span className="font-unageo text-sm font-semibold text-secondary-000">
              {row.original.rating > 0 ? row.original.rating.toFixed(1) : "N/A"}
            </span>
          </div>
        ),
      },
      { accessorKey: "bookingsCompleted", header: "Bookings" },
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
      data={vendors}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="vendors"
      minWidth="980px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty icon={Users} title="No vendors found" description="Try a different search." />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} vendors`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}
