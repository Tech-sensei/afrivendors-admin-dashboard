import { ChevronLeft, ChevronRight, Eye, MessageSquare } from "lucide-react"
import type { ReviewItem } from "./data"
import { AdminListTableLoading } from "@/components/adminShared/AdminListTableLoading"
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
  if (isLoading) {
    return <AdminListTableLoading resourceLabel="reviews" />
  }

  if (!reviews.length) {
    return (
      <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <MessageSquare className="mx-auto h-10 w-10 text-accent-60" />
        <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">No reviews found</h3>
        <p className="mt-1 font-unageo text-sm text-accent-70">Try adjusting your filters or search</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Customer", "Vendor", "Rating", "Review", "Date", "Status", "Actions"].map((head) => (
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
            {reviews.map((review) => (
              <tr
                key={review.id}
                onClick={() => onViewDetails(review)}
                className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60"
              >
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{review.customerName}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">{review.customerEmail}</p>
                </td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{review.vendorName}</td>
                <td className="px-4 py-3 font-unageo text-sm font-semibold text-secondary-000">
                  {review.rating}.0
                </td>
                <td className="max-w-[320px] px-4 py-3 font-unageo text-sm text-secondary-000">
                  {truncate(review.reviewText, 60)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm text-secondary-000">{formatReviewDate(review.date)}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">{review.time}</p>
                </td>
                <td className="px-4 py-3">{statusBadge(review.status, review.flagged)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetails(review)
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
            Showing {startIndex + 1} to {endIndex} of {filteredCount} reviews
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
