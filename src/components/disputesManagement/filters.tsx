import { Filter, Search, X } from "lucide-react"
import { disputeStatusFilterOptions, type DisputeStatusFilter } from "@/lib/mapAdminDispute"

export function DisputesFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: DisputeStatusFilter
  onStatusFilterChange: (value: DisputeStatusFilter) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by case ID, customer, vendor, or order..."
          className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70 hover:text-secondary-000"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
        <span className="inline-flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
          <Filter className="h-4 w-4 text-accent-70" />
          Status
        </span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as DisputeStatusFilter)}
          className="rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100 sm:min-w-[200px]"
        >
          {disputeStatusFilterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
