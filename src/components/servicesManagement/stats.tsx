import { Building2, Package, Tag, TrendingUp } from "lucide-react"

export function ServicesStats({
  totalServices,
  activeServices,
  totalCategories,
  activeCategories,
  totalVendors,
  totalBookings,
}: {
  totalServices: number
  activeServices: number
  totalCategories: number
  activeCategories: number
  totalVendors: number
  totalBookings: number
}) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card icon={Package} tone="primary" label="Total Services" value={String(totalServices)} sub={`${activeServices} active`} />
      <Card icon={Tag} tone="info" label="Categories" value={String(totalCategories)} sub={`${activeCategories} active`} />
      <Card icon={Building2} tone="success" label="Total Vendors" value={String(totalVendors)} sub="Across all categories" />
      <Card icon={TrendingUp} tone="warning" label="Total Bookings" value={String(totalBookings)} sub="All time" />
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
  tone: "primary" | "info" | "success" | "warning"
  label: string
  value: string
  sub: string
}) {
  const toneClass =
    tone === "info"
      ? "text-chart-1 bg-chart-1/15"
      : tone === "success"
        ? "text-chart-2 bg-chart-2/15"
        : tone === "warning"
          ? "text-chart-5 bg-chart-5/15"
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
