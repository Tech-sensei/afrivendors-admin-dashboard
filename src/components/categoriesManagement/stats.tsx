import { Building2, Tag } from "lucide-react"

export function CategoryStats({
  totalCategories,
  totalVendors,
  categoriesWithIcons,
}: {
  totalCategories: number
  totalVendors: number
  categoriesWithIcons: number
}) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card icon={Tag} tone="primary" label="Total Categories" value={String(totalCategories)} sub="Platform-wide categories" />
      <Card icon={Building2} tone="success" label="Total Vendors" value={String(totalVendors)} sub="Across all categories" />
      <Card icon={Tag} tone="info" label="With Icons" value={String(categoriesWithIcons)} sub="Categories that have an icon set" />
    </section>
  )
}

function Card({
  icon: Icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  tone: "primary" | "info" | "success"
  label: string
  value: string
  sub: string
}) {
  const toneClass =
    tone === "info"
      ? "text-chart-1 bg-chart-1/15"
      : tone === "success"
        ? "text-chart-2 bg-chart-2/15"
        : "text-primary-100 bg-primary-100/15"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
          <p className="font-unageo text-xs text-accent-70">{sub}</p>
        </div>
      </div>
    </article>
  )
}
