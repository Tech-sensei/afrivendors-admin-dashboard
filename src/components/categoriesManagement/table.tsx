import { Edit2, Eye } from "lucide-react"
import type { CategoryItem } from "./data"
import { ToggleSwitch, statusBadge } from "./shared"

export function CategoriesTable({
  categories,
  onView,
  onEdit,
  onToggleStatus,
}: {
  categories: CategoryItem[]
  onView: (category: CategoryItem) => void
  onEdit: (category: CategoryItem) => void
  onToggleStatus: (category: CategoryItem) => void
}) {
  if (!categories.length) {
    return (
      <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <p className="font-unbounded text-xl font-semibold text-secondary-000">No categories found</p>
        <p className="mt-1 font-unageo text-sm text-accent-70">Try adjusting your filters or search query</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Category Name", "Description", "Vendor Services", "Vendors", "Status", "Actions"].map((head) => (
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
            {categories.map((category) => (
              <tr
                key={category.id}
                className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60"
                onClick={() => onView(category)}
              >
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{category.name}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">{category.id}</p>
                </td>
                <td className="max-w-[320px] px-4 py-3 font-unageo text-sm text-accent-70">{category.description}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{category.serviceCount}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{category.vendorCount}</td>
                <td className="px-4 py-3">{statusBadge(category.status)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onView(category)
                      }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-secondary-000"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onEdit(category)
                      }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-secondary-000"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleStatus(category)
                      }}
                      className="rounded-md p-1"
                    >
                      <ToggleSwitch isActive={category.status === "Active"} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
