import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  Users,
} from "lucide-react"
import type { Vendor } from "@/components/vendorManagement/data"
import { AdminListTableLoading } from "@/components/adminShared/AdminListTableLoading"
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
  if (isLoading) {
    return <AdminListTableLoading resourceLabel="vendors" />
  }

  if (!vendors.length) {
    return (
      <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <Users className="mx-auto h-10 w-10 text-accent-60" />
        <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No vendors found</h3>
        <p className="mt-1 font-unageo text-sm text-accent-70">Try a different search.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Vendor", "Category", "Country", "Status", "Rating", "Bookings", "Actions"].map((head) => (
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
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                onClick={() => onViewDetails(vendor)}
                className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60"
              >
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{vendor.name}</p>
                  <p className="mt-0.5 inline-flex max-w-[320px] items-center gap-1 truncate font-unageo text-xs text-accent-70">
                    {vendor.email}
                    {vendor.verified ? <CheckCircle className="h-3.5 w-3.5 shrink-0 text-chart-2" /> : null}
                  </p>
                </td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{vendor.category}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{vendor.country}</td>
                <td className="px-4 py-3">{statusBadge(vendor.status)}</td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                    <span className="font-unageo text-sm font-semibold text-secondary-000">
                      {vendor.rating > 0 ? vendor.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{vendor.bookingsCompleted}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetails(vendor)
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
      {filteredCount > 0 ? (
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
          <p className="font-unageo text-sm text-accent-70">
            Showing {startIndex + 1} to {endIndex} of {filteredCount} vendors
          </p>
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
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
      ) : null}
    </section>
  )
}
