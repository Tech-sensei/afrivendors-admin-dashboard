import { AlertTriangle, Clock, Lock, Scale, ShieldCheck } from "lucide-react"
import type { DisputeStats } from "@/types/admin-disputes"

export function DisputesStats({
  stats,
  isLoading,
}: {
  stats: DisputeStats | null
  isLoading?: boolean
}) {
  if (isLoading || !stats) {
    return (
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <article
            key={i}
            className="h-[88px] animate-pulse rounded-xl border border-border bg-secondary-800/60"
          />
        ))}
      </section>
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard icon={Scale} label="Total disputes" value={stats.total} sub="All cases" tone="primary" />
      <StatCard icon={AlertTriangle} label="Open" value={stats.open} sub="Needs attention" tone="danger" />
      <StatCard icon={Clock} label="Under review" value={stats.underReview} sub="Being investigated" tone="warning" />
      <StatCard icon={ShieldCheck} label="Resolved" value={stats.resolved} sub="Closed cases" tone="success" />
      <StatCard icon={Lock} label="Escrow frozen" value={stats.escrowFrozen} sub="Funds on hold" tone="neutral" />
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  sub: string
  tone: "primary" | "danger" | "warning" | "success" | "neutral"
}) {
  const toneClass =
    tone === "danger"
      ? "text-destructive bg-destructive/10"
      : tone === "warning"
        ? "text-chart-5 bg-chart-5/15"
        : tone === "success"
          ? "text-chart-2 bg-chart-2/10"
          : tone === "neutral"
            ? "text-accent-70 bg-accent-20"
            : "text-primary-100 bg-primary-100/10"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
          <p className="font-unageo text-[11px] text-accent-70">{sub}</p>
        </div>
      </div>
    </article>
  )
}
