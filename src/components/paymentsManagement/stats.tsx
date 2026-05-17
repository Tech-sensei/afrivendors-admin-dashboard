import { DollarSign, RefreshCw, TrendingUp, Clock } from "lucide-react"

export function PaymentsStats({
  totalRevenue,
  platformEarnings,
  pendingPayments,
  totalRefunds,
}: {
  totalRevenue: number
  platformEarnings: number
  pendingPayments: number
  totalRefunds: number
}) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} tone="primary" trend="+12.5%" />
      <StatCard icon={TrendingUp} label="Platform Earnings" value={`$${platformEarnings.toLocaleString()}`} tone="success" trend="+8.2%" />
      <StatCard icon={Clock} label="Pending Payments" value={`$${pendingPayments.toLocaleString()}`} tone="info" />
      <StatCard icon={RefreshCw} label="Total Refunds" value={`$${totalRefunds.toLocaleString()}`} tone="muted" />
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  tone: "primary" | "success" | "info" | "muted"
  trend?: string
}) {
  const toneClass =
    tone === "success"
      ? "text-chart-2 bg-chart-2/10"
      : tone === "info"
        ? "text-chart-1 bg-chart-1/10"
        : tone === "muted"
          ? "text-accent-70 bg-accent-40/20"
          : "text-primary-100 bg-primary-100/10"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <div className="flex items-center gap-2">
            <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
            {trend ? <span className="font-unageo text-xs font-semibold text-chart-2">{trend}</span> : null}
          </div>
        </div>
      </div>
    </article>
  )
}
