import { EyeOff, Flag, MessageSquare } from "lucide-react"
import type { AdminReviewsBreakdown } from "@/types/admin-reviews"

export function ReviewsStats({
  breakdown,
  isLoading,
  isError,
}: {
  breakdown: AdminReviewsBreakdown | null | undefined
  isLoading?: boolean
  isError?: boolean
}) {
  if (isLoading && breakdown == null) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
        {isError ? "Could not load review statistics." : "No statistics available."}
      </p>
    )
  }

  const b = breakdown

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card icon={MessageSquare} tone="primary" label="Total reviews" value={String(b.totalReviews)} sub="All time" />
      <Card icon={EyeOff} tone="muted" label="Hidden reviews" value={String(b.hiddenReviews)} sub="Moderated content" />
      <Card icon={Flag} tone="warning" label="Flagged reviews" value={String(b.flaggedReviews)} sub="Needs attention" />
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
  tone: "primary" | "muted" | "warning"
  label: string
  value: string
  sub: string
}) {
  const toneClass =
    tone === "muted"
      ? "text-accent-70 bg-accent-40/20"
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
