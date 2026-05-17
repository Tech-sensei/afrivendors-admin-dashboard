import { Filter, Search, X } from "lucide-react"
import { SelectField } from "./shared"

export const RATING_FILTER_OPTIONS = ["All", "5", "4", "3", "2", "1"] as const
export type ReviewRatingFilter = (typeof RATING_FILTER_OPTIONS)[number]

export function ReviewsFilters({
  customerNameQuery,
  onCustomerNameQueryChange,
  vendorNameQuery,
  onVendorNameQueryChange,
  showFilters,
  onToggleFilters,
  selectedRating,
  onSelectedRatingChange,
}: {
  customerNameQuery: string
  onCustomerNameQueryChange: (value: string) => void
  vendorNameQuery: string
  onVendorNameQueryChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  selectedRating: ReviewRatingFilter
  onSelectedRatingChange: (value: ReviewRatingFilter) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className={`flex flex-col gap-3 ${showFilters ? "mb-4" : ""} lg:flex-row lg:items-end`}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={customerNameQuery}
            onChange={(event) => onCustomerNameQueryChange(event.target.value)}
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {customerNameQuery ? (
            <button
              type="button"
              onClick={() => onCustomerNameQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70"
              aria-label="Clear customer search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            placeholder="Search by vendor name..."
            value={vendorNameQuery}
            onChange={(event) => onVendorNameQueryChange(event.target.value)}
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {vendorNameQuery ? (
            <button
              type="button"
              onClick={() => onVendorNameQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70"
              aria-label="Clear vendor search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onToggleFilters}
          className={
            showFilters
              ? "inline-flex items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-3 font-unageo text-sm font-semibold text-white"
              : "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 font-unageo text-sm font-semibold text-secondary-000"
          }
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {showFilters ? (
        <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 md:max-w-xs">
          <SelectField
            label="Rating"
            value={selectedRating}
            onChange={(v) => onSelectedRatingChange(v as ReviewRatingFilter)}
            options={[...RATING_FILTER_OPTIONS]}
          />
        </div>
      ) : null}
    </section>
  )
}