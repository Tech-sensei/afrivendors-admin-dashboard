"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Users } from "lucide-react"
import { useMemo } from "react"
import { formatCustomerDate, type Customer } from "@/components/customerManagement/data"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import { AdminTablePagination } from "@/components/adminShared/AdminTablePagination"
import { statusBadge, verificationBadge } from "./shared"

export function CustomersTable({
  customers,
  unfilteredPageCount,
  serverTotal,
  serverPage,
  serverTotalPages,
  serverLimit,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  isLoading,
}: {
  customers: Customer[]
  unfilteredPageCount: number
  serverTotal: number
  serverPage: number
  serverTotalPages: number
  serverLimit: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (customer: Customer) => void
  isLoading?: boolean
}) {
  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => [
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="max-w-[min(100%,280px)]">
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.name}</p>
            <p className="mt-0.5 truncate font-unageo text-xs text-accent-70" title={row.original.email}>
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        meta: { cellClassName: "whitespace-nowrap" },
      },
      {
        accessorKey: "joinedDate",
        header: "Joined",
        meta: { cellClassName: "whitespace-nowrap" },
        cell: ({ row }) => formatCustomerDate(row.original.joinedDate),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => statusBadge(row.original.status),
      },
      {
        id: "verification",
        header: "Verification",
        enableSorting: false,
        cell: ({ row }) => verificationBadge(row.original.verified),
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

  if (isLoading) {
    return (
      <AdminDataTable
        data={[]}
        columns={columns}
        isLoading
        resourceLabel="customers"
      />
    )
  }

  if (!customers.length && unfilteredPageCount > 0) {
    const rangeStartFiltered = serverTotal === 0 ? 0 : (serverPage - 1) * serverLimit + 1
    const rangeEndFiltered = Math.min(serverPage * serverLimit, serverTotal)

    return (
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="p-10 text-center font-unageo text-sm text-accent-70">
          <Users className="mx-auto h-10 w-10 text-accent-60" />
          <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No matching customers</h3>
          <p className="mt-1">
            Nothing on this page matches your search or filters. Try clearing them or go to another page.
          </p>
        </div>
        {(totalPages > 1 || serverTotal > 0) && (
          <AdminTablePagination
            summary={
              <>
                <p>
                  {serverTotal === 0
                    ? "No users loaded"
                    : `Showing ${rangeStartFiltered}–${rangeEndFiltered} of ${serverTotal} customers`}
                </p>
                <span className="mt-1 block text-accent-70">
                  0 visible after filters · Page {serverPage} of {serverTotalPages}
                </span>
              </>
            }
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </section>
    )
  }

  const rangeStart = serverTotal === 0 ? 0 : (serverPage - 1) * serverLimit + 1
  const rangeEnd = Math.min(serverPage * serverLimit, serverTotal)
  const filterHidesRows = customers.length < unfilteredPageCount

  return (
    <AdminDataTable
      data={customers}
      columns={columns}
      resourceLabel="customers"
      minWidth="720px"
      getRowId={(row) => String(row.numericId)}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty
          icon={Users}
          title="No customers found"
          description="Try another page or adjust filters on this page"
        />
      }
      pagination={
        totalPages > 1 || serverTotal > 0
          ? {
              summary: (
                <>
                  <p>
                    {serverTotal === 0
                      ? "No users loaded"
                      : `Showing ${rangeStart}–${rangeEnd} of ${serverTotal} customers`}
                  </p>
                  {filterHidesRows ? (
                    <span className="mt-1 block text-accent-70">
                      {customers.length} visible on this page after filters · Page {serverPage} of {serverTotalPages}
                    </span>
                  ) : (
                    <span className="mt-1 block">
                      Page {serverPage} of {Math.max(serverTotalPages, 1)}
                    </span>
                  )}
                </>
              ),
              currentPage,
              totalPages,
              onPageChange,
              showWhenSinglePage: true,
            }
          : undefined
      }
    />
  )
}
