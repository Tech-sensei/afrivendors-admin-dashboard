import { Ban, Calendar, Check, CheckCircle, Clock, XCircle } from "lucide-react"
import type { AdminAppointmentsBreakdown } from "@/types/admin-appointments"

export function BookingStats({
  breakdown,
  isLoading,
  isError,
}: {
  breakdown: AdminAppointmentsBreakdown | null | undefined
  isLoading?: boolean
  isError?: boolean
}) {
  if (isLoading && breakdown == null) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <article
            key={i}
            className="h-[88px] animate-pulse rounded-xl border border-border bg-secondary-800/60"
          />
        ))}
      </section>
    )
  }

  if (breakdown == null) {
    return (
      <p className="rounded-xl border border-border bg-white px-4 py-3 font-unageo text-sm text-accent-70 shadow-sm">
        {isError ? "Could not load appointment statistics." : "No statistics available."}
      </p>
    )
  }

  const b = breakdown
  const total = b.pending + b.accepted + b.rejected + b.canceled + b.completed

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard icon={Calendar} label="Total appointments" value={String(total)} tone="primary" />
      <StatCard icon={Clock} label="Pending" value={String(b.pending)} tone="info" />
      <StatCard icon={Check} label="Accepted" value={String(b.accepted)} tone="success" />
      <StatCard icon={CheckCircle} label="Completed" value={String(b.completed)} tone="success" />
      <StatCard icon={Ban} label="Canceled" value={String(b.canceled)} tone="danger" />
      <StatCard icon={XCircle} label="Rejected" value={String(b.rejected)} tone="neutral" />
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  tone: "primary" | "success" | "danger" | "info" | "neutral"
}) {
  const toneClass =
    tone === "success"
      ? "text-chart-2 bg-chart-2/10"
      : tone === "danger"
        ? "text-destructive bg-destructive/10"
        : tone === "info"
          ? "text-chart-1 bg-chart-1/10"
          : tone === "neutral"
            ? "text-accent-70 bg-accent-20"
            : "text-primary-100 bg-primary-100/10"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
        </div>
      </div>
    </article>
  )
}
