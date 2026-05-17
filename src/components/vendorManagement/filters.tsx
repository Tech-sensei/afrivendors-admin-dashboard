import { Search, X } from "lucide-react"

export function VendorFilters({
  searchQuery,
  onSearchQueryChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by vendor name or email…"
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
    </section>
  )
}
