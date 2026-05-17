import { Search, X } from "lucide-react"
import { SelectField } from "./shared"

const STATUS_OPTIONS = ["All", "Pending", "Accepted", "Rejected", "Canceled", "Completed"] as const

export type BookingStatusFilter = (typeof STATUS_OPTIONS)[number]

export function BookingFilters({
  vendorNameQuery,
  onVendorNameQueryChange,
  statusFilter,
  onStatusFilterChange,
}: {
  vendorNameQuery: string
  onVendorNameQueryChange: (value: string) => void
  statusFilter: BookingStatusFilter
  onStatusFilterChange: (value: BookingStatusFilter) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
          <input
            type="text"
            value={vendorNameQuery}
            onChange={(e) => onVendorNameQueryChange(e.target.value)}
            placeholder="Search by vendor name..."
            className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
          {vendorNameQuery ? (
            <button
              type="button"
              onClick={() => onVendorNameQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="w-full lg:max-w-[220px]">
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={(v) => onStatusFilterChange(v as BookingStatusFilter)}
            options={[...STATUS_OPTIONS]}
          />
        </div>
      </div>
    </section>
  )
}
