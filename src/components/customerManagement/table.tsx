import { ChevronLeft, ChevronRight, Eye, Users } from "lucide-react"
import { formatCustomerDate, type Customer } from "@/components/customerManagement/data"
import { AdminListTableLoading } from "@/components/adminShared/AdminListTableLoading"
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
  /** Row count on this page before client filters (from API) */
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
  if (isLoading) {
    return <AdminListTableLoading resourceLabel="customers" />
  }

  if (!customers.length) {
    if (unfilteredPageCount > 0) {
      const rangeStartFiltered = serverTotal === 0 ? 0 : (serverPage - 1) * serverLimit + 1
      const rangeEndFiltered = Math.min(serverPage * serverLimit, serverTotal)
      const filterHidesAll = true
      return (
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="p-10 text-center font-unageo text-sm text-accent-70">
            <Users className="mx-auto h-10 w-10 text-accent-60" />
            <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No matching customers</h3>
            <p className="mt-1">Nothing on this page matches your search or filters. Try clearing them or go to another page.</p>
          </div>
          {(totalPages > 1 || serverTotal > 0) && (
            <div className="flex flex-col items-start justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
              <div className="font-unageo text-sm text-accent-70">
                <p>
                  {serverTotal === 0
                    ? "No users loaded"
                    : `Showing ${rangeStartFiltered}–${rangeEndFiltered} of ${serverTotal} customers`}
                  {filterHidesAll ? (
                    <span className="mt-1 block text-accent-70">
                      0 visible after filters · Page {serverPage} of {serverTotalPages}
                    </span>
                  ) : null}
                </p>
              </div>
              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={
                        page === currentPage
                          ? "h-8 min-w-8 rounded-md bg-primary-100 px-2 font-unageo text-xs font-semibold text-white"
                          : "h-8 min-w-8 rounded-md border border-border px-2 font-unageo text-xs font-semibold text-secondary-000"
                      }
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>
      )
    }

    return (
      <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <Users className="mx-auto h-10 w-10 text-accent-60" />
        <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No customers found</h3>
        <p className="mt-1 font-unageo text-sm text-accent-70">Try another page or adjust filters on this page</p>
      </section>
    )
  }

  const rangeStart = serverTotal === 0 ? 0 : (serverPage - 1) * serverLimit + 1
  const rangeEnd = Math.min(serverPage * serverLimit, serverTotal)
  const filterHidesRows = customers.length < unfilteredPageCount

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Customer", "Phone", "Joined", "Status", "Verification", "Actions"].map((head) => (
                <th
                  key={head}
                  className={`px-4 py-3 text-left font-unageo text-[11px] font-semibold uppercase tracking-wide text-accent-70 ${head === "Actions" ? "text-right" : ""}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.numericId}
                onClick={() => onViewDetails(customer)}
                className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60"
              >
                <td className="max-w-[min(100%,280px)] px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{customer.name}</p>
                  <p
                    className="mt-0.5 truncate font-unageo text-xs text-accent-70"
                    title={customer.email}
                  >
                    {customer.email}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-unageo text-sm text-secondary-000">{customer.phone}</td>
                <td className="whitespace-nowrap px-4 py-3 font-unageo text-sm text-secondary-000">
                  {formatCustomerDate(customer.joinedDate)}
                </td>
                <td className="px-4 py-3">{statusBadge(customer.status)}</td>
                <td className="px-4 py-3">{verificationBadge(customer.verified)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetails(customer)
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(totalPages > 1 || serverTotal > 0) && (
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
          <div className="font-unageo text-sm text-accent-70">
            <p>
              {serverTotal === 0
                ? "No users loaded"
                : `Showing ${rangeStart}–${rangeEnd} of ${serverTotal} customers`}
              {filterHidesRows ? (
                <span className="mt-1 block text-accent-70">
                  {customers.length} visible on this page after filters · Page {serverPage} of {serverTotalPages}
                </span>
              ) : (
                <span className="mt-1 block">Page {serverPage} of {Math.max(serverTotalPages, 1)}</span>
              )}
            </p>
          </div>
          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={
                    page === currentPage
                      ? "h-8 min-w-8 rounded-md bg-primary-100 px-2 font-unageo text-xs font-semibold text-white"
                      : "h-8 min-w-8 rounded-md border border-border px-2 font-unageo text-xs font-semibold text-secondary-000"
                  }
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
