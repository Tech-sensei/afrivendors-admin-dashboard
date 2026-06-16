"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, MessageSquare } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { ReviewItem } from "./data"
import { statusBadge, truncate } from "./shared"

function formatReviewDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function ReviewsTable({
  reviews,
  isLoading = false,
  filteredCount,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onViewDetails,
}: {
  reviews: ReviewItem[]
  isLoading?: boolean
  filteredCount: number
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewDetails: (review: ReviewItem) => void
}) {
  const columns = useMemo<ColumnDef<ReviewItem, unknown>[]>(
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
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-secondary-000">{row.original.rating}.0</span>
        ),
      },
      {
        accessorKey: "reviewText",
        header: "Review",
        enableSorting: false,
        meta: { cellClassName: "max-w-[320px]" },
        cell: ({ row }) => (
          <span className="font-unageo text-sm text-secondary-000">{truncate(row.original.reviewText, 60)}</span>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorFn: (row) => row.date,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm text-secondary-000">{formatReviewDate(row.original.date)}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">{row.original.time}</p>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => statusBadge(row.original.status, row.original.flagged),
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
      data={reviews}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="reviews"
      minWidth="1100px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty
          icon={MessageSquare}
          title="No reviews found"
          description="Try adjusting your filters or search"
        />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} reviews`,
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
