import { Filter, Search, X } from "lucide-react"
import { SelectField } from "./shared"

export function CustomerFilters({
  searchQuery,
  onSearchQueryChange,
  showFilters,
  onToggleFilters,
  selectedStatus,
  onSelectedStatusChange,
  selectedVerification,
  onSelectedVerificationChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  selectedStatus: string
  onSelectedStatusChange: (value: string) => void
  selectedVerification: string
  onSelectedVerificationChange: (value: string) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70"
              aria-label="Clear"
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
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 md:grid-cols-2">
          <SelectField
            label="Status"
            value={selectedStatus}
            onChange={onSelectedStatusChange}
            options={["All", "Active", "Pending", "Suspended"]}
          />
          <SelectField
            label="Verification"
            value={selectedVerification}
            onChange={onSelectedVerificationChange}
            options={["All", "Verified", "Unverified"]}
          />
        </div>
      ) : null}
    </section>
  )
}
