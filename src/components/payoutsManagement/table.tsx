import { ChevronLeft, ChevronRight, DollarSign, Eye } from "lucide-react"
import type { PayoutRequest } from "./data"
import { AdminListTableLoading } from "@/components/adminShared/AdminListTableLoading"
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
  if (isLoading) {
    return <AdminListTableLoading resourceLabel="payouts" />
  }

  if (!payouts.length) {
    return (
      <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <DollarSign className="mx-auto h-10 w-10 text-accent-60" />
        <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No payout requests found</h3>
        <p className="mt-1 font-unageo text-sm text-accent-70">Try adjusting filters or search.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Vendor", "Amount", "Bank Details", "Date Requested", "Status", "Actions"].map((head) => (
                <th key={head} className={`px-4 py-3 text-left font-unageo text-[11px] font-semibold uppercase tracking-wide text-accent-70 ${head === "Actions" ? "text-right" : ""}`}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b border-border transition hover:bg-secondary-800/60">
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{payout.vendorName}</p>
                  <p className="mt-0.5 max-w-[320px] truncate font-unageo text-xs text-accent-70">{payout.vendorEmail}</p>
                </td>
                <td className="px-4 py-3 font-unageo text-sm font-semibold text-secondary-000">${payout.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm text-secondary-000">{payout.bankName === "—" ? "—" : payout.bankName}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">{payout.accountNumber === "—" ? "Not provided" : payout.accountNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm text-secondary-000">{payout.dateRequested}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">{payout.timeRequested}</p>
                </td>
                <td className="px-4 py-3">{statusBadge(payout.status)}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => onViewDetails(payout)} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800">
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
            Showing {startIndex + 1} to {endIndex} of {filteredCount} payout requests
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
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={page === currentPage ? "h-8 min-w-8 rounded-md bg-primary-100 px-2 font-unageo text-xs font-semibold text-white" : "h-8 min-w-8 rounded-md border border-border px-2 font-unageo text-xs font-semibold text-secondary-000"}
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
