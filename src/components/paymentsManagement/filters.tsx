import { Filter, Search, X } from "lucide-react"
import { SelectField } from "./shared"

export function PaymentFilters({
  searchQuery,
  onSearchQueryChange,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusFilterChange,
  methodFilter,
  onMethodFilterChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  methodFilter: string
  onMethodFilterChange: (value: string) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by transaction ID, customer, vendor, or booking..."
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {searchQuery ? (
            <button type="button" onClick={() => onSearchQueryChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex gap-2">
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
      </div>

      {showFilters ? (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 md:grid-cols-2">
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={["All", "Completed", "Pending", "Refunded", "Failed"]}
          />
          <SelectField
            label="Payment Method"
            value={methodFilter}
            onChange={onMethodFilterChange}
            options={["All", "Online", "Wallet", "Venue"]}
          />
        </div>
      ) : null}
    </section>
  )
}

export function WalletFilters({
  searchQuery,
  onSearchQueryChange,
  showFilters,
  onToggleFilters,
  typeFilter,
  onTypeFilterChange,
  userTypeFilter,
  onUserTypeFilterChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  userTypeFilter: string
  onUserTypeFilterChange: (value: string) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by transaction ID, user name, or user ID..."
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {searchQuery ? (
            <button type="button" onClick={() => onSearchQueryChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex gap-2">
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
      </div>

      {showFilters ? (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 md:grid-cols-2">
          <SelectField
            label="Transaction Type"
            value={typeFilter}
            onChange={onTypeFilterChange}
            options={["All", "Top-up", "Credit", "Debit", "Withdrawal"]}
          />
          <SelectField
            label="User Type"
            value={userTypeFilter}
            onChange={onUserTypeFilterChange}
            options={["All", "Customer", "Vendor"]}
          />
        </div>
      ) : null}
    </section>
  )
}
