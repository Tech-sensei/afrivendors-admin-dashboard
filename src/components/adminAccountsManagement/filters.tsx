import { Search, X } from "lucide-react"
import { adminRoleOptions } from "./data"
import { SelectField } from "./shared"

export function AdminAccountsFilters({
  searchQuery,
  onSearchQueryChange,
  selectedStatus,
  onSelectedStatusChange,
  selectedRole,
  onSelectedRoleChange,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  selectedStatus: string
  onSelectedStatusChange: (value: string) => void
  selectedRole: string
  onSelectedRoleChange: (value: string) => void
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-border py-3 pl-10 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-end">
        <p className="font-unageo text-sm font-semibold text-secondary-000 md:pb-2.5">Filter:</p>
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <SelectField
            label="Status"
            value={selectedStatus}
            onChange={onSelectedStatusChange}
            options={["All Status", "Active", "Suspended"]}
          />
          <SelectField
            label="Role"
            value={selectedRole}
            onChange={onSelectedRoleChange}
            options={["All Roles", ...adminRoleOptions]}
          />
        </div>
      </div>
    </section>
  )
}
